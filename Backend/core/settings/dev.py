from .base import *
DEBUG = True
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'testserver',
        'USER': 'devuser',
        'PASSWORD': '123',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
# CORS configuration cho React Native
CORS_ALLOWED_ORIGINS = [
    "http://localhost:8000",
    "http://0.0.0.0",
]
CORS_ALLOW_ALL_ORIGINS = False
# REST Framework configuration
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ]
}