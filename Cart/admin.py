from django.contrib import admin
from .models import *

# Register your models here.
admin.site.register(Cart)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(Shipping_address)
admin.site.register(ShippingRate)