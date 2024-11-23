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
path("update-field/", update_field, name="update_field"),
path('product/color/manage/', manage_color_palette, name='manage_color_palette'),
path('product/price/manage/', manage_price, name='manage_price'),
 path('product/details/update/', update_product_details, name='update_product_details'),
 path('activate_category/', activate_category, name='activate_category'),
 path('deactivate_category/', deactivate_category, name='deactivate_category'),
 path('all_product_lists/', all_product_list, name='allproductlist'),
 path('add_product/', add_product, name='addproduct'),
 path('delete_product/<int:pid>', deleteproduct, name='deleteproduct'),
 path('toggle-product-active/', toggle_product_active, name='toggle_product_active'),
 path("execute-sql/", execute_sql_view, name="execute_sql"),
 path("SQL/",SQL , name="SQL"),






]
