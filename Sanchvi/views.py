from django.shortcuts import *
from django.views.generic import *
from Products.models import *

def index(req):
    return render(req, 'index.html')
 



class CategoryList(ListView):
    template_name = 'index.html'
    context_object_name = 'products'

    def get_queryset(self):
        return Product.objects.all()

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['category'] = Category.objects.all()
        context['allcat']= Category.objects.all()
        return context
    
   
   
# About session
def studiospace(req):
    cat = Category.objects.all()
    return render(req, 'about/Studiospace.html',{'allcat':cat})
def aboutus(req):
    return render(req, 'about/aboutus.html')
def termsandcondition(req):
    return render(req, 'about/terms&condition.html')
def privacyandpolicy(req):
    return render(req, 'about/privacyandpolicy.html')