from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views.auth_view import *
from .views.profile_view import *

urlpatterns = [
    # Authentication
    path('register/', register, name='register'),
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Profile
    path('profile/', profile, name='profile'),
    path('profile/change-password/', change_password, name='change-password'),
    path('profile/upload-avatar/', upload_avatar, name='upload-avatar'),
    
    # Verification
    path('verify/email/send/', send_email_verification, name='send-email-verification'),
    path('verify/email/', verify_email, name='verify-email'),
] 