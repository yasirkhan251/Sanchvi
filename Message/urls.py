from django.urls import *
from .views import * 

urlpatterns = [
    path('forgot_password/', forgot_password, name='forgotpassword'),
    path('verification/<user>/<username>/<email>/', verification, name='verification'),
    path('change_password/<user>',change_password,name='change_password'),
    path('testit/',testit,name='testit'),
    

]