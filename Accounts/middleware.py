from django.utils import timezone
from .models import UserVisit
import re

class LogUserVisitMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # List of file types to ignore (static files or assets)
        static_file_extensions = re.compile(r'.*\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$')

        # Check if the request is for the admin panel or static files, and ignore those
        if request.path.startswith('/admin_dev/')  or static_file_extensions.match(request.path) or  request.path.startswith('/admin/') :
            return self.get_response(request)

        # Only log visits for HTML requests (ignore non-HTML requests)
        if 'text/html' not in request.META.get('HTTP_ACCEPT', ''):
            return self.get_response(request)

        # Extract the real IP address from X-Forwarded-For if available
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]  # The first IP in the list is the real IP
        else:
            ip = request.META.get('REMOTE_ADDR')

        # Log the visit details
        user = request.user if request.user.is_authenticated else None
        path = request.path
        user_agent = request.META.get('HTTP_USER_AGENT')

        # Create a new UserVisit entry
        UserVisit.objects.create(
            user=user,
            ip_address=ip,
            user_agent=user_agent,
            path=path,
            timestamp=timezone.now()
        )

        # Proceed with the response
        response = self.get_response(request)
        return response
