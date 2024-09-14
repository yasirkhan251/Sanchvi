from django.urls import path
from .views import *

urlpatterns = [
    path('Add_To_Cart', addtocart, name='addtocart'),
    # path('Orders', orders, name='orders'),
    path('addcart',addcart, name='addcart'),
    path('deletecart/<cid>',deletecart, name='deletecart'),
    path('checkout',checkout, name='checkout'),
    path('update_quantity/', update_quantity, name='update_quantity'),
     path('orders/', orders, name='orders'),
    # Add the success page
    path('order-success/<str:order_id>/', order_success, name='order_success'),

]
