from django.shortcuts import *
from .models import *
from django.views.generic import *
from django.urls import reverse
from .forms import *
from Admin.models import *

cat = Category.objects.all()
# Create your views here.
def dashboard(req):
    return render(req, 'dashboard.html')

class ProductList(ListView):
    queryset = Product.objects.all()
    template_name = 'dashboard.html'
    context_object_name = 'products'





def basehtml(req):
    cat = Category.objects.all()
    
    return render(req, 'base.html',{'cat': cat})


def contactusup(req):
    if req.method== 'POST':
        first_name = req.POST['first_name']
        last_name = req.POST['last_name']
        email = req.POST['email']
        mobile = req.POST['mobile']
        message = req.POST['message']

        contact = Feedback.objects.create(
            first_name = first_name,
            last_name = last_name,
            email =email,
            mobile = mobile,
            message = message
        )

        contact.save()
        return render(req, 'contact/thankyouforcontact.html')


    return render(req, 'contact/contactusout.html') 





def add_product(request):
    if request.method == 'POST':
        # Create forms based on the count provided in POST data
        product_form = ProductForm(request.POST, request.FILES)
        image_count = int(request.POST.get('image_count', 0))
        price_count = int(request.POST.get('price_count', 0))
        
        image_forms = [ProductImageForm(request.POST, request.FILES, prefix=str(i)) for i in range(image_count)]
        price_forms = [ProductPriceForm(request.POST, prefix=str(i)) for i in range(price_count)]

        if product_form.is_valid():
            product = product_form.save()

            # Process image forms
            for image_form in image_forms:
                if image_form.is_valid():
                    image = image_form.save(commit=False)
                    image.product = product
                    image.save()

            # Process price forms and ensure no duplicate sizes
            sizes = set()
            for price_form in price_forms:
                if price_form.is_valid():
                    size = price_form.cleaned_data['size']
                    if size not in sizes:
                        sizes.add(size)
                        price = price_form.save(commit=False)
                        price.product = product
                        price.save()

            return redirect(reverse('product'))  # Redirect to the product list or another page

    else:
        # Initialize forms with a default number
        product_form = ProductForm()
        image_count = 1  # Default number of image forms
        price_count = 1  # Default number of price forms
        image_forms = [ProductImageForm(prefix=str(i)) for i in range(image_count)]
        price_forms = [ProductPriceForm(prefix=str(i)) for i in range(price_count)]
        print("Image count:", image_count)
        print("Price count:", price_count)


    context = {
        'product_form': product_form,
        'image_forms': image_forms,
        'price_forms': price_forms,
    }
    return render(request, 'add_product.html', context)







# Product

def all_video(req):
    return render(req, 'product/all_videos.html')

# def product_landing(req,c_id, id):
    
#     category= get_object_or_404(Category, c_id = c_id)
#     products = Product.objects.filter(category_id=id).select_related('category').prefetch_related('prices', 'images')
#     prices = Productprice.objects.filter(product__in=products)

#     # category= Category.objects.filter(c_id = c_id)
    
  
#     # products = Product.objects.filter(category = id)
    

#     img = ProductImage.objects.all()
#     queryset = {
#         'product':products,
#         'catogery':category,
#         'allcat':cat,
#         'imgs':img,
#         'prices':prices,
#     }
#     return render(req, 'product/Shop_product_list.html' , queryset)

# def product_landing(req, c_id, id):
#     category = get_object_or_404(Category, c_id=c_id)
#     sort = req.GET.get('sort', None)

#     # Sort products based on the related price field
#     if sort == 'low_to_high':
#         products = Product.objects.filter(category_id=id).select_related('category').prefetch_related('prices', 'images').order_by('prices__price')
#     elif sort == 'high_to_low':
#         products = Product.objects.filter(category_id=id).select_related('category').prefetch_related('prices', 'images').order_by('-prices__price')
#     else:
#         products = Product.objects.filter(category_id=id).select_related('category').prefetch_related('prices', 'images')

#     img = ProductImage.objects.all()

#     queryset = {
#         'product': products,
#         'catogery': category,
#         'allcat': cat,
#         'imgs': img,
#     }
#     return render(req, 'product/Shop_product_list.html', queryset)

from django.db.models import Min, Max

def product_landing(req, c_id, id):
    category = get_object_or_404(Category, c_id=c_id)
    sort = req.GET.get('sort', None)

    # Annotate products with their minimum or maximum price
    if sort == 'low_to_high':
        products = Product.objects.filter(category_id=id).select_related('category').prefetch_related('images').annotate(min_price=Min('prices__price')).order_by('min_price')
    elif sort == 'high_to_low':
        products = Product.objects.filter(category_id=id).select_related('category').prefetch_related('images').annotate(max_price=Max('prices__price')).order_by('-max_price')
    else:
        products = Product.objects.filter(category_id=id).select_related('category').prefetch_related('images')

    img = ProductImage.objects.all()

    queryset = {
        
        'product': products,
        'catogery': category,
        'allcat': cat,
        'imgs': img,
    }
    return render(req, 'product/Shop_product_list.html', queryset)

from django.http import JsonResponse
def searchall(request):
    print("searchall view accessed")
    query = request.GET.get('search', '').lower()
    products = Product.objects.filter(name__icontains=query, is_active = True).prefetch_related('prices')
    print("Search query:", query)
    
    matching_products = []
    added_product_names = set()

    for product in products:
        if product.name not in added_product_names:
            matching_products.append({
                'id': product.id,
                'name': product.name,
                'img_url': product.img.url if product.img else '',
                'price': product.prices.first().price if product.prices.exists() else None,
            })
            added_product_names.add(product.name)
    
    return JsonResponse({'products': matching_products})




def search(req, pid=None, cid=None):
    if req.method == "POST":
        searchproduct = req.POST['search'].lower()

        # Perform a case-insensitive search for products containing the search term
        products = Product.objects.filter(name__icontains=searchproduct).prefetch_related('prices')

        # List to store matching products with additional details
        matching_products = []
        
        # Set to track unique product names
        added_product_names = set()
        filter = 0

        # Populate the list with product details, avoiding duplicates
        for product in products:
            if product.name not in added_product_names:
                matching_products.append(product)  # Add full product object (Django ORM instance)
                added_product_names.add(product.name)  # Mark this product name as added

        # Check if we found any matching products and render the template
        if matching_products:
            return render(req, 'product/Shop_product_list.html', {'product': matching_products, 'filtered' : filter, 'allcat': cat  })
        else:
             return render(req, 'product/Shop_product_list.html', {'product': matching_products, 'filtered' : filter, 'allcat': cat})

    return HttpResponse("Invalid request method")


def product_detail(req, pid):
    # Try to get the product by ID, if it doesn't exist, show a friendly message
    try:
        product = Product.objects.get(id=pid)
    except Product.DoesNotExist:
        # Option 1: Render a custom 'not found' template
        return render(req, 'product/product_not_found.html', {'message': 'Product is Unavailable at a moment'})

        # Option 2: Redirect to the product list page
        # return redirect('product_list') # Uncomment this if you have a product list page

        # Option 3: Return a plain HTTP response with an error message
        # return HttpResponse("Product not found", status=404)

    # If the product exists, proceed with rendering the detail page


    img = product.images.all()
    prices = Productprice.objects.filter(product=product)
    colorpalet =  Productcolorpalet.objects.filter(Product=product)
    # Assuming 'cat' is fetched somewhere; if it's missing, you should add its logic.
    # cat = Category.objects.all() # You might want to include this or modify as needed
    productdetail = 0
    queryset = {
        'product': product,
        'imgs': img,
        'allcat': cat,  # Make sure 'cat' is defined somewhere in your code
        'prices': prices,
        'color':colorpalet,
        'productedetail' : productdetail 
    }

    return render(req, 'product/productdetail.html', queryset)


def sizechart(req):
    return render(req, 'assets/sizechart.html')
