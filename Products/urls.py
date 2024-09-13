from django.urls import *
from .views import *

urlpatterns =[
    path('dashboard/', ProductList.as_view(), name='dashboard'),
    path('product/<str:c_id>/<int:id>/', product_landing, name='product'),
    path('product/detail/<int:pid>', product_detail, name='productdetail'),
    path('dashboard/all_products', all_video, name='all_products'),
    path('basehtml', basehtml, name='basehtml'),
    path('About_Us', aboutus, name='aboutus'),
    path('profile', profile, name='profile'),
    path('contact_page', contact_page, name='contact_page'),
    path('Terms&Condition', termsandcondition, name='Terms&Condition'),
  
    path('Privacy&Policy' , privacyandpolicy, name='privacyandpolicy'),

    path('add-product/', add_product, name='add_product'),# to be added the products for adminpanel

     path('settings/', settings_view, name='settings'),

    
]