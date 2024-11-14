from django.shortcuts import get_object_or_404, render,redirect
from django.urls import reverse
from django.contrib.auth import *
from Accounts.models import *
from Admin.models import *
from Products.models import *
from .models import *
from django.contrib import messages
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.dateparse import parse_datetime
from django.utils import timezone
import json


categories = Category.objects.all()

# Create your views here.

feedcount = Feedback.objects.all()
feed = Feedback.objects.all()
# feed = Feedback.objects.all().order_by('-created_at')[:3]
globalset = {'feedback':feed,'feedcount':feedcount}

@csrf_exempt  # Disable CSRF for this view, or use the csrf token as done in JS
def toggle_server_mode(request):
    if request.method == "POST":
        data = json.loads(request.body)
        
        # Get server mode and countdown time from the frontend (both could be null)
        server_mode = data.get('servermode', None)
        countdown_time = data.get('countdowntime', None)
        
        # Assuming you have one server object. Adjust if you have multiple.
        server = Server.objects.first()
        
        # Update the server mode if provided
        if server_mode is not None:
            server.servermode = server_mode
        
        # Update the countdown time if provided
        if countdown_time:
            # Parse the countdown_time string into a Python datetime object
            countdown_time_obj = parse_datetime(countdown_time)
            if countdown_time_obj is not None:
                server.countdowntime = countdown_time_obj
            else:
                return JsonResponse({'status': 'error', 'message': 'Invalid countdown time format'})
        
        # Save the server object with updated fields
        server.save()
        
        return JsonResponse({
            'status': 'success',
            'servermode': server.servermode,
            'countdowntime': server.countdowntime
        })
        
    return JsonResponse({'status': 'error', 'message': 'Invalid request'})

def get_server_mode(request):
    """
    Fetches the current server mode and countdown time from the backend.
    """
    server = Server.objects.first()  # Assuming a single server object
    return JsonResponse({
        'servermode': server.servermode,
        'countdowntime': server.countdowntime  # Send the current countdown time
    })

def admin_panel(req):

    return render(req, 'admindata/index.html',globalset)


def admin_serversettings(req):
    return render(req,'admindata/settings.html',globalset)

 
def admin(req):
    
    return redirect(reverse('login'))


def feedbacks(req):
    
    return render(req, 'admindata/feedback.html',globalset)


from django.db.models import Min, Max

def product_categories(req):
    queryset = {'category':categories}
    return render(req, 'admindata/products/categories.html',queryset)

def productlist(req, c_id, id):
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
        'allcat': category,
        'imgs': img,
    }
    return render(req, 'admindata/products/product_list.html',queryset)




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
        'allcat': categories,  # Make sure 'cat' is defined somewhere in your code
        'prices': prices,
        'color':colorpalet,
        'productedetail' : productdetail 
    }

    return render(req, 'admindata/products/productedit.html', queryset)





from django.http import JsonResponse
def searchall(request):
    print("searchall view accessed")
    query = request.GET.get('search', '').lower()
    products = Product.objects.filter(name__icontains=query).prefetch_related('prices')
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
            return render(req, 'admindata/products/product_list.html', {'product': matching_products, 'filtered' : filter, 'allcat': categories  })
        else:
             return render(req, 'admindata/products/product_list.html', {'product': matching_products, 'filtered' : filter, 'allcat': categories})

    return HttpResponse("Invalid request method")




def userlist(req):
    users = MyUser.objects.all()
    quaryset = {'users':users}
    return render(req, 'admindata/userlist.html',quaryset)

