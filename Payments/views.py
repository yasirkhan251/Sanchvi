from django.shortcuts import render, redirect
import paypalrestsdk
from django.conf import settings
from django.http import JsonResponse
from django.contrib import messages
from django.urls import reverse

# Create PayPal payment
def payment(request):
    if request.method == 'POST':
        # Payment details
        payment = paypalrestsdk.Payment({
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": request.build_absolute_uri(reverse('execute_payment')),  # Use Django reverse for cleaner URLs
                "cancel_url": request.build_absolute_uri(reverse('payment_cancel'))
            },
            "transactions": [{
                "item_list": {
                    "items": [{
                        "name": "Sample Product",
                        "sku": "12345",
                        "price": "0.12",
                        "currency": "USD",
                        "quantity": 1
                    }]
                },
                "amount": {
                    "total": "0.12",
                    "currency": "USD"
                },
                "description": "Payment for Sample Product."
            }]
        })

        # Create Payment
        if payment.create():
            for link in payment.links:
                if link.rel == "approval_url":
                    # Redirect the user to PayPal for approval
                    return redirect(link.href)
        else:
            messages.error(request, f"Error creating PayPal payment: {payment.error}")
            return redirect('payment_page')

    return render(request, 'payments/payment.html')

# Execute PayPal payment after approval
def execute_payment(request):
    payment_id = request.GET.get('paymentId')
    payer_id = request.GET.get('PayerID')

    try:
        # Fetch the payment
        payment = paypalrestsdk.Payment.find(payment_id)

        # Execute payment
        if payment.execute({"payer_id": payer_id}):
            messages.success(request, "Payment completed successfully.")
            return redirect('payment_success')
        else:
            messages.error(request, f"Payment execution failed: {payment.error}")
            return redirect('payment_page')
    
    except paypalrestsdk.exceptions.ResourceNotFound as error: # type: ignore
        messages.error(request, f"Payment not found: {error}")
        return redirect('payment_page')

# Handle PayPal payment cancellation
def payment_cancel(request):
    messages.error(request, "Payment cancelled.")
    return redirect('payment_page')

# Handle PayPal payment success
def payment_success(request):
    return render(request, 'payments/payment_success.html')

# Render checkout page (optional)
def paypal_checkout(request):
    # Example static token; replace with actual API calls or token generation logic
    paypal_client_token = "your-generated-client-token"

    return render(request, 'paypal_checkout.html', {
        'paypal_client_id': settings.PAYPAL_CLIENT_ID,
        'paypal_client_token': paypal_client_token,
    })
