from django.contrib import admin
from django.urls import path,include
from .views import *
from django.conf.urls.static import static
from django.conf import settings


urlpatterns = [
    path('admin_dev/', admin.site.urls),
    path('admin/', include('Admin.urls')),
    # path('', CategoryList.as_view(), name='index'),
    path('',bridge , name='bridge'),
    path('home/', index, name='index'),
    path('auth/', include('Accounts.urls')),
    path('in/', include('Products.urls')),
    path('StudioSpace', studiospace, name='studiospace' ),
    path('payment/', include('Payments.urls')),
    path('cart/', include('Cart.urls')),
    path('MSG/', include('Message.urls')),
    path('Terms&Condition/', termsandcondition, name='Terms&Condition'),
    path('About_Us/', aboutus, name='aboutus'),
    path('Privacy&Policy/' , privacyandpolicy, name='privacyandpolicy'),
    path('License/' , frontendlicense, name='frontendlicense'),
    path('contact_page', contact_page, name='contact_page'),
    path('test/', testingpage, name='test'),
    

    


]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)