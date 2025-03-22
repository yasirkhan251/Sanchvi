from .views import *
from django.urls import path

urlpatterns = [
   path("", manager_dashboard, name="manager_dashboard"),
   path("admin/", manager_dashboard_admin, name="manager_dashboard_admin"),
    path("tailor/<int:tailor_id>/", tailor_detail, name="tailor_detail"),
    path("admin/tailor_salary/<int:tailor_id>/", tailor_salary, name="tailor_salary"),
    path("edit-entry/<int:entry_id>/",  edit_time_entry, name="edit_time_entry"),
    path("add-entry/<int:tailor_id>/", add_time_entry, name="add_time_entry"), 
]