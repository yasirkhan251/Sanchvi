from django.shortcuts import get_object_or_404, render,redirect
from django.urls import reverse
from django.contrib.auth import *
from Accounts.models import *
from Admin.models import *
from Cart.models import *
from Products.models import *
from .models import *
from django.contrib import messages
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.dateparse import parse_datetime
from django.utils import timezone
from django.db import connection
import json
from Accounts.utils import adminlogin_required

categories = Category.objects.all()

# Create your views here.

@adminlogin_required
def SQL(req):
    return render(req, 'admindata/SQL.html')

@csrf_exempt
def update_product_category(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            product_id = data.get('product_id')
            category_id = data.get('category_id')

            product = Product.objects.get(id=product_id)
            category = Category.objects.get(id=category_id)

            product.category = category
            product.save()

            return JsonResponse({'success': True, 'message': 'Product category updated successfully.'})

        except Product.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Product not found.'})
        except Category.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Category not found.'})
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)})

    return JsonResponse({'success': False, 'message': 'Invalid request.'})





@csrf_exempt  # Use csrf_exempt for testing; in production, use CSRF tokens
def execute_sql_view(request):
    if request.method == "POST":
        sql_query = request.POST.get("sql_query", "")
        try:
            # Restrict to safe commands
            allowed_commands = ["SELECT", "UPDATE", "INSERT", "DELETE"]
            if any(sql_query.strip().upper().startswith(cmd) for cmd in allowed_commands):
                with connection.cursor() as cursor:
                    cursor.execute(sql_query)

                    if sql_query.strip().upper().startswith("SELECT"):
                        # Fetch column names and results for SELECT queries
                        columns = [col[0] for col in cursor.description]
                        results = cursor.fetchall()
                        return JsonResponse({"success": True, "columns": columns, "results": results})
                    else:
                        # Return the number of affected rows for non-SELECT queries
                        return JsonResponse({"success": True, "message": f"Query executed successfully. Rows affected: {cursor.rowcount}"})
            else:
                return JsonResponse({"success": False, "message": "Only SELECT, UPDATE, INSERT, and DELETE commands are allowed."})
        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)})
    return JsonResponse({"success": False, "message": "Invalid request method."})





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

import requests
from collections import Counter
from django.db.models import Count, Q
@adminlogin_required
def admin_panel(req):
    bot_keywords = ['bot', 'google', 'chatgpt', 'crawler', 'spider']
    filter_query = Q()
    orders = Order.objects.count()
    users = MyUser.objects.filter(is_admin=False).count()


    recent_user = MyUser.objects.latest('id')  # Fetch the user with the highest ID
    recent_order = Order.objects.latest('id')  # Fetch the order with the highest ID
    recent_visit = UserVisit.objects.latest('id')  # Fetch the order with the highest ID
    for keyword in bot_keywords:
        filter_query |= Q(user_agent__icontains=keyword)    


    top_links = (
        UserVisit.objects.values('path')
        .annotate(visitors=Count('path'))
        .order_by('-visitors')[:7]
    )
    

    real_users = UserVisit.objects.exclude(filter_query).count()


    # feedback = Feedback.objects.count()
    recent_visits = UserVisit.objects.all().order_by('-timestamp')[:10]

    # visits = UserVisit.objects.exclude(
    #     user_agent__icontains="bot"
    # ).exclude(
    #     user_agent__icontains="google"
    # ).exclude(
    #     user_agent__icontains="chatgpt"
    # )

    # # Fetch IPs for filtered visits
    # ip_list = visits.values_list('ip_address', flat=True)

    # # Get the countries associated with the IPs
    # countries = []
    # for ip in ip_list:
    #     try:
    #         response = requests.get(f'https://ipinfo.io/{ip}/json')
    #         ip_info = response.json()
    #         country = ip_info.get('country', 'Local_IP')
    #         countries.append(country)
    #     except:
    #         countries.append('Local_IP')
    # # Count visits per country
    # country_visits = Counter(countries)

    # # Prepare data for the template
    # data = []

    # for country, count in country_visits.items():
    #     flag_url = (
    #         f"/static/admin_assets_gui/img/flags/{country.lower()}.png"
    #         if country != 'Unknown'
    #         else "/static/admin_assets_gui/img/flags/Local_IP.jpg"
    #     )
    #     percentage = (count / len(ip_list)) * 100 if ip_list else 0
    #     data.append({
    #         'country': country,
    #         'count': count,
    #         'percentage': percentage,
    #         'flag_url': flag_url,
    #     })



    globalset.update({
        'orders': orders,
        'users': users,
        'recent_user':recent_user,
        'recent_order':recent_order,
        'visit':real_users,
        'top_links':top_links,
        'lastvisit':recent_visit,
        'recent_visits': recent_visits,
        # 'data': data,
        # 'feedback':feedback,
    })
    return render(req, 'admindata/index.html',globalset)

@adminlogin_required
def admin_serversettings(req):
    return render(req,'admindata/settings.html',globalset)

 
def admin(req):
    
    return redirect(reverse('login'))

@adminlogin_required
def feedbacks(req):
    
    return render(req, 'admindata/feedback.html',globalset)


from django.db.models import Min, Max





@adminlogin_required
def activate_category(req):
    if req.method == "POST":
        c_id = req.POST['c_id']
        is_active =  True

        category = get_object_or_404(Category, c_id=c_id)
        category.is_active = is_active
        category.save()

        return redirect(reverse('productcategories'))
    return redirect(reverse('productcategories'))
@adminlogin_required
def deactivate_category(req):
    if req.method == "POST":
        c_id = req.POST['c_id']
        is_active =  False

        category = get_object_or_404(Category, c_id=c_id)
        category.is_active = is_active
        category.save()

        return redirect(reverse('productcategories'))
    return redirect(reverse('productcategories'))
 

 

@adminlogin_required
def product_categories(req):
    if req.method =="POST":
      try:
            # Extract form data directly from request.POST
            c_id = req.POST['c_id']
            name = req.POST['name']
            detail = req.POST.get('detail', '')  # Default to an empty string if not provided
            is_active = 'is_active' in req.POST  # Check if checkbox is checked
            
            # Check if an image was uploaded
            image = req.FILES.get('image', None)  # Returns None if no file is uploaded

            # Create the category object
            category = Category(
                c_id=c_id,
                name=name,
                detail=detail,
                is_active=is_active
            )

            # Only set the image if one was uploaded
            if image:
                category.image = image
            
            # Save the category
            category.save()

            # Return a success message
            return JsonResponse({'success': True, 'message': 'Category created successfully!', 'id': category.id})

      except KeyError as e:
            # Handle missing fields
            return JsonResponse({'success': False, 'message': f'Missing field: {e.args[0]}'})
    
    queryset = {'category':categories}
    return render(req, 'admindata/products/categories.html',queryset)




@adminlogin_required
def all_product_list(req):
    
    sort = req.GET.get('sort', None)
    if sort == 'low_to_high':
        product = Product.objects.all()
    elif sort == 'high_to_low':
        product = Product.objects.all()
    else:
        product = Product.objects.all()
    img = ProductImage.objects.all()
    flag = 1
    queryset = {
        'product': product,
        'imgs': img,
        'flag' : flag,
    }



    return render(req, 'admindata/products/product_list.html',queryset)
@adminlogin_required
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
    flag = 0
    queryset = {
        
        'product': products,
        'catogery': category,
        'allcat': category,
        'imgs': img,
        'flag' : flag,
    }
    return render(req, 'admindata/products/product_list.html',queryset)

@adminlogin_required

@csrf_exempt
def add_product(req):
    if req.method == 'POST':
        # Fetch product details from the form
        category_id = req.POST.get('category')
        name = req.POST.get('name')
        description = req.POST.get('description', '')
        main_image = req.FILES.get('main_image')
        additional_images = req.FILES.getlist('additional_images[]')
        colors = req.POST.getlist('colors[]')

        print("POST Data:", req.POST)
        print("FILES Data:", req.FILES)

        # Validate required fields
        if not category_id:
            return JsonResponse({'error': 'Category is required.'}, status=400)
        if not name:
            return JsonResponse({'error': 'Product name is required.'}, status=400)
        if not main_image:
            return JsonResponse({'error': 'Main image is required.'}, status=400)

        # Fetch the category object
        try:
            category = Category.objects.get(id=category_id)
        except Category.DoesNotExist:
            return JsonResponse({'error': 'Invalid category.'}, status=400)

        # Create the product
        product = Product.objects.create(
            name=name,
            description=description,
            img=main_image,
            category=category
        )

        # Add additional images
        for image in additional_images:
            product.images.create(image=image)

        # Add color palette
        for color in colors:
            if color.strip():  # Ensure color is not empty
                Productcolorpalet.objects.create(Product=product, color=color.strip())

        # Add sizes and prices
        sizes = req.POST.dict()  # Get all POST data as a dictionary
        for key, value in sizes.items():
            if key.startswith('price['):  # Only process keys for sizes
                size = key[6:-1]  # Extract size from key, e.g., "0-6 months"
                price = value.strip()
                shipping_box = req.POST.get(f'shipping_box[{size}]', '').strip()

                if price:  # Ensure price is not empty
                    Productprice.objects.create(
                        product=product,
                        size=size,
                        price=price,
                        shipping_box=shipping_box or None  # Set as None if empty
                    )

        # Return success response with redirect URL
        return JsonResponse({'success': True, 'redirect_url': reverse('allproductlist')})

    # Fetch categories for the dropdown
    categories = Category.objects.all()

    # Render the form for GET request
    return render(req, 'admindata/products/addproduct.html', {'categories': categories})
@adminlogin_required
def product_detail(req, pid):
    # Try to get the product by ID, if it doesn't exist, show a friendly message
    try:
        product = Product.objects.get(id=pid)
    except Product.DoesNotExist:
        # Option 1: Render a custom 'not found' template
        return render(req, 'product/product_not_found.html', {'message': 'Product is Unavailable at a moment'})

    img = product.images.all()
    prices = Productprice.objects.filter(product=product)
    colorpalet =  Productcolorpalet.objects.filter(Product=product)
  
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




from django.views.decorators.http import require_POST
@adminlogin_required
@require_POST
def toggle_product_active(request):
    try:
        data = json.loads(request.body)
        product_id = data.get('product_id')
        is_active = data.get('is_active')

        if product_id is None or is_active is None:
            return JsonResponse({'success': False, 'message': 'Invalid data received.'})

        product = Product.objects.get(id=product_id)
        product.is_active = is_active
        product.save()

        return JsonResponse({
            'success': True,
            'message': f'Product "{product.name}" updated to {"active" if is_active else "inactive"}.'
        })
    except Product.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'Product not found.'})
    except Exception as e:
        return JsonResponse({'success': False, 'message': f'Error: {str(e)}'})

@adminlogin_required
def deleteproduct(req,pid):
    
    product = get_object_or_404(Product, id=pid)
    
    # Delete the product instance
    product.delete()

    return redirect(reverse('allproductlist'))


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

@csrf_exempt
def update_field(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            model = data.get("model")
            field = data.get("field")
            value = data.get("value")
            obj_id = data.get("id")  # May be None for new entries

            # Determine the model
            if model == "product":
                obj = Product.objects.get(id=obj_id) if obj_id else Product()
            elif model == "productprice":
                obj = Productprice.objects.get(id=obj_id) if obj_id else Productprice()
                # Ensure necessary fields are set for new Productprice
                if not obj_id:
                    obj.size = data.get("size", "default_size")
                    obj.price = data.get("price", 0)
                    obj.product_id = data.get("product_id")
            elif model == "colorpalet":
                obj = Productcolorpalet.objects.get(id=obj_id) if obj_id else Productcolorpalet()
                # Ensure necessary fields are set for new Colorpalet
                if not obj_id:
                    obj.color = value  # Use the passed color value
                    obj.product_id = data.get("product_id")  # Required FK
            else:
                return JsonResponse({"status": "error", "message": "Invalid model"}, status=400)

            # Update or set the specific field dynamically
            setattr(obj, field, value)
            obj.save()

            return JsonResponse(
                {
                    "status": "success",
                    "message": f"{field} {'created' if not obj_id else 'updated'} successfully",
                    "id": obj.id,
                }
            )
        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)}, status=400)
    return JsonResponse({"status": "error", "message": "Invalid request method"}, status=400)
 


def userlist(req):
    users = MyUser.objects.all()
    quaryset = {'users':users}
    return render(req, 'admindata/userlist.html',quaryset)






# Colorpalet

@csrf_exempt
def manage_color_palette(request):
    """
    Handle Add, Edit, and Delete operations for color palettes dynamically via JSON.
    """
    if request.method == 'POST':  # Add
        try:
            data = json.loads(request.body)
            product_id = data.get('product_id')
            color = data.get('color')

            product = Product.objects.get(id=product_id)
            new_color = Productcolorpalet.objects.create(Product=product, color=color)  # Use "Product" with an uppercase P
            return JsonResponse({'success': True, 'operation': 'add', 'id': new_color.id, 'color': new_color.color})
        except Product.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Product not found'}, status=404)

    elif request.method == 'PUT':  # Edit
        try:
            data = json.loads(request.body)
            color_id = data.get('id')
            new_color = data.get('color')

            color_palette = Productcolorpalet.objects.get(id=color_id)
            color_palette.color = new_color
            color_palette.save()

            return JsonResponse({'success': True, 'operation': 'edit', 'id': color_palette.id, 'color': color_palette.color})
        except Productcolorpalet.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Color not found'}, status=404)

    elif request.method == 'DELETE':  # Delete
        try:
            data = json.loads(request.body)
            color_id = data.get('id')

            color_palette = Productcolorpalet.objects.get(id=color_id)
            color_palette.delete()

            return JsonResponse({'success': True, 'operation': 'delete', 'id': color_id})
        except Productcolorpalet.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Color not found'}, status=404)

    return JsonResponse({'success': False, 'message': 'Invalid request method'}, status=400)



# for Price 

@adminlogin_required
@csrf_exempt
def manage_price(request):
    """
    Handle Add, Edit, and Delete operations for product prices dynamically via JSON.
    """
    if request.method == 'POST':  # Add
        try:
            data = json.loads(request.body)
            product_id = data.get('product_id')
            size = data.get('size')
            price = data.get('price')
            box_size = data.get('box_size')

            product = Product.objects.get(id=product_id)
            new_price = Productprice.objects.create(product=product, size=size, price=price, shipping_box=box_size)
            return JsonResponse({
                'success': True, 
                'operation': 'add', 
                'id': new_price.id, 
                'size': new_price.size, 
                'price': new_price.price, 
                'box_size': new_price.shipping_box
            })
        except Product.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Product not found'}, status=404)

    elif request.method == 'PUT':  # Edit
        try:
            data = json.loads(request.body)
            price_id = data.get('id')
            size = data.get('size')
            price = data.get('price')
            box_size = data.get('box_size')

            price_entry = Productprice.objects.get(id=price_id)
            price_entry.size = size
            price_entry.price = price
            price_entry.shipping_box = box_size
            price_entry.save()

            return JsonResponse({'success': True, 'operation': 'edit', 'id': price_entry.id})
        except Productprice.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Price entry not found'}, status=404)

    elif request.method == 'DELETE':  # Delete
        try:
            data = json.loads(request.body)
            price_id = data.get('id')

            price_entry = Productprice.objects.get(id=price_id)
            price_entry.delete()

            return JsonResponse({'success': True, 'operation': 'delete', 'id': price_id})
        except Productprice.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Price entry not found'}, status=404)

    return JsonResponse({'success': False, 'message': 'Invalid request method'}, status=400)



# update product details
@adminlogin_required
@csrf_exempt
def update_product_details(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        product_id = data.get('product_id')
        field = data.get('field')
        value = data.get('value')

        try:
            product = Product.objects.get(id=product_id)
            
            if field == 'name':
                product.name = value
            elif field == 'description':
                product.description = value
            else:
                return JsonResponse({'success': False, 'message': 'Invalid field'}, status=400)

            product.save()
            return JsonResponse({'success': True, 'field': field, 'value': value})
        except Product.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Product not found'}, status=404)

    return JsonResponse({'success': False, 'message': 'Invalid request method'}, status=400)




def req_orders(req):
    return render(req, 'admindata/orders/orders.html')

