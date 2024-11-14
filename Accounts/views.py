from django.shortcuts import *
from django.urls import *
from django.contrib.auth import *
from .models import *
import random
import string
from django.contrib import messages
from django.shortcuts import redirect
from django.urls import reverse

from django.contrib.auth.models import * 
from .utils import send_mail_to_client
from django.utils.crypto import get_random_string
from datetime import timedelta
from django.utils import timezone
import secrets

def create_verification_token(user_id):
    try:
        user = MyUser.objects.get(id=user_id)
        token = str(random.randint(100000, 999999)) 
        expires_at = timezone.now() + timedelta(minutes=5)  # Token valid for 5 minutes
        verification, created = Forgotpassword.objects.update_or_create(
            user=user,
            defaults={'token': token, 'expires_at': expires_at}
        )
        return token
    except MyUser.DoesNotExist:
        # Handle the case where the user with the given ID doesn't exist
        return None

def generate_server_id():
    # Define the characters to choose from
    characters = string.ascii_letters + string.digits

    # Generate a random 8-character string
    server_id = ''.join(random.choices(characters, k=8))
    
    return server_id


def loginsystem(request):
    if request.method == "POST":
        req = 'login posted'
        print(req)
        username = request.POST['username']
        password = request.POST['password']

        try:
            user_instance = MyUser.objects.get(username=username)
        except MyUser.DoesNotExist:
            messages.error(request, "Username does not exist. Please create a new one.")
            return redirect(reverse('login'))

        # Authenticate the user
        user = authenticate(username=username, password=password)
        
        if user is not None:
            # Check if the user is a regular user or admin
            if user_instance.is_user:
                login(request, user)
                request.session['login_attempts'] = 0
                return redirect(reverse('index'))  # Redirect to user index
            elif user_instance.is_admin:
                login(request, user)
                request.session['login_attempts'] = 0
                return redirect(reverse('adminpanel'))  # Redirect to admin panel
        else:
            # Handle invalid password attempts
            if 'login_attempts' not in request.session:
                request.session['login_attempts'] = 0
            request.session['login_attempts'] += 1

            if request.session['login_attempts'] > 2:
                messages.error(request, "Incorrect Password, please try again or reset your password.")
            else:
                messages.error(request, "Incorrect Password, please try again.")

            return redirect(reverse('login'))

    return render(request, 'auth/credentials.html')  


def user_signup(request):
    if request.method == "POST":
        reqs = 'signup posted'
        username = request.POST['username']
        email = request.POST['email']
        phone = request.POST['phone']
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
                user = MyUser.objects.create(username = username  , email = email, server_id = server, is_user = True, phone = phone)
                user.set_password(password)
                user.save()
                user = authenticate(username = username, password = password )
                if user is not None:
                    login(request, user)
                    # request.session['user_login'] = request.user
                    return redirect(reverse('index'))
                return redirect(reverse('login') )
                   
        else :
            error = 'Password MissMached, Please Try Again!'
            messages.error(request, error)
            # messages.error(request, "Please Create a new one")
        
            return redirect(reverse('login') )
    
           

# Create your views here.



def user_logout(request):
    logout(request)  # Log out the user
    return redirect('login')







# profile settings

def settings_view(request):
    return render(request, 'profile/setting.html') 

def profile(req):
    return render(req, 'profile/profile.html')






def forgot_password(request):
    if request.method == "POST":
        field = request.POST.get('field')  # Use get to safely access the field input
        
        # Check if the field input matches a username or an email
        user_by_username = MyUser.objects.filter(username=field).first()
        user_by_email = MyUser.objects.filter(email=field).first()
        
        if user_by_username:
            user = user_by_username.id
            # Send email with verification token
            token = create_verification_token(user)
            send_mail_to_client(user_by_username.username, user_by_username.email, token)
            return redirect(reverse('verification', args=[user_by_username.pk, field, user_by_username.email]))
        elif user_by_email:
            user = user_by_email.pk
            username = user_by_email.username
            # Send email with verification token
            token = create_verification_token(user)
            send_mail_to_client(user_by_email.username, user_by_email.email, token)
            return redirect(reverse('verification', args=[user_by_email.pk, user_by_email.username, user_by_email.email]))
        else:
            messages.error(request, 'The provided username or email does not exist.')
            return redirect(reverse('login'))

    return render(request, 'auth/forgotpassword/forgotpassword.html')


def verification(request,user,username,email):

    token = Forgotpassword.objects.get(user = user)
    user = MyUser.objects.get(username = username)
    context = {
        'username':username,
        'user':user,
        'email': email
        }
    if request.method == "POST":
        verification_token = request.POST['token']
        print('verification token :' ,verification_token)
        print(token.token)
        print(token)
        
        if verification_token == token.token:
            messages.success(request, "Verification Completed Successfully")
            return redirect(reverse('change_password', args=[username]))
        
            
        else :
            messages.error(request, "Your Verification Code does not match")
            



    
    return render(request, 'auth/forgotpassword/verification.html', context)





def change_password(request,user):
    
    
    # context = {
    #     'user':username,
    #     'email': email
    #     }
    if request.method == "POST":
        
        
        pass1 = request.POST['pass1']
        pass2 = request.POST['pass2']
        if pass1 == pass2:
           password  =pass2

           user = MyUser.objects.get(username = user)
           user.set_password(password)
           user.save()
           messages.success(request, "Password has Changed!")
           return redirect(reverse('login'))
        else :
            messages.error(request, "Password Dont Match!, Please Try Again")
    return render(request, 'auth/forgotpassword/change_password.html')

def password_change_successful(request):
    return HttpResponse ('hi')









