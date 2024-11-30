from django.core.mail import EmailMultiAlternatives
from django.conf import settings
from django.shortcuts import redirect
from django.utils.html import strip_tags
from functools import wraps

def send_mail_to_client(username, email, token):
    subject = f"Verification Code for {username}"
    from_email = settings.EMAIL_HOST_USER
    recipient_list = [email]

    # Absolute URL to the static image (update with your actual domain)
    logo_url = "https://sanchvistudio.com/static/img/logo_copy.png"

    # HTML Content with inline CSS and image URL
    html_content = f'''
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e2e2; border-radius: 10px;">
        <center><img src="{logo_url}" alt="Logo" style="width: 100px; height: auto;"></center>
        <h2 style="color:#dc23e0; text-align: center;">Welcome to Sanchvi Studio, {username}!</h2>
        <p style="font-size: 16px; color: #333;">Hi <strong>{username}</strong>,</p>
        <p style="font-size: 14px; color: #333;">
            Thank you for signing up! Your verification code is:
        </p>
        <p style="font-size: 24px; color: #af4c93; font-weight: bold; text-align: center;">
            {token}
        </p>
        <p style="font-size: 14px; color: #333;">
            Please use this code within the next 5 minutes to verify your account.
        </p>
        <p style="font-size: 12px; color: #999; text-align: center; margin-top: 20px;">
            If you did not request this, please ignore this email. <br>Thank you!
        </p>
    </div>
    '''
    # Plain text version (for clients that don't render HTML)
    text_content = strip_tags(html_content)

    # Create email message with both plain text and HTML versions
    email_message = EmailMultiAlternatives(subject, text_content, from_email, recipient_list)
    email_message.attach_alternative(html_content, "text/html")

    try:
        email_message.send()
        return "Email sent successfully with styled content."
    except Exception as e:
        return f"Failed to send email: {e}"
    


def adminlogin_required(view_func):
    @wraps(view_func)
    def _wrapped_view(request, *args, **kwargs):
        if request.user.is_authenticated and request.user.is_admin:
            return view_func(request, *args, **kwargs)
        return redirect('login')  # Redirect to login if not authenticated as admin
    return _wrapped_view
