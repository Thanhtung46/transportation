from .base import *
import config
DEBUG = False
ALLOWED_HOSTS = ['127.0.0.1', 'localhost', 'ten_mien_that_cua_ban.com']
# Production specific settings
DATABASES['default']['HOST'] = config('DB_HOST')

# Security settings for production
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True