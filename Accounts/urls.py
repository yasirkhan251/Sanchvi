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
    path('forgot_password/', forgot_password, name='forgotpassword'),
     path('verification/<user>/<username>/<email>/', verification, name='verification'),
    path('change_password/<user>',change_password,name='change_password'),
    path('password_change_successful/',password_change_successful,name='password_change_successful'),

    
   
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
