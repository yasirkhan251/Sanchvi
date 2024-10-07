# import logging
# from celery import shared_task
# from django.utils import timezone
# from .models import Server

# logger = logging.getLogger(__name__)

# @shared_task
# def check_and_update_server_mode():
#     try:
#         server = Server.objects.get(id=1)
        
#         # Get the current time in the local timezone (Asia/Kolkata)
#         now = timezone.localtime()

#         # Ensure countdowntime is also in the local timezone
#         if server.countdowntime:
#             countdowntime = timezone.localtime(server.countdowntime)

#             # Log the current state for debugging
#             logger.info(f"[Celery Task] Current time: {now} (timezone: {now.tzinfo}), "
#                         f"Countdown time: {countdowntime} (timezone: {countdowntime.tzinfo}), "
#                         f"Server mode: {server.servermode}")

#             # Check if the countdown time has passed and server mode is False
#             if countdowntime <= now and not server.servermode:
#                 server.servermode = True
#                 server.save()
#                 logger.info("[Celery Task] Countdown reached. Server mode set to True.")
#             else:
#                 logger.info("[Celery Task] No change needed. Either countdown time has not passed or server mode is already True.")
#         else:
#             logger.info("[Celery Task] Countdown time is not set.")

#     except Server.DoesNotExist:
#         logger.error("[Celery Task] Server instance not found.")
