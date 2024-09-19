import uuid
from django.db import models
from django.core.exceptions import ValidationError
from Accounts.models import *
from Products.models import *

# Create your models here.


class Cart(models.Model):
    user = models.ForeignKey(MyUser, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    productid = models.CharField(max_length=100)
    size = models.CharField(max_length=100)
    price = models.CharField(max_length=100)
    color = models.CharField(max_length=100)
    qty = models.IntegerField(default=1)
    def clean(self):
        if self.qty <= 0:
            raise ValidationError('Quantity must be greater than zero.')

    def __str__(self):
        return f"{self.user.username}'s cart item: {self.product.name}"


class Shipping_address(models.Model):
    name = models.CharField(max_length=100)
    phone = models.BigIntegerField()
    address = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    city = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.name}, {self.city}, {self.country}"


class Order(models.Model):
    user = models.ForeignKey(MyUser, on_delete=models.CASCADE)
    address = models.ForeignKey(Shipping_address, on_delete=models.CASCADE)
    order_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order {self.order_id} by {self.user.username}"
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

