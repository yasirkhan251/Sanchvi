from django.urls import path,include
from .views import *

urlpatterns = [
  path('', include('paypal.standard.ipn.urls')),
  path('<int:address_id>', payments, name='payment'),
  path('payment_successful/<int:payid>', payment_successful , name='payment_successful'),
  path('payment_failed/<int:payid>  ', payment_failed , name='payment_failed'),
    path('Paypal/success/<int:address_id>/', handle_payment_success_PayPal, name='handle_payment_success'),
    path('Phonepe/<int:address_id>/', handle_payment_success_PhonePe, name='handle_payment_success_phonepe'),
    path('Transaction_Fail', payment_fail, name='payment_fail'),
    path('paypal/', include('paypal.standard.ipn.urls')),  # Include PayPal IPN URLs
     path('order/confirmation/<int:order_id>/', order_confirmation, name='order_confirmation'),
     

]
