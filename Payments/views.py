from decimal import Decimal
from django.shortcuts import get_object_or_404, render, redirect
from django.urls import reverse
from django.http import HttpResponse, JsonResponse
from django.conf import settings
from Cart.models import *
import uuid
from paypal.standard.forms import PayPalPaymentsForm
from Sanchvi.utils import *
from Message.views import send_order_confirmation_email

paypal_email = settings.PAYPAL_RECEIVER_EMAIL

# from paypalrestsdk import Payment
# # Create your views here.


def payments(req,address_id):
    user = req.user
    cart = Cart.objects.filter(user=user)
    shipping_address = get_object_or_404(Shipping_address, id=address_id)

    # Calculate total amount
    total_amount = sum(float(item.price) * item.qty for item in cart)

    if req.method == 'POST':
    # Create the order
        order = Order.objects.create(
        user=user,
        address=shipping_address,
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


    # Prepare the context for the payment page
    context = {
        
        'shipping_address': shipping_address,
    }
    return render(req, 'payments/payment.html', context)

def payment_successful(req, payid):
    return render(req, 'payments/payment_successful.html')

def payment_failed(req, payid):
    return render(req, 'payments/payment_failed.html')





def handle_payment_success_PayPal(req, address_id):
    user = req.user
    cart = Cart.objects.filter(user=user)
    shipping_address = get_object_or_404(Shipping_address, id=address_id)

    # Calculate total amount
    total_amount = sum(float(item.price) * item.qty for item in cart)
    shipping_rate = req.session.get('shippingrate', 0.0)
    all_total_price = req.session.get('all_total_price', 0.0)
    

    # Create the order
    order = Order.objects.create(
        user=user,
        address=shipping_address,
        total_amount=all_total_price,
        shipping_amount = shipping_rate,
        GST = 0,
        status = 'Paid',
        delivery_status = 'Placed',
        payment_mode = 'PayPal',
        invoice = generate_invoice_number(),


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
    send_order_confirmation_email(order,req)
    # Redirect to order confirmation page or another page
    return redirect('order_confirmation', order_id=order.id)



def payment_fail(req):
    return render(req, 'cart/payment_failed.html')


def handle_payment_success_PhonePe(req, address_id):
    user = req.user
    merchantTransactionID = req.GET.get('transactionId')  # You should receive the transaction ID in the response

    # Make an API call to PhonePe to verify payment status
    try:
        headers = {
            "Content-Type": "application/json",
            "X-VERIFY": "<YOUR_HEADER>",  # Generate a similar verification header as during payment
        }
    
        response = req.get(
            f"{settings.PHONEPE_PAYMENT_STATUS_URL}/{merchantTransactionID}",
            headers=headers
        )
        
        # Verify if the payment was successful
        if response.status_code == 200:
            payment_status = response.json()
            if payment_status.get('code') == 'PAYMENT_SUCCESS':
                # Payment was successful, proceed with creating the order
                cart = Cart.objects.filter(user=user)
                shipping_address = get_object_or_404(Shipping_address, id=address_id)

                # Calculate total amount
                total_amount = sum(float(item.price) * item.qty for item in cart)
                shipping_rate = req.session.get('shippingrate', 0.0)
                all_total_price = req.session.get('all_total_price', 0.0)


                # Create the order
                order = Order.objects.create(
                    user=user,
                    address=shipping_address,
                    total_amount=all_total_price,
                    status = 'Paid',
                    GST = 0,
                    shipping_amount = shipping_rate,
                    delivery_status = 'Placed',
                    payment_mode = 'PhonePe UPI',
                    invoice = generate_invoice_number(),
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
                send_order_confirmation_email(order)
                # Redirect to order confirmation page or another page
                return redirect('order_confirmation', order_id=order.id)
            else:
                # Payment failed, redirect to payment failed page
                return redirect('payment_fail')
        else:
            # Something went wrong with the verification
            return redirect('payment_fail')

    except Exception as e:
        print('Exception during payment verification:', e)
        return redirect('payment_fail')



def order_confirmation(req, order_id):
    order = get_object_or_404(Order, id=order_id)
    return render(req, 'orders/confirmation.html', {'order': order})




