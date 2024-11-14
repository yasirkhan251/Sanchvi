from django.db import models
from Accounts.models import *
import pytz

# Create your models here.
class Server(models.Model):
    servermode= models.BooleanField()
    countdowntime = models.DateTimeField(null=True,blank=True)
    

class Country(models.Model):
    name = models.CharField(max_length=100,unique=True)
    def __str__(self):
        return self.name

class State(models.Model):
    country = models.ForeignKey(Country, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    def __str__(self):
        return self.name

# class City(models.Model):
#     state = models.ForeignKey(State, on_delete=models.CASCADE)
#     name = models.CharField(max_length=100)

# class Area(models.Model):
#     city = models.ForeignKey(City, on_delete=models.CASCADE)
#     name = models.CharField(max_length=100)
#     zipcode = models.IntegerField()




class Feedback(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
    mobile = models.BigIntegerField()
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)

    def __str__(self):
        if self.created_at:
            # Convert to IST
            ist = pytz.timezone('Asia/Kolkata')
            created_at_ist = self.created_at.astimezone(ist)
            formatted_time = created_at_ist.strftime('%Y-%m-%d %I:%M:%S %p %Z')
        else:
            formatted_time = 'No time available'
            
        return f"{self.first_name} {self.last_name} : {self.email} / {self.mobile} - {formatted_time}"
    


