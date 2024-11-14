from django.urls import path
from .views import *
from . import views

urlpatterns = [
    path('Add_To_Cart', addtocart, name='addtocart'),
    # path('Orders', orders, name='orders'),
    path('addcart',addcart, name='addcart'),
    path('deletecart/<cid>',deletecart, name='deletecart'),
    path('checkout',checkout, name='checkout'),
    path('update_quantity/', update_quantity, name='update_quantity'),
     path('orders/', orders, name='orders'),
     path('phonepe/callback/', phonepe_callback, name='phonepe_callback'),
    # Add the success page
    path('order-success/<str:order_id>/', order_success, name='order_success'),
     path('fetch-states/', views.fetch_states, name='fetch_states'),  # URL for fetching states
     path('fetch-shipping-rate/', views.fetch_shipping_rate, name='fetch_shipping_rate'),
    
 
    # path('fetch-countries/', views.fetch_countries, name='fetch_countries'),
  

]
