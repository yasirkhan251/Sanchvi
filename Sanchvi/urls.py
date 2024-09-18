from django.contrib import admin
from django.urls import path,include
from .views import *
from django.conf.urls.static import static
from django.conf import settings
urlpatterns = [
    path('admin/', admin.site.urls),
    path('', CategoryList.as_view(), name='index'),
    # path('', CategoryList.as_view(), name='index'),
    path('auth/', include('Accounts.urls')),
    path('in/', include('Products.urls')),
    path('StudioSpace', studiospace, name='studiospace' ),
    path('checkout/', include('Payments.urls')),
    path('cart/', include('Cart.urls')),
    path('Terms&Condition/', termsandcondition, name='Terms&Condition'),
    path('About_Us/', aboutus, name='aboutus'),
    path('Privacy&Policy/' , privacyandpolicy, name='privacyandpolicy'),
    


]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)