from django.contrib import admin
from .models import * 
# Register your models here.

@admin.register(Country)
class CountryAdmin(admin.ModelAdmin):
    list_display = ('name', 'id')  # Displays ID and name for Country

@admin.register(State)
class StateAdmin(admin.ModelAdmin):
    list_display = ( 'name', 'get_country_name','id')  # Displays ID, name, and related country name for State

    # Method to display the country name instead of the foreign key ID
    def get_country_name(self, obj):
        return obj.country.name
    get_country_name.short_description = 'Country'

# @admin.register(City)
# class CityAdmin(admin.ModelAdmin):
#     list_display = ( 'name', 'get_state_name','id')  # Displays ID, name, and related state name for City

#     # Method to display the state name instead of the foreign key ID
#     def get_state_name(self, obj):
#         return obj.country.name
#     get_state_name.short_description = 'State'

# @admin.register(Area)
# class AreaAdmin(admin.ModelAdmin):
#     list_display = ( 'name', 'get_city_name', 'zipcode','id')  # Displays ID, name, related city name, and zipcode for Area

    # Method to display the city name instead of the foreign key ID
    def get_city_name(self, obj):
        return obj.city.name
    get_city_name.short_description = 'City'

@admin.register(Server)
class ServerAdmin(admin.ModelAdmin):
    list_display = ('servermode', 'countdowntime')  # Displays server mode and countdown time for Server
    

@admin.register(Feedback)
class ContactmeAdmin(admin.ModelAdmin):
    list_display = ('email', 'mobile','first_name','last_name','message','created_at')


