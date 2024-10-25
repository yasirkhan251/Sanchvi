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



]
