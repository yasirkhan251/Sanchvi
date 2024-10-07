from django.db import models

# Create your models here.
class Server(models.Model):
    servermode= models.BooleanField()
    countdowntime = models.DateTimeField(null=True,blank=True)
