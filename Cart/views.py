import hmac
import time
from django.shortcuts import *
from django.http import JsonResponse
from .models import *
from Products.models import *
from django.urls import reverse
from django.views.decorators.http import require_POST
import json
from django.contrib.auth.decorators import login_required
import requests
import hashlib
import base64
from django.contrib import messages
from Sanchvi.utils import *
from django.http import JsonResponse
from decimal import Decimal
# paypal settings 
import uuid
from django.conf import settings
from paypal.standard.forms import PayPalPaymentsForm
from django.views.decorators.csrf import csrf_exempt
from Admin.models import *
# from .utils import calculate_total_amount


# Create your views here.



def generate_checksum(merchant_id, transaction_id, amount, api_key):
    """Generates checksum for secure transaction"""
    payload = f"/v1/pay/{merchant_id}/{transaction_id}/{amount}/INR"
    checksum = base64.b64encode(hashlib.sha256(f"{payload}{api_key}".encode()).digest()).decode('utf-8')
    return checksum

cat = Category.objects.all()

def fetch_conversion_rate(total_amount_inr):
    api_key = 'e953cda389263846602cea63'
    try:
        response = requests.get(f'https://v6.exchangerate-api.com/v6/{api_key}/latest/INR')
        data = response.json()
        if response.status_code == 200 and 'conversion_rates' in data:
            inr_to_usd_rate = data['conversion_rates']['USD']
            return total_amount_inr * inr_to_usd_rate
        else:
            print('Error fetching conversion rate:', data.get('error', 'Unknown error'))
            return total_amount_inr  # Fallback to INR amount if API fails
    except Exception as e:
        print('Exception during API request:', e)
        return total_amount_inr * 0.01198  # Fallback to INR amount


def capture_shipping_details(req):
    # Get the shipping details from the POST request
    name = req.POST.get('name')
    phone = req.POST.get('phone')
    address1 = req.POST.get('address1')
    address2 = req.POST.get('address2')
    country_id = req.POST.get('country')
    state_id = req.POST.get('state')
    city = req.POST.get('city')
    zipcode = req.POST.get('zipcode')
    

    # Check if all required fields are provided
    if not (name and phone and address1 and address2 and country_id and state_id and city and zipcode):
        # Redirect if any required field is missing
        return redirect(reverse('checkout'))

    # Fetch country and state names with error handling
    try:
        country_fetch = Country.objects.get(id=country_id)
        country = country_fetch.name
    except Country.DoesNotExist:
        return redirect(reverse('checkout'))

    try:
        state_fetch = State.objects.get(id=state_id)
        state = state_fetch.name
    except State.DoesNotExist:
        return redirect(reverse('checkout'))

    # Check if the user already has a shipping address
    try:
        shipping_address = Shipping_address.objects.get(user=req.user)
        # Update the existing shipping address
        shipping_address.name = name
        shipping_address.phone = phone
        shipping_address.address1 = address1
        shipping_address.address2 = address2
        shipping_address.country = country
        shipping_address.state = state
        shipping_address.city = city
        shipping_address.zipcode = zipcode
        shipping_address.save()

    except Shipping_address.DoesNotExist:
        # Create a new shipping address if one doesn't exist
        shipping_address = Shipping_address.objects.create(
            user=req.user,
            name=name,
            phone=phone,
            address1=address1,
            address2=address2,
            country=country,
            state=state,
            city=city,
            zipcode=zipcode,
        )

    return shipping_address



def process_paypal_payment(req, user, total_amount_usd, shipping_address):
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


def process_phonepe_payment(req, user, total_amount_inr, shipping_address):
    orderID = "pp-" + str(uuid.uuid4())
    merchantTransactionID = "MT" + str(uuid.uuid4()) 

    payload = {
        "merchantId": settings.PHONEPE_MERCHANT_ID,
        "merchantTransactionId": merchantTransactionID,
        "merchantUserId": str(user.id),
        "amount": int(total_amount_inr * 100),  # INR to paise conversion (multiply by 100)
        "redirectUrl": req.build_absolute_uri(reverse('handle_payment_success_phonepe', kwargs={'address_id': shipping_address.id})),
        "cancelUrl": req.build_absolute_uri(reverse('payment_fail')),
        "redirectMode": "REDIRECT",
        "callbackUrl": req.build_absolute_uri(reverse('phonepe_callback')),
        "mobileNumber": shipping_address.phone,
        "paymentInstrument": {
            "type": "PAY_PAGE"
        }
    }

    payload_json = json.dumps(payload)
    base64_request = base64.b64encode(payload_json.encode()).decode()

    endpoint = "/pg/v1/pay"
    combined_string = base64_request + endpoint + settings.PHONEPE_SALT_KEY
    finalXHeader = hashlib.sha256(combined_string.encode()).hexdigest() + "###" + settings.PHONEPE_SALT_INDEX

    headers = {
        "Content-Type": "application/json",
        "X-VERIFY": finalXHeader
    }

    req_body = {"request": base64_request}
    response = requests.post(settings.PHONEPE_PAYMENT_URL, headers=headers, json=req_body)

    if response.status_code == 200:
        res_data = response.json()
        if res_data.get('success'):
            payment_url = res_data["data"]["instrumentResponse"]["redirectInfo"]["url"]
            return redirect(payment_url)
        else:
            print("PhonePe payment initiation failed:", res_data.get("message"))
            return redirect(reverse('payment_fail'))
    else:
        return redirect(reverse('payment_fail'))


def fetch_states(request):
    country_id = request.GET.get('country_id')
    if country_id:
        states = State.objects.filter(country_id=country_id).values('id', 'name','country_id')
        return JsonResponse(list(states), safe=False)
    return JsonResponse({'error': 'Invalid country'}, status=400)



def fetch_shipping_rate(request):
    country_id = request.GET.get('country_id')
    total_price = request.GET.get('total_price')
    user = request.user.id

    # Convert total_price to a Decimal and handle errors
    try:
        total_price = Decimal(total_price)
    except (TypeError, ValueError):
        return JsonResponse({'success': False, 'error': 'Invalid total price'}, status=400)

    cart = Cart.objects.filter(user=user)
    total_shipping_rate = Decimal('0')  # Use Decimal for consistency

    try:
        # Check if country exists
        country = Country.objects.get(id=country_id)
        print(f"Country found: {country}")

        # Retrieve the shipping rate
        shipping_rate = ShippingRate.objects.filter(country=country).first()
        if not shipping_rate:
            print("Shipping rate not found for the selected country.")
            return JsonResponse({'success': False, 'error': 'Shipping rate not found for the selected country.'})

        print(f"Shipping rate found for country: {shipping_rate}")

        for x in cart:
            box = x.box_size
            qty = x.qty
            print(f"Processing box size: {box}, quantity: {qty}")

            if box == 'small':
                total_shipping_rate += Decimal(shipping_rate.small) * qty
            elif box == 'medium':
                total_shipping_rate += Decimal(shipping_rate.medium) * qty
            elif box == 'large':
                total_shipping_rate += Decimal(shipping_rate.large) * qty
            elif box == 'extra_large':
                total_shipping_rate += Decimal(shipping_rate.extra_large) * qty
            else:
                total_shipping_rate = Decimal('1000')  # Use Decimal for default rate

            print(f"Current total shipping rate: {total_shipping_rate}")

        all_total_price = total_shipping_rate + total_price
        request.session['all_total_price'] = float(all_total_price)
        request.session['shippingrate'] = float(total_shipping_rate)

        print(f"Final total (product + shipping): {all_total_price}")

        return JsonResponse({'success': True, 'shipping_rate': float(total_shipping_rate), 'all_total_price': float(all_total_price)})

    except Country.DoesNotExist:
        print("Country not found.")
        return JsonResponse({'success': False, 'error': 'Country not found'}, status=404)
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        return JsonResponse({'success': False, 'error': str(e)}, status=500)

 
def checkout(req):
    user = req.user
    cart = Cart.objects.filter(user=user)
    for x in cart :
        
        box = x.box_size


        
    #         shippingrate_count = shippingratecounter(total_box_size,cart)

    # Calculate total amount in INR
    # total_amount_inr = sum(float(item.price) * item.qty for item in cart )
    total_amount_in = sum(float(item.price) * item.qty for item in cart )
    total_amount_inr = req.session.get('all_total_price',total_amount_in)
    print('the print checked :',total_amount_inr)

    # Fetch real-time conversion rate from INR to USD
    total_amount_usd = fetch_conversion_rate(total_amount_inr)

    if req.method == "POST":
        # Capture shipping address details
        # shipping_address = capture_shipping_details(req)
        name = req.POST.get('name')
        phone = req.POST.get('phone')
        address1 = req.POST.get('address1')
        address2 = req.POST.get('address2')
        country_id = req.POST.get('country')
        state_id = req.POST.get('state')
        city = req.POST.get('city')
        zipcode = req.POST.get('zipcode')
        # shipping_rate = req.POST.get('shipping_rate_country')

    # Check if all required fields are provided
        if not (name and phone and address1 and address2 and country_id and state_id and city and zipcode):
            # Redirect if any required field is missing
            messages.error(req, "All fields are required. Please Try Again")

            return redirect(reverse('checkout'))

    # Fetch country and state names with error handling
        try:
            country_fetch = Country.objects.get(id=country_id)
            country = country_fetch.name
        except Country.DoesNotExist:
            return redirect(reverse('checkout'))

        try:
            state_fetch = State.objects.get(id=state_id)
            state = state_fetch.name
        except State.DoesNotExist:
            return redirect(reverse('checkout'))

        # Check if the user already has a shipping address
        try:
            shipping_address = Shipping_address.objects.get(user=req.user)
            # Update the existing shipping address
            shipping_address.name = name
            shipping_address.phone = phone
            shipping_address.address1 = address1
            shipping_address.address2 = address2
            shipping_address.country = country
            shipping_address.state = state
            shipping_address.city = city
            shipping_address.zipcode = zipcode
            shipping_address.save()

        except Shipping_address.DoesNotExist:
            # Create a new shipping address if one doesn't exist
            shipping_address = Shipping_address.objects.create(
                user=req.user,
                name=name,
                phone=phone,
                address1=address1,
                address2=address2,
                country=country,
                state=state,
                city=city,
                zipcode=zipcode,
            )

    # return shipping_address
        if shipping_address:

            payment_method = req.POST.get('paymentMethod')

            if payment_method == 'paypal':
                return process_paypal_payment(req, user, total_amount_usd, shipping_address)

            elif payment_method == 'phonepe':
                return process_phonepe_payment(req, user, total_amount_inr, shipping_address)
        else :
            return redirect(reverse('checkout'))
    # Initial rendering to capture shipping details
    phonepe_url = "https://phonepe.com/payment-page-url"
    countries = Country.objects.all()
    queryser = {'item': cart, 'total_amount': total_amount_inr, 'phonepe_url': phonepe_url, 'countries': countries , 'allcat':cat}
    return render(req, 'cart/checkout.html', queryser)



















# def phonepe_callback(request):
#     if request.method == "POST":
#         try:
#             # Parse the incoming JSON data
#             data = json.loads(request.body)
            
#             # Extract necessary fields from the callback data
#             status = data.get('status')
#             transaction_id = data.get('transactionId')
#             amount = data.get('amount')

#             # Optional: Verify the signature (X-VERIFY header) to ensure the callback is authentic
#             x_verify = request.headers.get('X-VERIFY')
#             if x_verify:
#                 # Recreate the signature using your secret key
#                 payload = request.body.decode('utf-8')
#                 expected_signature = hmac.new(
#                     settings.PHONEPE_SALT_KEY.encode(),
#                     (payload + '/pg/v1/pay' + settings.PHONEPE_SALT_KEY).encode(),
#                     hashlib.sha256
#                 ).hexdigest() + "###" + settings.PHONEPE_SALT_INDEX

#                 # Compare the signature
#                 if x_verify != expected_signature:
#                     return JsonResponse({"error": "Invalid signature"}, status=403)

#             # Handle different payment statuses
#             if status == "SUCCESS":
#                 # Handle successful payment (update order status, etc.)
#                 # e.g., update_order_status(transaction_id, amount, status)
#                 return JsonResponse({"message": "Payment processed successfully", "status": "success"}, status=200)
#             else:
#                 # Handle payment failure or other statuses
#                 return JsonResponse({"message": "Payment failed or is pending", "status": status}, status=400)

#         except json.JSONDecodeError:
#             # Handle JSON parsing errors
#             return JsonResponse({"error": "Invalid JSON data"}, status=400)
    
#     # Return error if the request method is not POST
#     return JsonResponse({"error": "Invalid request method"}, status=400)
import logging
logger = logging.getLogger(__name__)


@csrf_exempt
def phonepe_callback(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            status = data.get('status')
            transaction_id = data.get('transactionId')
            order_id = data.get('merchantTransactionId')

            # Fetch the order and log status for verification
            order = get_object_or_404(Order, transaction_id=order_id)
            logger.info(f"Order fetched with status: {order.status}")

            if status == "SUCCESS":
                order.status = "Paid"
            else:
                order.status = "Failed"

            order.save()
            logger.info(f"Order status updated to: {order.status}")
            
            return JsonResponse({"message": "Processed", "status": status}, status=200)

        except Order.DoesNotExist:
            logger.error("Order not found for transaction ID: %s", order_id)
            return JsonResponse({"error": "Order not found"}, status=404)
        except Exception as e:
            logger.error(f"Error processing callback: {str(e)}")
            return JsonResponse({"error": "Server error"}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=400)

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
        box_size = req.POST['box_size']
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
                box_size = box_size,
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
        , 'allcat':cat
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
    return render(request, 'orders/myorders.html', {'orders': orders , 'allcat':cat})


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
