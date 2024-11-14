import logging
from django.shortcuts import render
from django.utils import timezone
from django.urls import reverse
from .models import Server

logger = logging.getLogger(__name__)

class ServerModeMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Define a list of paths to exclude from the maintenance mode
        excluded_paths = [
            reverse('admin:index'),  # Django Admin URL
            '/admin/',  # Your custom admin URL
            '/in/contactusup',
            '/admin/settings/',  # Another custom admin URL
            '/auth/login',
            # Add more paths as needed
        ]

        # Skip middleware for these excluded paths
        for path in excluded_paths:
            if request.path.startswith(path):
                return self.get_response(request)

        # Get the server instance to check server mode
        try:
            server = Server.objects.get(id=1)

            # Log the server mode for debugging
            logger.info(f"[Middleware] Server mode is {server.servermode}")

            # If server mode is False (maintenance mode), render the maintenance page
            if not server.servermode:
                countdown_end_time = server.countdowntime
                context = {
                    'current_year': timezone.now().year,
                    'countdown_end_time': countdown_end_time.isoformat() if countdown_end_time else None,
                }
                return render(request, 'assets/serverundermaintainance.html', context)
        except Server.DoesNotExist:
            # If no server instance exists, allow the request to proceed normally
            logger.error("[Middleware] Server instance does not exist.")

        # Proceed with the original request if server mode is True or URL is excluded
        return self.get_response(request)
