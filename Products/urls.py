from django.urls import *
from .views import *

urlpatterns =[
    path('dashboard/', ProductList.as_view(), name='dashboard'),
    path('product/<str:c_id>/<int:id>/', product_landing, name='product'),
    path('product/detail/<int:pid>', product_detail, name='productdetail'),
    path('dashboard/all_products', all_video, name='all_products'),
    path('basehtml', basehtml, name='basehtml'),
    

    path('contact_page', contact_page, name='contact_page'),
    path('contactusup', contactusup, name='contactusup'),
   
    path('size_chart/', sizechart, name='sizechart'),
    path('add-product/', add_product, name='add_product'),# to be added the products for adminpanel



    
]