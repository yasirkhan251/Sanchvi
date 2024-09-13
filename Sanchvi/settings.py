from pathlib import Path
import paypalrestsdk
import os


# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-f$er8+uju1e2xm@p7u38^j@r##1(ftkao6#a75+71nr#9awin8'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['192.168.1.54','192.168.1.70','sanchvi.com', 'www.sanchvi.com', 'sanchvistudio.com', 'www.sanchvistudio.com','82.112.226.224','192.168.29.7','192.168.29.189','49.37.182.144','127.0.0.1','192.168.29.31']


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]

EXT = [
    'Accounts',
    'Products',
    'Payments',
    'Cart'

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

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


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
# LOGIN_URL = '/auth/login' # keep it for now


# Default primary key field type
# https://docs.djangoproject.com/en/5.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
AUTH_USER_MODEL = 'Accounts.MyUser' 



# PayPal settings
PAYPAL_CLIENT_ID = 'AWHRoWBdw5fddjAw7g1ETCetpQD0tnPWNZXpzjVIGhOHDUzYE1KCbbMpYjqrSMROLFHNKiGt0abQOQzR'
PAYPAL_CLIENT_SECRET = 'EBbpwbqpUg2GGVRnbdrpSvHgkprw7uoRL6gKt7UgrBb6VaOVTVDYSV4WQCDTTu6u2qouh_PvIc53ncNB'
PAYPAL_MODE = 'sandbox'  # Change to 'live' for production

# PayPal SDK Configuration

paypalrestsdk.configure({
  "mode": PAYPAL_MODE,  # "sandbox" or "live"
  "client_id": PAYPAL_CLIENT_ID,
  "client_secret": PAYPAL_CLIENT_SECRET
})
