from django.urls import path
from .views import *

urlpatterns = [
path('panel/',admin_panel, name='adminpanel' ),
path('',admin, name='admin'),
path('toggle-server-mode/', toggle_server_mode, name='toggle_server_mode'),
path('get-server-mode/', get_server_mode, name='get_server_mode'),


]
