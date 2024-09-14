from django.db import models
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

class Order(models.Model):
    user = models.ForeignKey(MyUser, on_delete=models.CASCADE)
    order_id = models.CharField(max_length=100, unique=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    size = models.CharField(max_length=100)
    color = models.CharField(max_length=100)
    qty = models.IntegerField()
    price = models.CharField(max_length=100)
# class cartqty(models.Model):
#     cart = models.ForeignKey(Cart, on_delete=models.CASCADE)
