from django.urls import path
from .views import *
from django.contrib.auth.views import LogoutView
urlpatterns = [

    path('login/', user_login,name='user_login'),
    path('signup/',user_signup,name='user_signup'),
    path('admin_login/',admin_login_page, name='admin_login_page'),
    path('admin_register/',admin_register_page, name='admin_register_page'),
    path('logout/',user_logout, name='logout'),
    path('profile', profile, name='profile'),
    path('settings/', settings_view, name='settings'),
    
   
]
