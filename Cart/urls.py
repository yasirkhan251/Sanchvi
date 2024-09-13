from django.urls import path
from .views import *

urlpatterns = [
    path('Add_To_Cart', addtocart, name='addtocart'),
    path('Orders', orders, name='orders'),
    path('addcart',addcart, name='addcart'),
    path('deletecart/<cid>',deletecart, name='deletecart'),

]
