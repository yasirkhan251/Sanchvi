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
# paypal settings 
import uuid
from django.conf import settings
from paypal.standard.forms import PayPalPaymentsForm
from django.views.decorators.csrf import csrf_exempt

# Create your views here.



def generate_checksum(merchant_id, transaction_id, amount, api_key):
    """Generates checksum for secure transaction"""
    payload = f"/v1/pay/{merchant_id}/{transaction_id}/{amount}/INR"
    checksum = base64.b64encode(hashlib.sha256(f"{payload}{api_key}".encode()).digest()).decode('utf-8')
    return checksum




@login_required
def checkout(req):
    user = req.user
    cart = Cart.objects.filter(user=user)
   
    # Calculate total amount in INR
    total_amount_inr = sum(float(item.price) * item.qty for item in cart)

    # Your API key for the ExchangeRatesAPI
    # api_key = 'cur_live_bprsosYyOxTW4Tmt7gTzTibq9nogJDWsJszpMh1s'
    # # api_key = 'cur_live_BdxPwNtyLndkPKvdvAJFAy6cGhYqq6aRhiswS5nP'
    # # api_key = 'cur_live_oJu1Q26kMbWuWqjVvUsY8lRank8tom04Ich1lDAg'
    # # api_key = 'cur_live_Qn0EcKkoABzXKAz8Alv9pYq8KAzfF9FCgdJZZT3k'

    #     # Fetch real-time conversion rate from INR to USD
    # try:
    #         # Correct CurrencyAPI URL
    #         response = requests.get(f'https://api.currencyapi.com/v3/latest?apikey={api_key}&currencies=USD&base_currency=INR')
    #         data = response.json()
    #         if response.status_code == 200 and 'data' in data:
    #             # Get conversion rate from INR to USD
    #             inr_to_usd_rate = data['data']['USD']['value']
    #             total_amount_usd = total_amount_inr * inr_to_usd_rate
    #         else:
    #             # Handle the case where the API request was not successful
    #             print('Error fetching conversion rate:', data.get('error', 'Unknown error'))
    #             total_amount_usd = total_amount_inr  # Fallback to INR amount if API fails
    # except Exception as e:
    #         # Handle any exceptions that occur during the API request
    #         print('Exception during API request:', e)
    #         total_amount_usd = total_amount_inr * 0.01157  # Fallback to INR amount
    api_key = 'e953cda389263846602cea63'

    # Fetch real-time conversion rate from INR to USD
    try:
        # Correct CurrencyAPI URL
        response = requests.get(f'https://v6.exchangerate-api.com/v6/{api_key}/latest/INR')
        data = response.json()
        if response.status_code == 200 and 'conversion_rates' in data:
            # Get conversion rate from INR to USD
            inr_to_usd_rate = data['conversion_rates']['USD']
            total_amount_usd = total_amount_inr * inr_to_usd_rate
        else:
            # Handle the case where the API request was not successful
            print('Error fetching conversion rate:', data.get('error', 'Unknown error'))
            total_amount_usd = total_amount_inr  # Fallback to INR amount if API fails
    except Exception as e:
        # Handle any exceptions that occur during the API request
        print('Exception during API request:', e)
        total_amount_usd = total_amount_inr * 0.01198 # Fallback to INR amount
    

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

        elif payment_method == 'phonepe':
            # PhonePe integration
            orderID = "pp-" + str(uuid.uuid4())
            merchantTransactionID = "MT" + str(uuid.uuid4())

            # Prepare the payload for PhonePe
            payload = {
                "merchantId": settings.PHONEPE_MERCHANT_ID,
                "merchantTransactionId": merchantTransactionID,
                "merchantUserId": str(user.id),
                "amount": int(total_amount_inr * 100),  # INR to paise conversion (multiply by 100)
                "redirectUrl": req.build_absolute_uri(reverse('handle_payment_success', kwargs={'address_id': shipping_address.id})),
                "redirectMode": "REDIRECT",  # or "POST"
                "callbackUrl": req.build_absolute_uri(reverse('phonepe_callback')),
                "mobileNumber": phone,
                "paymentInstrument": {
                    "type": "PAY_PAGE"
                }
            }

            # Convert payload to base64
            payload_json = json.dumps(payload)
            base64_request = base64.b64encode(payload_json.encode()).decode()

            # Generate the X-VERIFY header
            endpoint = "/pg/v1/pay"  # API endpoint for payment
            combined_string = base64_request + endpoint + settings.PHONEPE_SALT_KEY
            finalXHeader = hashlib.sha256(combined_string.encode()).hexdigest() + "###" + settings.PHONEPE_SALT_INDEX

            # Prepare the headers
            headers = {
                "Content-Type": "application/json",
                "X-VERIFY": finalXHeader
            }

            # Prepare the request body
            req_body = {"request": base64_request}

            # Send the POST request to the PhonePe sandbox URL
            response = requests.post(settings.PHONEPE_PAYMENT_URL, headers=headers, json=req_body)

            # Handle the response
            if response.status_code == 200:
                res_data = response.json()
                if res_data.get('success'):
                    # Extract the payment redirect URL
                    payment_url = res_data["data"]["instrumentResponse"]["redirectInfo"]["url"]
                    return redirect(payment_url)
                else:
                    # Handle error returned in the response
                    print("PhonePe payment initiation failed:", res_data.get("message"))
                    return JsonResponse({"error": res_data.get("message")}, status=400)
            else:
                # Handle HTTP errors
                print("PhonePe payment initiation failed with HTTP status:", response.status_code)
                print("Response text:", response.text)
                return JsonResponse({"error": "PhonePe payment initiation failed."}, status=500)


    # Initial rendering to capture shipping details
    queryser = {'item': cart, 'total_amount': total_amount_inr}
    return render(req, 'cart/checkout.html', queryser)








@csrf_exempt
def phonepe_callback(request):
    if request.method == "POST":
        try:
            # Parse the incoming JSON data
            data = json.loads(request.body)
            
            # Extract necessary fields from the callback data
            status = data.get('status')
            transaction_id = data.get('transactionId')
            amount = data.get('amount')

            # Optional: Verify the signature (X-VERIFY header) to ensure the callback is authentic
            x_verify = request.headers.get('X-VERIFY')
            if x_verify:
                # Recreate the signature using your secret key
                payload = request.body.decode('utf-8')
                expected_signature = hmac.new(
                    settings.PHONEPE_SALT_KEY.encode(),
                    (payload + '/pg/v1/pay' + settings.PHONEPE_SALT_KEY).encode(),
                    hashlib.sha256
                ).hexdigest() + "###" + settings.PHONEPE_SALT_INDEX

                # Compare the signature
                if x_verify != expected_signature:
                    return JsonResponse({"error": "Invalid signature"}, status=403)

            # Handle different payment statuses
            if status == "SUCCESS":
                # Handle successful payment (update order status, etc.)
                # e.g., update_order_status(transaction_id, amount, status)
                return JsonResponse({"message": "Payment processed successfully", "status": "success"}, status=200)
            else:
                # Handle payment failure or other statuses
                return JsonResponse({"message": "Payment failed or is pending", "status": status}, status=400)

        except json.JSONDecodeError:
            # Handle JSON parsing errors
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
    
    # Return error if the request method is not POST
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
