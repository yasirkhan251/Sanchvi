from django.shortcuts import render,redirect
from django.urls import reverse
from django.contrib.auth import *
from Accounts.models import *
from .models import *
from django.contrib import messages
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

# Create your views here.



@csrf_exempt  # Disable CSRF for this view, or use the csrf token as done in JS
def toggle_server_mode(request):
    if request.method == "POST":
        data = json.loads(request.body)
        server_mode = data.get('servermode', None)

        # Assuming you have one server object. Update accordingly if you have multiple servers.
        server = Server.objects.first()  
        if server_mode is not None:
            server.servermode = server_mode
            server.save()
            return JsonResponse({'status': 'success', 'servermode': server_mode})
        
    return JsonResponse({'status': 'error', 'message': 'Invalid request'})
def get_server_mode(request):
    server = Server.objects.first()  # Get the first server object (adjust if needed)
    return JsonResponse({'servermode': server.servermode})

def admin_panel(req):

    return render(req, 'admindata/index.html')


def admin(req):
    
    return redirect(reverse('login'))