from django.shortcuts import *
from .models import *
from django.views.generic import *
from django.urls import reverse
from .forms import *

cat = Category.objects.all()
# Create your views here.
def dashboard(req):
    return render(req, 'dashboard.html')

class ProductList(ListView):
    queryset = Product.objects.all()
    template_name = 'dashboard.html'
    context_object_name = 'products'


def product_landing(req,c_id, id):
    category= get_object_or_404(Category, c_id = c_id)
    products = Product.objects.filter(category_id=id).select_related('category').prefetch_related('prices', 'images')
    prices = Productprice.objects.filter(product__in=products)

    # category= Category.objects.filter(c_id = c_id)
    
  
    # products = Product.objects.filter(category = id)
    

    img = ProductImage.objects.all()
    queryset = {
        'product':products,
        'catogery':category,
        'allcat':cat,
        'imgs':img,
        'prices':prices,
    }
    return render(req, 'Shop_product_list.html' , queryset)

def product_detail(req, pid):
    # Try to get the product by ID, if it doesn't exist, show a friendly message
    try:
        product = Product.objects.get(id=pid)
    except Product.DoesNotExist:
        # Option 1: Render a custom 'not found' template
        return render(req, 'product_not_found.html', {'message': 'Product not found'})

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

    queryset = {
        'product': product,
        'imgs': img,
        'allcat': cat,  # Make sure 'cat' is defined somewhere in your code
        'prices': prices,
        'color':colorpalet
    }

    return render(req, 'productdetail.html', queryset)


def all_video(req):
    return render(req, 'all_videos.html')

def basehtml(req):
    cat = Category.objects.all()
    
    return render(req, 'base.html',{'cat': cat})

def aboutus(req):
    return render(req, 'aboutus.html')


def profile(req):
    return render(req, 'profile.html')

def contact_page(req):
    return render(req, 'contact_page.html')
def termsandcondition(req):
    return render(req, 'terms&condition.html')
def privacyandpolicy(req):
    return render(req, 'privacyandpolicy.html')




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



def settings_view(request):
    return render(request, 'setting.html') 