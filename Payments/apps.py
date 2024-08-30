# Payments/apps.py

from django.apps import AppConfig
import paypalrestsdk
from django.conf import settings

class PaymentsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'Payments'

    def ready(self):
        # Configure PayPal SDK when the app is ready
        paypalrestsdk.configure({
            "mode": settings.PAYPAL_MODE,  # "sandbox" or "live"
            "client_id": settings.PAYPAL_CLIENT_ID,
            "client_secret": settings.PAYPAL_CLIENT_SECRET
        })
