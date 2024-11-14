from django.urls import path
from .views import *

urlpatterns = [
path('panel/',admin_panel, name='adminpanel' ),
path('',admin, name='admin'),
path('feeback/', feedbacks, name='feedback'),
path('userlist',userlist, name='userlist'),
path('serversettings',admin_serversettings, name='serversettings'),
path('toggle-server-mode/', toggle_server_mode, name='toggle_server_mode'),
path('get-server-mode/', get_server_mode, name='get_server_mode'), 
path('product/categories', product_categories, name='productcategories'),
path('product/<str:c_id>/<int:id>/', productlist, name='productlist'),
path('product/detail/<int:pid>', product_detail, name='adminproductdetail'),
path('search/<pid>/<cid>', search, name='adminsearch'),
path('searchall/', searchall, name='adminsearchall'),



]
