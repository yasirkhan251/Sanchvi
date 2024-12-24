from django.shortcuts import get_object_or_404
from Products.models import Product, Productprice, Productcolorpalet, ProductImage,Category

def duplicate_product(product_id):
    # Fetch the original product instance
    original_product = get_object_or_404(Product, id=product_id)
    temp = Category.objects.get(name='Temp')
    # print(temp[7])

    # Duplicate the product itself
    print(temp)
    new_product = Product(
        name=original_product.name,
        description=original_product.description,
        category=temp,   # Copy the category (ForeignKey)
        is_active=original_product.is_active,  # Copy the active status
        img=original_product.img,  # Copy the active status
        # We can omit img as it’s an optional field and you might want to upload a new image
    )
    
    new_product.save()  # Save the new product

    # Duplicate all related Productprice entries for the new product
    for price in original_product.prices.all():
        Productprice.objects.create(
            product=new_product,
            size=price.size,
            price=price.price,
            shipping_box=price.shipping_box
        )

    # Duplicate all related Productcolorpalet entries for the new product
    for color in original_product.productcolorpalet_set.all():
        Productcolorpalet.objects.create(
            Product=new_product,
            color=color.color
        )

    # Duplicate all related ProductImage entries for the new product
    for image in original_product.images.all():
        ProductImage.objects.create(
            product=new_product,
            image=image.image  # Note: You may want to handle image uploads differently
        )

    return new_product
