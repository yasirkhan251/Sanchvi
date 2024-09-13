from django.shortcuts import redirect, render
from .models import *
from Products.models import *
from django.urls import reverse
from django.contrib.auth.decorators import login_required

# Create your views here.

def addcart(req):
    if req.method == "POST":
        user = req.user
        product = req.POST['product']
        product_id = req.POST['productid']
        size = req.POST['size']
        price = req.POST['price']
        color = req.POST['color']
        qty = int(req.POST.get('qty', 1))  # default to 1 if not provided
        print(user)
        print(product)
        print(product_id)
        print(size)
        print(price)
        print(color)
        print(qty)
        # print()

        try:
            # Fetch product object
            product = Product.objects.get(id=product_id)

            # Check if this product, size, color combo already exists in the cart
            cart_item, created = Cart.objects.get_or_create(
                user=user, 
                product=product, 
                productid = product_id,
                size=size, 
                color=color,
                defaults={'price': price, 'qty': qty}
            )

            if not created:
                # If the item already exists in the cart, update the quantity
                cart_item.qty += qty
                cart_item.save()

        except Product.DoesNotExist:
            # Handle the case where the product doesn't exist
            return render(req, 'error.html', {'message': 'Product not found'})

    return redirect(reverse('addtocart'))

@login_required
def addtocart(req):
    user = req.user
    cart = Cart.objects.filter(user = user)
    
    queryser= {
        'item': cart
    }
    return render(req, 'cart/addtocart.html',queryser)

def orders(req):
    return render(req, 'cart/order.html')


def deletecart(req, cid):
    try:
        # Fetch the cart item by its ID (cid)
        cart_item = Cart.objects.get(id=cid)
        
        # Delete the cart item
        cart_item.delete()

    except Cart.DoesNotExist:
        # Handle the case where the cart item does not exist
        print("Cart item does not exist.")
    return redirect(reverse('addtocart'))
