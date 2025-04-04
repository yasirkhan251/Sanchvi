from pathlib import Path
import os



# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-f$er8+uju1e2xm@p7u38^j@r##1(ftkao6#a75+71nr#9awin8'

# SECURITY WARNING: don't run with debug turned on in production!
# DEBUG = True  
DEBUG = False

ALLOWED_HOSTS = ['192.168.1.38','192.168.1.46','192.168.1.54','192.168.1.70','sanchvi.com', 'www.sanchvi.com', 'sanchvistudio.com', 'www.sanchvistudio.com','82.112.226.224','192.168.29.7','192.168.29.189','49.37.182.144','127.0.0.1','192.168.29.31']


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites',
]
SITE_ID = 1

EXT = [
    'Accounts',
    'Products',
    'Payments',
    'Cart',
    'paypal.standard.ipn',
    'Admin',
    'Message',
    'Salary_Calculator',
    

]

INSTALLED_APPS += EXT





MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    
]

MIDWare  = [
            'Admin.server_mode_middleware.ServerModeMiddleware',
            'Accounts.middleware.LogUserVisitMiddleware', 
            ]

MIDDLEWARE += MIDWare


ROOT_URLCONF = 'Sanchvi.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')],  # adding this line for templates outside the application
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'Sanchvi.wsgi.application'


# Database
# https://docs.djangoproject.com/en/5.0/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.mysql',
#         'NAME': 'sanchvi',   # Ensure this matches exactly with the database name in MySQL
#         'USER': 'root',      # The default user for XAMPP is 'root'
#         'PASSWORD': '',      # The default password for root is empty in XAMPP
#         'HOST': '127.0.0.1', # Use '127.0.0.1' or 'localhost'
#         'PORT': '3307',      # Default MySQL port
#     }
# } 



# Password validation
# https://docs.djangoproject.com/en/5.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.0/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'Asia/Kolkata'
USE_TZ = True


USE_I18N = True




#  email

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'sanchvi.sanjana19@gmail.com'
EMAIL_HOST_PASSWORD = 'wdaeskemmdmwhkya'








CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        'LOCATION': 'unique-cache',
    }
}



# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.0/howto/static-files/

STATIC_URL = 'static/'
# for giving direct access to static files
# STATIC_ROOT = os.path.join(BASE_DIR, '/static')
# STATICFILES_DIRS=[ BASE_DIR/'static/'] 
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# STATICFILES_DIRS: This is where you can specify additional directories for static files.
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'static'),
]

# media file 
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')




#authentication for user, admin 
# AUTH_USER_MODEL = 'Accounts.MyUser' 
# if user is not logged in for purchasing can directly come to this login link by default
LOGIN_URL = '/auth/login' # keep it for now


# Default primary key field type
# https://docs.djangoproject.com/en/5.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
AUTH_USER_MODEL = 'Accounts.MyUser' 



# PayPal settings
# PAYPAL_CLIENT_ID = 'AWHRoWBdw5fddjAw7g1ETCetpQD0tnPWNZXpzjVIGhOHDUzYE1KCbbMpYjqrSMROLFHNKiGt0abQOQzR'
# PAYPAL_CLIENT_SECRET = 'EBbpwbqpUg2GGVRnbdrpSvHgkprw7uoRL6gKt7UgrBb6VaOVTVDYSV4WQCDTTu6u2qouh_PvIc53ncNB'
# PAYPAL_MODE = 'sandbox'  # Change to 'live' for production





# paypal new intrigation 




# PAYPAL_TEST = False
# PAYPAL_RECEIVER_EMAIL= 'sanchvi.sanjana19@gmail.com' # this is live account

PAYPAL_TEST = True
# PAYPAL_RECEIVER_EMAIL= 'sb-ra2tb14723963@business.example.com' # this is sandbox account
PAYPAL_RECEIVER_EMAIL= 'yuvraj.yasir@gmail.com' # this is sandbox account








# PhonePe Integration Settings for Production
PHONEPE_MERCHANT_ID = "M1IAOFE2DA7E"  # Your merchant ID from PhonePe
PHONEPE_SALT_KEY = "3198c311-52bf-4697-8d98-b1c1489a804a"  # Your PhonePe salt key (get this from the dashboard)
PHONEPE_SALT_INDEX = "1"  # Salt index (typically '1' but should match the one on your PhonePe dashboard)
PHONEPE_PAYMENT_URL = "https://api.phonepe.com/apis/hermes/pg/v1/pay"  # PhonePe API endpoint for initiating payments
PHONEPE_CALLBACK_URL = "https://sanchvistudio.com/payments/phonepe/callback"


# PhonePe Integration Settings for Sandbox Test

# PHONEPE_MERCHANT_ID = "SANCHVIUAT"  # Your merchant ID from PhonePe
# PHONEPE_SALT_KEY = "0325c758-3de7-4426-a758-4cf82f46f0bf"  # Your PhonePe salt key (get this from the dashboard)
# PHONEPE_PAYMENT_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay"  # PhonePe API endpoint for initiating payments

# PHONEPE_PAYMENT_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox"  # PhonePe API endpoint for initiating payments











# from celery.schedules import crontab

# CELERY_BEAT_SCHEDULE = {
#     'update-server-mode-every-minute': {
#         'task': 'Admin.tasks.check_and_update_server_mode',  # Task from Admin app
#         'schedule': crontab(minute='*'),  # Run every minute
#     },
# }


# # Celery Configuration
# CELERY_BROKER_URL = 'redis://localhost:6379/0'
# CELERY_RESULT_BACKEND = 'redis://localhost:6379/0'
# CELERY_ACCEPT_CONTENT = ['json']
# CELERY_TASK_SERIALIZER = 'json'
# CELERY_RESULT_SERIALIZER = 'json'
# CELERY_TIMEZONE = 'Asia/Kolkata'

