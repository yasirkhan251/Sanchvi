from django.shortcuts import *
from django.urls import *
from django.contrib.auth import *
from .models import *
import random
import string
from django.contrib import messages
from django.shortcuts import redirect
from django.urls import reverse


def generate_server_id():
    # Define the characters to choose from
    characters = string.ascii_letters + string.digits

    # Generate a random 8-character string
    server_id = ''.join(random.choices(characters, k=8))
    
    return server_id


def user_login(request):
    if request.method == "POST":
        req = 'login posted'
        print(req)
        username = request.POST['username']
        password = request.POST['password']
        is_user = True
 
        
        if MyUser.objects.filter(username = username, is_user = is_user).exists():
            user = authenticate(username = username, password = password )
            if user is not None:
                login(request, user)
                request.session['login_attempts'] = 0 
                return redirect(reverse('index'))
            else:
                
               
                if 'login_attempts' not in request.session:
                    request.session['login_attempts'] = 0

                request.session['login_attempts'] += 1

                if request.session['login_attempts'] > 2:
                    messages.error(request, "Incorrect Password, please Try Again! or Click forgot password")
                else:
                    messages.error(request, "Incorrect Password, please Try Again!")

                    
                return redirect(reverse('user_login') )
                
        else :
                messages.error(request, "Username Does not Exist")
                messages.error(request, "Please Create a new one")
              
                return redirect(reverse('user_login') )
    return render(request, 'auth/credentials.html')

        


def user_signup(request):
    if request.method == "POST":
        reqs = 'signup posted'
        username = request.POST['username']
        email = request.POST['email']
        # phone = request.POST['phone']
        pass1 = request.POST['pass1']
        pass2 = request.POST['pass2']
        # first_name = request.POST['first_name']
        # last_name = request.POST['last_name']
        server = generate_server_id()
        if pass1 == pass2:
            password = pass2
            print(reqs)
            
            if  MyUser.objects.filter(username = username ).exists():
                messages.error(request, "Username already taken")
                messages.error(request, "Please Create a new one")
              
                
                return redirect(reverse('index') )
            else :
                user = MyUser.objects.create(username = username  , email = email, server_id = server, is_user = True, )
                user.set_password(password)
                user.save()
                user = authenticate(username = username, password = password )
                if user is not None:
                    login(request, user)
                    # request.session['user_login'] = request.user
                    return redirect(reverse('index'))
                return redirect(reverse('credentials') )
                   
        else :
            error = 'Password MissMached, Please Try Again!'
            messages.error(request, error)
            # messages.error(request, "Please Create a new one")
        
            return redirect(reverse('credentials') )
    
           

# Create your views here.



def user_logout(request):
    logout(request)  # Log out the user
    return redirect('user_login')



def admin_login_page(req):
    return render(req, 'admin/login.html')

def admin_register_page(req):
    return render(req, 'admin/register.html')



# profile settings

def settings_view(request):
    return render(request, 'profile/setting.html') 

def profile(req):
    return render(req, 'profile/profile.html')