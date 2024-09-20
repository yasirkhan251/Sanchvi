from django.shortcuts import *
from django.http import JsonResponse
from .models import *
from Products.models import *
from django.urls import reverse
from django.views.decorators.http import require_POST
import json
from django.contrib.auth.decorators import login_required
import requests
# paypal settings 
import uuid
from django.conf import settings
from paypal.standard.forms import PayPalPaymentsForm

# Create your views here.






@login_required
def checkout(req):
    user = req.user
    cart = Cart.objects.filter(user=user)
   
    # Calculate total amount in INR
    total_amount_inr = sum(float(item.price) * item.qty for item in cart)

    # Your API key for the ExchangeRatesAPI
    api_key = '288aaa6e49d518c10249029d9ab6b8d2'

    # Fetch real-time conversion rate from INR to USD
    try:
        response = requests.get(f'https://api.exchangeratesapi.io/v1/latest?access_key={api_key}&symbols=USD,INR')
        data = response.json()
        if response.status_code == 200 and 'rates' in data:
            # Get conversion rate from INR to USD
            inr_to_usd_rate = data['rates']['USD'] / data['rates']['INR']
            total_amount_usd = total_amount_inr * inr_to_usd_rate
        else:
            # Handle the case where the API request was not successful
            print('Error fetching conversion rate:', data.get('error', 'Unknown error'))
            total_amount_usd = total_amount_inr  # Fallback to INR amount
    except Exception as e:
        # Handle any exceptions that occur during the API request
        print('Exception during API request:', e)
        total_amount_usd = total_amount_inr  # Fallback to INR amount

    if req.method == "POST":
        # Capture shipping address details
        name = req.POST['name']
        phone = req.POST['phone']
        address = req.POST['address']
        country = req.POST['country']
        city = req.POST['city']

        # Create a new shipping address
        shipping_address = Shipping_address.objects.create(
            name=name,
            phone=phone,
            address=address,
            country=country,
            city=city,
        )
        shipping_address.save()
        
        print('i am in payment mode')
        payment_method = req.POST.get('paymentMethod')

        if payment_method == 'paypal':
            # Setup PayPal payment with USD
            paypal_dict = {
                'business': settings.PAYPAL_RECEIVER_EMAIL,
                'amount': f"{total_amount_usd:.2f}",  # Convert amount to 2 decimal places
                'item_name': f'Order from {user.username}',
                'invoice': str(uuid.uuid4()),
                'currency_code': 'USD',     
                'notify_url': req.build_absolute_uri(reverse('paypal-ipn')),
                'return_url': req.build_absolute_uri(reverse('handle_payment_success', kwargs={'address_id': shipping_address.id})),
                'cancel_return': req.build_absolute_uri(reverse('checkout')),
            }
            form = PayPalPaymentsForm(initial=paypal_dict)
            context = {
                'order': None,
                'shipping_address': shipping_address,
                'paypal_form': form
            }
            return render(req, 'payments/paypal_payment.html', context)

    # Convert total price for each item
    for item in cart:
        item.total_price = float(item.price) * item.qty

    # Initial rendering to capture shipping details
    queryser = {'item': cart, 'total_amount': total_amount_inr}
    return render(req, 'cart/checkout.html', queryser)












@require_POST
def update_quantity(request):
    try:
        data = json.loads(request.body)
        item_id = data.get('item_id')
        quantity = data.get('quantity')

        # Update the quantity in the database
        cart_item = Cart.objects.get(id=item_id)
        cart_item.qty = quantity
        cart_item.save()

        return JsonResponse({'success': True})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})




@login_required
def addcart(req):
    if req.method == "POST":
        user = req.user
        product = req.POST['product']
        product_id = req.POST['productid']
        size = req.POST['size']
        price = req.POST['price']
        color = req.POST['color']
        qty = int(req.POST.get('qty', 1))  # default to 1 if not provided
        print(user)
        print(product)
        print(product_id)
        print(size)
        print(price)
        print(color)
        print(qty)
        # print()

        try:
            # Fetch product object
            product = Product.objects.get(id=product_id)

            # Check if this product, size, color combo already exists in the cart
            cart_item, created = Cart.objects.get_or_create(
                user=user, 
                product=product, 
                productid = product_id,
                size=size, 
                color=color,
                defaults={'price': price, 'qty': qty}
            )

            if not created:
                # If the item already exists in the cart, update the quantity
                cart_item.qty += qty
                cart_item.save()

        except Product.DoesNotExist:
            # Handle the case where the product doesn't exist
            return render(req, 'error.html', {'message': 'Product not found'})

    return redirect(reverse('addtocart'))

@login_required
def addtocart(req):
    user = req.user
    cart = Cart.objects.filter(user = user)
    
    queryser= {
        'item': cart
    }
    return render(req, 'cart/addtocart.html',queryser)

# @login_required
# def orders(req):
#     return render(req, 'cart/order.html')

from django.core.serializers import serialize
@login_required
def orders(request):
    orders = Order.objects.filter(user=request.user).select_related('address').prefetch_related('items__product')
    
    # Pass orders to the template
    return render(request, 'orders/myorders.html', {'orders': orders})

# @login_required

# def orders(request):
#     orders = Order.objects.filter(user=request.user)
#     # Serialize orders and related items
#     orders_data = []
#     for order in orders:
#         order_data = {
#             'order_id': str(order.order_id),
#             'total_amount': float(order.total_amount),
#             'created_at': order.created_at.strftime('%Y-%m-%d %H:%M:%S'),
#             'items': [
#                 {
#                     'product_name': item.product.name,
#                     'qty': item.qty,
#                     'size': item.size,
#                     'color': item.color,
#                     'price': float(item.price),
#                     'image_url': item.product.img.url if item.product.img else ''  # Assuming product.image is the ImageField
#                 } for item in order.items.all()
#             ]
#         }
#         orders_data.append(order_data)
    
#     # Pass orders_data as a JSON string to the template
#     return render(request, 'orders/myorders.html', {'orders': json.dumps(orders_data)})

@login_required
def order_success(request, order_id):
    # Fetch the order based on the order_id and user
    order = get_object_or_404(Order, order_id=order_id, user=request.user)

    # Pass the order details to the template
    return render(request, 'cart/order_success.html', {'order': order})

@login_required
def deletecart(req, cid):
    try:
        # Fetch the cart item by its ID (cid)
        cart_item = Cart.objects.get(id=cid)
        
        # Delete the cart item
        cart_item.delete()

    except Cart.DoesNotExist:
        # Handle the case where the cart item does not exist
        print("Cart item does not exist.")
    return redirect(reverse('addtocart'))









# needed to be tested
