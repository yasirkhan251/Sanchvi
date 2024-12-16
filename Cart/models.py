import uuid
from django.db import models
from django.core.exceptions import ValidationError
from Accounts.models import *
from Admin.models import *
from Products.models import *

# Create your models here.

 
class Cart(models.Model): 
    user = models.ForeignKey(MyUser, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    productid = models.CharField(max_length=100)
    size = models.CharField(max_length=100)

    box_size = models.CharField(max_length=100,blank=True,null=True)
    price = models.CharField(max_length=100)
    color = models.CharField(max_length=100)
    qty = models.IntegerField(default=1)
    def clean(self):
        if self.qty <= 0:
            raise ValidationError('Quantity must be greater than zero.')

    def __str__(self):
        return f"{self.user.username}'s cart item: {self.product.name}"


class Shipping_address(models.Model):
    user = models.OneToOneField(MyUser,on_delete=models.CASCADE,null=True,blank=True)
    name = models.CharField(max_length=100)
    phone = models.BigIntegerField()
    address1 = models.CharField(max_length=100,null=True,blank=True)
    address2 = models.CharField(max_length=100,null=True,blank=True)
    country = models.CharField(max_length=100,null=True,blank=True)
    state = models.CharField(max_length=100,null=True,blank=True)
    city = models.CharField(max_length=100,null=True,blank=True)
    zipcode = models.CharField(max_length=100,null=True,blank=True)

    def __str__(self):
        return f"{self.name}, {self.city}, {self.country}"


class Billing_address(models.Model):
    name = models.CharField(max_length=100)
    phone = models.BigIntegerField()
    address1 = models.CharField(max_length=100,null=True,blank=True)
    address2 = models.CharField(max_length=100,null=True,blank=True)
    country = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    city = models.CharField(max_length=100,null=True,blank=True)
    zipcode = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.name}, {self.city}, {self.country}"

class Order(models.Model):
    DELIVERY_STATUSES = [
    ('placed', 'Order Placed'),
    ('packed', 'Order Packed'),
    ('shipped', 'Order Shipped'),
    ('received_city', 'Received in City'),
    ('out_for_delivery', 'Out for Delivery'),
    ('delivered', 'Delivered'),
]
    ORDER_STATUSES = [
    ('pending', 'Pending'),
    ('paid', 'Paid'),
    ('failed', 'Failed'),
    ('cancelled', 'Cancelled'),
    ]
    user = models.ForeignKey(MyUser, on_delete=models.CASCADE)
    address = models.ForeignKey(Shipping_address, on_delete=models.CASCADE)
    order_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    invoice = models.CharField(max_length=100,null=True,blank=True,unique=True)
    shipping_amount = models.DecimalField(max_digits=10, decimal_places=2)
    GST = models.DecimalField(max_digits=10, decimal_places=2)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=ORDER_STATUSES, default='pending')
    delivery_status = models.CharField(max_length=20, choices=DELIVERY_STATUSES, default='placed')
    payment_mode = models.CharField(max_length=50, blank=True,null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        # return f"Order {self.invoice} by {self.user.username} Status: {self.status}, PaymentMode: {self.payment_mode}, Amount: {self.total_amount}"
        return f"Order by {self.user.username}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    size = models.CharField(max_length=100)
    color = models.CharField(max_length=100)
    qty = models.IntegerField()
    price = models.CharField(max_length=100)
# class cartqty(models.Model):
#     cart = models.ForeignKey(Cart, on_delete=models.CASCADE)
    def __str__(self):
        return f"{self.qty} x {self.product.name} in Order {self.order.order_id}"




class ShippingRate(models.Model):
    country = models.ForeignKey(Country, on_delete=models.CASCADE)
    small = models.DecimalField(max_digits=10, decimal_places=2)
    medium = models.DecimalField(max_digits=10, decimal_places=2)
    large = models.DecimalField(max_digits=10, decimal_places=2)
    extra_large = models.DecimalField(max_digits=10, decimal_places=2)
    transit_time = models.CharField(max_length=50)

    class Meta:
        db_table = 'shipping_rates'


    def __str__(self):
        return f"Shipping rates for {self.country.name}" 