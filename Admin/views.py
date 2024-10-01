from django.shortcuts import render,redirect
from django.urls import reverse
from django.contrib.auth import *
from Accounts.models import *
from django.contrib import messages

# Create your views here.



def admin_panel(req):

    return render(req, 'admindata/index.html')


def admin(req):
    
    return redirect(reverse('login'))