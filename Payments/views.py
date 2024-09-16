from django.shortcuts import render, redirect
from django.http import HttpResponse
# from paypalrestsdk import Payment
# # Create your views here.


















def create_payment(request):
    # Create a new payment
    payment = Payment({
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://localhost:8000/payment/execute/",
            "cancel_url": "http://localhost:8000/payment/cancel/"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "item name",
                    "sku": "item",
                    "price": "10.00",
                    "currency": "USD",
                    "quantity": 1
                }]
            },
            "amount": {
                "total": "10.00",
                "currency": "USD"
            },
            "description": "This is the payment transaction description."
        }]
    })

    if payment.create():
        for link in payment.links:
            if link.rel == "approval_url":
                # Redirect the user to this URL to approve the payment
                return redirect(link.href)
    else:
        return render(request, 'payment/error.html', {'error': payment.error})

def execute_payment(request):
    payment_id = request.GET.get('paymentId')
    payer_id = request.GET.get('PayerID')
    
    payment = Payment.find(payment_id)

    if payment.execute({"payer_id": payer_id}):
        return HttpResponse("Payment executed successfully")
    else:
        return HttpResponse(payment.error)