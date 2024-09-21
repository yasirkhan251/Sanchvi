from django.shortcuts import get_object_or_404, render, redirect
from django.urls import reverse
from django.http import HttpResponse
from django.conf import settings
from Cart.models import *
import uuid
from paypal.standard.forms import PayPalPaymentsForm

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

    # Redirect to order confirmation page or another page
    return redirect('order_confirmation', order_id=order.id)


def order_confirmation(req, order_id):
    order = get_object_or_404(Order, id=order_id)
    return render(req, 'orders/confirmation.html', {'order': order})