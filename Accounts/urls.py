from django.urls import path
from .views import *
from django.contrib.auth.views import LogoutView
urlpatterns = [

    path('login/', loginsystem,name='login'),
    path('signup/',user_signup,name='user_signup'),
    
    path('logout/',user_logout, name='logout'),
    path('profile', profile, name='profile'),
    path('settings/', settings_view, name='settings'),
    
   
]
