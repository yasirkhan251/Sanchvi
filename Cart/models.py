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


# class cartqty(models.Model):
#     cart = models.ForeignKey(Cart, on_delete=models.CASCADE)
