from django import forms
from .models import *

class ProductForm(forms.ModelForm):
    class Meta:
        model = Product
        fields = ['img', 'pcode', 'name', 'description', 'category']
class ProductImageForm(forms.ModelForm):
    class Meta:
        model = ProductImage
        fields = ['image']
class ProductPriceForm(forms.ModelForm):
    class Meta:
        model = Productprice
        fields = ['size', 'price']
