from django.urls import path
from . import views

urlpatterns = [
    path('payment/', views.payment, name='payment_page'),
    path('payment/execute/', views.execute_payment, name='execute_payment'),
    path('payment/cancel/', views.payment_cancel, name='payment_cancel'),
    path('payment/success/', views.payment_success, name='payment_success'),
]
