from django.shortcuts import *
from django.urls import reverse
from django.views.generic import *
from Products.models import *
from Admin.models import *
from django.utils import timezone


from django.shortcuts import render, get_object_or_404
cat = Category.objects.all()


def bridge(request):
    user = request.user
    
    if not user.is_authenticated:
        return redirect(reverse('index'))
    
    if getattr(user, 'is_admin', False):  # Safely check if the user has the 'is_admin' attribute
        return redirect(reverse('adminpanel'))
    
    return redirect(reverse('index'))



def index(request):
    user = request.user
    server = get_object_or_404(Server, id=1)
    products = Product.objects.all()
    countdown_end_time = server.countdowntime
    context = {
        'products': products,
        'category': cat,
        'allcat': cat,
        'current_year': timezone.now().year,
        'countdown_end_time': countdown_end_time.isoformat(),  # Convert to ISO format for JavaScript
    }

    
    return render(request, 'index.html', context)
   




# class CategoryList(ListView):



#     template_name = 'index.html'
#     context_object_name = 'products'

#     def get_queryset(self):
#         return Product.objects.all()

#     def get_context_data(self, **kwargs):
#         context = super().get_context_data(**kwargs)
#         context['category'] = Category.objects.all()
#         context['allcat']= Category.objects.all()
#         return context
    
   
# cat = Category.objects.all()
# About session


def contact_page(req):
    quaryset = {
        'allcat': cat,
    }
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
        return render(req, 'contact/thankyou_for_contact.html')
    
    
    return render(req, 'contact/contact_page.html',quaryset)

def testingpage(req):
    quaryset = {
        'allcat': cat,
    }
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
        return render(req, 'contact/thankyou_for_contact.html')
    
    
    return render(req, 'contact/sweetalert.html',quaryset)





def studiospace(req):
    
    return render(req, 'about/Studiospace.html',{'allcat':cat})
def aboutus(req):
    return render(req, 'about/aboutus.html',{'allcat':cat})
def termsandcondition(req):
    return render(req, 'about/terms&condition.html',{'allcat':cat})
def privacyandpolicy(req):
    return render(req, 'about/privacyandpolicy.html',{'allcat':cat})
def frontendlicense(req):
    return render(req, 'admindata/LICENSE')

def custom_404_view(request, exception):
    return render(request, 'assets/404.html', status=404)
def custom_500_view(request):
    return render(request, 'assets/500.html', status=500)
