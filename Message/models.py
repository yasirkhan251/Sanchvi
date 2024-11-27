from django.db import models
from datetime import date
from django.utils import timezone
from datetime import timedelta
from Accounts.models import MyUser,default_expiry_time

# # Create your models here.
# def default_expiry_time():
#     return timezone.now() + timedelta(minutes=5)


class Forgotpassword(models.Model):
    user = models.OneToOneField(MyUser, on_delete=models.CASCADE)
    token = models.CharField(max_length=6, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(default=default_expiry_time)  # Callable

    def is_token_valid(self):
        return self.expires_at > timezone.now()
