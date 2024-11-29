from django.shortcuts import *
from Accounts.models import MyUser,timedelta,timezone
from django.urls import *
from .models import Forgotpassword
from django.contrib.auth.models import * 
from .utils import send_mail_to_client
from django.utils import timezone
from django.contrib import messages
from django.core.mail import EmailMessage,EmailMultiAlternatives
from django.http import JsonResponse
from django.core.mail import EmailMessage
from django.template.loader import render_to_string
from django.conf import settings
from Cart.models import *
from django.utils.html import strip_tags



# Create your views here.


# for forgot password 
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

# end forgot password 




def send_order_confirmation_email(order, request):
    try:
        # Fetch related items and shipping address
        order_items = order.items.all()
        shipping_address = order.address

        # Prepare product details for the email
        product_details = [
            {
                'name': item.product.name,
                'image': f"https://sanchvistudio.com/{item.product.img.url}" if item.product.img else '',
                'price': item.price,
                'size': item.size,
                'color': item.color,
                'quantity': item.qty,
            }
            for item in order_items
        ]

        # Render HTML content
        email_html_content = render_to_string('email/purchase.html', {
            'user': order.user,
            'shipping_address': shipping_address,
            'product_details': product_details,
            'shipping': order.shipping_amount,
            'total_amount': order.total_amount,
        })

        # Strip tags for plain text version (optional)
        email_plain_content = strip_tags(email_html_content)

        # Send email
        email_subject = f"Order Confirmation - Order #{order.invoice}"
        email = EmailMultiAlternatives (
            subject=email_subject,
            body=email_plain_content,  # Use plain text as fallback
            from_email='your_email@example.com',
            to=[order.user.email],
        )
        email.attach_alternative(email_html_content, "text/html")  # Attach the HTML version
        email.send()
        print('Success Email Send to ' , request.user)

    except Exception as e:
        print(f"Error sending order confirmation email: {e}")
# def send_order_confirmation_email(order):
#     try:
#         order_items = order.items.all()
#         shipping_address = order.address

#         # Prepare product details for the email
#         product_details = [
#             {
#                 'name': item.product.name,
#                 'image': item.product.img.url if item.product.img else '',  # Get the image URL
#                 'price': item.price,
#                 'size': item.size,
#                 'color': item.color,
#                 'quantity': item.qty,
#             }
#             for item in order_items
#         ]

#         # Render email content
#         queryset = {
#             'user': order.user,
#             'shipping_address': shipping_address,
#             'product_details': product_details,
#             'total_amount': order.total_amount,
#         }
#         email_content = render_to_string('email/purchase.html', queryset)

#         # Send email
#         email_subject = f"Order Confirmation - Order #{order.order_id}"
#         email = EmailMultiAlternatives(
#             subject=email_subject,
#             body=email_content,
#             from_email='your_email@example.com',
#             to=[order.user.email],
#         )
#         email.content_subtype = "html"  # Specify HTML content
#         email.send()
#         # return render(order,'email/purchase.html',queryset)

#     except Exception as e:
#         print(f"Error sending order confirmation email: {e}")



# def send_order_confirmation_email(order):
#     """
#     Sends an email with order confirmation details to the user for a specific order.

#     Args:
#         order: The Order object containing the purchase details.
#     """
#     try:
#         # Fetch order items and shipping address
#         order_items = order.items.all()
#         shipping_address = order.address

#         # Prepare product details for the email
#         product_details = []
#         for item in order_items:
#             product_details.append({
#                 'name': item.product.name,
#                 'image': item.product.img.url if item.product.img else '',  # Replace with correct image field
#                 'price': item.price,
#                 'size': item.size,
#                 'color': item.color,
#                 'quantity': item.qty,
#             })

#         # Render email content using an HTML template
#         email_content = render_to_string('email/purchase.html', {
#             'user': order.user,
#             'shipping_address': shipping_address,
#             'product_details': product_details,
#             'total_amount': order.total_amount,
#         })

#         # Set up the email
#         email_subject = f"Order Confirmation - Order #{order.order_id}"
#         email = EmailMessage(
#             subject=email_subject,
#             body=email_content,
#             from_email=settings.DEFAULT_FROM_EMAIL,
#             to=[order.user.email],  # Send to the user's email
#         )
#         email.content_subtype = "html"  # Specify HTML content

#         # Send the email
#         email.send()

#     except Exception as e:
#         # Handle exceptions
#         print(f"Error sending order confirmation email: {e}")



# def send_order_confirmation_email(user):
#     """
#     Sends an email with order confirmation details to the user after a successful purchase.

#     Args:
#         user: The user object (MyUser) who made the purchase.
#     """
#     # Fetch the user's shipping address and cart items
#     try:
#         shipping_address = Shipping_address.objects.get(user=user)
#         cart_items = Cart.objects.filter(user=user)

#         # If no cart items exist, skip the email
#         if not cart_items.exists():
#             return

#         # Prepare product details for the email
#         product_details = []
#         for item in cart_items:
#             product_details.append({
#                 'name': item.product.name,
#                 'image': item.product.img.url if item.product.img else '',  # Replace with correct image field
#                 'price': item.price,
#                 'size': item.size,
#                 'color': item.color,
#                 'quantity': item.qty,
#             })

#         # Render email content using an HTML template
#         email_content = render_to_string('order_confirmation_email.html', {
#             'user': user,
#             'shipping_address': shipping_address,
#             'product_details': product_details,
#         })

#         # Set up the email
#         email_subject = "Order Confirmation"
#         email = EmailMessage(
#             subject=email_subject,
#             body=email_content,
#             from_email=settings.DEFAULT_FROM_EMAIL,
#             to=[user.email],  # Send to the user's email
#         )
#         email.content_subtype = "html"  # Specify HTML content

#         # Send the email
#         email.send()

#         # Clear the user's cart after sending the email
#         cart_items.delete()

#     except Shipping_address.DoesNotExist:
#         # Handle case where the user has no shipping address
#         print("Shipping address not found for user:", user.username)
#     except Exception as e:
#         # Handle any other exceptions
#         print(f"Error sending order confirmation email: {e}")




def testit(request):
    if request.method == 'POST':
        # sender = request.POST.get('sender')
        recipient = request.POST.get('recipient')
        subject = request.POST.get('subject')
        message = request.POST.get('message')
        files = request.FILES.getlist('attachment')  # Handle multiple attachments

        try:
            # Create the email
            email = EmailMultiAlternatives(
                subject=subject,
                body=message,
                # from_email=sender,
                to=[recipient],
            )

            # Attach files if any
            for file in files:
                email.attach(file.name, file.read(), file.content_type)

            # Send the email
            email.send()

            return JsonResponse({'success': True, 'message': 'Email sent successfully!'})

        except Exception as e:
            return JsonResponse({'success': False, 'message': f'Error: {str(e)}'})

    return render(request, 'test.html')


