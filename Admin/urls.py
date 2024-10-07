from django.urls import path
from .views import *

urlpatterns = [
path('panel/',admin_panel, name='adminpanel' ),
path('',admin, name='admin'),


]
