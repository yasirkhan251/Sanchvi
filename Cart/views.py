from django.shortcuts import *
from django.http import JsonResponse
from .models import *
from Products.models import *
from django.urls import reverse
from django.views.decorators.http import require_POST
import json
from django.contrib.auth.decorators import login_required
import uuid
from django.conf import settings

# Create your views here.
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


@login_required
def orders(request):
    # Fetch all orders of the logged-in user
    user_orders = Order.objects.filter(user=request.user)

    # Pass the orders to the template
    return render(request, 'cart/orders.html', {'orders': user_orders})


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



import uuid
@login_required
def checkout(req):
    user = req.user
    cart = Cart.objects.filter(user=user)

    # Calculate total amount using float conversion
    total_amount = sum(float(item.price) * item.qty for item in cart)

    

    if req.method == "POST":
        # Create a unique order ID
        order = Order.objects.create(
            user=user,
            order_id=str(uuid.uuid4()),
            total_amount=total_amount
        )

        # Add items to the order
        for item in cart:
            OrderItem.objects.create(
                order=order,
                product=item.product,
                size=item.size,
                color=item.color,
                qty=item.qty,
                price=item.price
            )

        cart.delete()  # Clear the cart after placing the order
        return redirect(reverse('order_success', args=[order.order_id]))

    # Calculate total price for each item
    for item in cart:
        item.total_price = float(item.price) * item.qty

    queryser = {'item': cart, 'total_amount': total_amount}
    return render(req, 'cart/checkout.html', queryser)





@login_required
def checkout(req):
    user = req.user
    cart = Cart.objects.filter(user=user)

    # Calculate total amount using float conversion
    total_amount = sum(float(item.price) * item.qty for item in cart)

    if req.method == "POST":
        try:
            # Create a unique order ID
            order = Order.objects.create(
                user=user,
                order_id=str(uuid.uuid4()),
                total_amount=total_amount
            )

            # Add items to the order
            for item in cart:
                OrderItem.objects.create(
                    order=order,
                    product=item.product,
                    size=item.size,
                    color=item.color,
                    qty=item.qty,
                    price=item.price
                )

            # Clear the cart after placing the order
            cart.delete()

            # Redirect to the order success page
            return render(req, 'cart/order_success.html', args=[order.order_id])


        except Exception as e:
            print(f"Error while creating order: {e}")
            return render(req, 'cart/checkout.html', {
                'item': cart, 
                'total_amount': total_amount, 
                'error_message': 'There was an error processing your order. Please try again.'
            })

    # Set up PayPal payment details
 

    # Calculate total price for each item for display purposes
    for item in cart:
        item.total_price = float(item.price) * item.qty

    queryser = {
        'item': cart,
        'total_amount': total_amount,
      
    }
    return render(req, 'cart/checkout.html', queryser)
# from paypalrestsdk import Payment

# @login_required
# def checkout(req):
#     user = req.user
#     cart = Cart.objects.filter(user=user)

#     # Calculate total amount using float conversion
#     total_amount = sum(float(item.price) * item.qty for item in cart)

#     if req.method == "POST":
#         try:
#             # Set up PayPal payment details
#             payment = Payment({
#                 "intent": "sale",
#                 "payer": {
#                     "payment_method": "paypal"
#                 },
#                 "redirect_urls": {
#                     "return_url": req.build_absolute_uri(reverse('execute_payment')),
#                     "cancel_url": req.build_absolute_uri(reverse('checkout'))
#                 },
#                 "transactions": [{
#                     "item_list": {
#                         "items": [{
#                             "name": item.product.name,
#                             "sku": item.product.id,
#                             "price": str(item.price),
#                             "currency": "USD",  # Set currency to INR
#                             "quantity": item.qty
#                         } for item in cart]
#                     },
#                     "amount": {
#                         "total": str(total_amount),
#                         "currency": "USD"  # Set currency to INR
#                     },
#                     "description": "Order from your store"
#                 }]
#             })

#             if payment.create():
#                 # Redirect the user to PayPal for payment approval
#                 for link in payment.links:
#                     if link.rel == "approval_url":
#                         return redirect(link.href)
#             else:
#                 print(payment.error)
#                 raise Exception("Payment creation failed")

#         except Exception as e:
#             print(f"Error while creating PayPal payment: {e}")
#             return render(req, 'cart/checkout.html', {
#                 'item': cart, 
#                 'total_amount': total_amount, 
#                 'error_message': 'There was an error processing your payment. Please try again.'
#             })

#     # Calculate total price for each item for display purposes
#     for item in cart:
#         item.total_price = float(item.price) * item.qty

#     queryser = {
#         'item': cart,
#         'total_amount': total_amount,
#     }
#     return render(req, 'cart/checkout.html', queryser)





# needed to be tested
