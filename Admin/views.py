from django.shortcuts import render,redirect
from django.urls import reverse
from django.contrib.auth import *
from Accounts.models import *
from Admin.models import *
from .models import *
from django.contrib import messages
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.dateparse import parse_datetime
from django.utils import timezone
import json


# Create your views here.

feedcount = Feedback.objects.all()
feed = Feedback.objects.all()
# feed = Feedback.objects.all().order_by('-created_at')[:3]
globalset = {'feedback':feed,'feedcount':feedcount}

@csrf_exempt  # Disable CSRF for this view, or use the csrf token as done in JS
def toggle_server_mode(request):
    if request.method == "POST":
        data = json.loads(request.body)
        
        # Get server mode and countdown time from the frontend (both could be null)
        server_mode = data.get('servermode', None)
        countdown_time = data.get('countdowntime', None)
        
        # Assuming you have one server object. Adjust if you have multiple.
        server = Server.objects.first()
        
        # Update the server mode if provided
        if server_mode is not None:
            server.servermode = server_mode
        
        # Update the countdown time if provided
        if countdown_time:
            # Parse the countdown_time string into a Python datetime object
            countdown_time_obj = parse_datetime(countdown_time)
            if countdown_time_obj is not None:
                server.countdowntime = countdown_time_obj
            else:
                return JsonResponse({'status': 'error', 'message': 'Invalid countdown time format'})
        
        # Save the server object with updated fields
        server.save()
        
        return JsonResponse({
            'status': 'success',
            'servermode': server.servermode,
            'countdowntime': server.countdowntime
        })
        
    return JsonResponse({'status': 'error', 'message': 'Invalid request'})

def get_server_mode(request):
    """
    Fetches the current server mode and countdown time from the backend.
    """
    server = Server.objects.first()  # Assuming a single server object
    return JsonResponse({
        'servermode': server.servermode,
        'countdowntime': server.countdowntime  # Send the current countdown time
    })

def admin_panel(req):

    return render(req, 'admindata/index.html',globalset)


def admin_serversettings(req):
    return render(req,'admindata/settings.html',globalset)

 
def admin(req):
    
    return redirect(reverse('login'))


def feedbacks(req):
    
    return render(req, 'admindata/feedback.html',globalset)


def userlist(req):
    users = MyUser.objects.all()
    quaryset = {'users':users}
    return render(req, 'admindata/userlist.html',quaryset)

