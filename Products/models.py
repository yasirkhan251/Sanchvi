from django.db import models
import random
import string

def generate_unique_alphanumeric(length):
    """Generate a unique and random alphanumeric string of specified length."""
    characters = string.ascii_letters + string.digits
    return ''.join(random.choice(characters) for _ in range(length))

# Create your models here.


class Category(models.Model):
    c_id = models.CharField(max_length=2, default= generate_unique_alphanumeric(2)) 
    name = models.CharField(max_length=50, unique=True)
    detail = models.CharField(max_length=100, blank=True, null= True) 
    image = models.ImageField(upload_to='media/category/', null=True, blank= True)
    def __str__(self):
        return self.name
  



class Product(models.Model):
    img = models.ImageField(upload_to='media/product/', null=True, blank=True)
    pcode = models.CharField(max_length=10, unique=True, default=generate_unique_alphanumeric(4))
    name = models.CharField(max_length=100)
    description = models.TextField(null=True, blank=True)
    category = models.ForeignKey('Category', related_name='products', on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.name} - {self.category.name}"

class Productprice(models.Model):
    SIZE_CHOICES = [
        ('0-6 months', '0-6 months'),
        ('6-12 months', '6-12 months'),
        ('1-2 years', '1-2 years'),
        ('2-3 years', '2-3 years'),
        ('3-4 years', '3-4 years'),
        ('4-5 years', '4-5 years'),
        ('5-6 years', '5-6 years'),
        ('6-7 years', '6-7 years'),
        ('7-8 years', '7-8 years'),
        ('8-9 years', '8-9 years'),
        ('9-10 years', '9-10 years'),
        ('10-11 years', '10-11 years'),
        ('11-12 years', '11-12 years'),
        ('12-13 years', '12-13 years'),
        ('13-14 years','13-14 years'),
        ('14-15 years', '14-15 years'),
        ('15+ years', '15+ years'),
    ]
    product = models.ForeignKey(Product, related_name='prices', on_delete=models.CASCADE)
    size = models.CharField(max_length=50, choices=SIZE_CHOICES)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f'{self.product.name} - {self.size}'
    
class Productcolorpalet(models.Model):
    Product = models.ForeignKey(Product, on_delete=models.CASCADE )
    color= models.CharField(max_length=50, null=True, blank=True)
    def __str__(self):
        return f"{self.Product} : {self.color}"
    

class ProductImage(models.Model):
    product = models.ForeignKey(Product, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='media/product/', null=True, blank=True)

    def __str__(self):
        return f'{self.product.name} - Image'



class ContactMe(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
    mobile = models.BigIntegerField()
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    def __str__(self):
        return f"{self.first_name} {self.last_name} : {self.email} / {self.mobile} - {self.created_at}"