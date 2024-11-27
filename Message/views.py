from django.shortcuts import *
from Accounts.models import MyUser,timedelta,timezone
from django.urls import *
from .models import Forgotpassword
import random
import string
from django.contrib.auth.models import * 
from .utils import send_mail_to_client
from django.utils.crypto import get_random_string
from datetime import timedelta
from django.utils import timezone
from django.contrib import messages

# Create your views here.

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


def verification(request, user, username, email):
    try:
        # Retrieve the token object for the user
        token = Forgotpassword.objects.get(user=user)
    except Forgotpassword.DoesNotExist:
        messages.error(request, "Invalid verification request.")
        return redirect('forgot_password')  # Replace with your 'forgot password' URL name

    try:
        # Retrieve the user object by username
        user = MyUser.objects.get(username=username)
    except MyUser.DoesNotExist:
        messages.error(request, "User not found.")
        return redirect('forgot_password')  # Replace with appropriate redirect

    context = {
        'username': username,
        'user': user,
        'email': email
    }

    if request.method == "POST":
        verification_token = request.POST.get('token', '').strip()  # Safely get token input
        if verification_token == token.token:
            # Verify if the token is expired
            if token.expires_at >= timezone.now():
                messages.success(request, "Verification Completed Successfully")
                return redirect(reverse('change_password', args=[username]))
            else:
                messages.error(request, "Verification token has expired. Request a new one.")
        else:
            messages.error(request, "Your Verification Code does not match.")

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

