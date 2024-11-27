from django.urls import path
from .views import *
from django.contrib.auth.views import LogoutView
from django.conf import settings
from django.conf.urls.static import static
urlpatterns = [

    path('login/', loginsystem,name='login'),
    path('signup/',user_signup,name='user_signup'),
    path('logout/',user_logout, name='logout'),
    path('profile', profile, name='profile'),
    path('settings/', settings_view, name='settings'),
    

    
   
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
