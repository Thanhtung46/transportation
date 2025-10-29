from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, UserProfile, EmailVerification, PhoneVerification

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('email', 'username', 'first_name', 'last_name', 'is_verified', 'is_staff')
    list_filter = ('is_verified', 'is_staff', 'is_superuser', 'gender')
    search_fields = ('email', 'username', 'first_name', 'last_name', 'phone_number')
    ordering = ('-created_at',)
    
    fieldsets = UserAdmin.fieldsets + (
        ('Personal Info', {
            'fields': ('phone_number', 'date_of_birth', 'gender', 'avatar', 'id_number')
        }),
        ('Address', {
            'fields': ('address', 'city', 'country')
        }),
        ('Preferences', {
            'fields': ('language', 'currency', 'notification_enabled')
        }),
        ('Verification', {
            'fields': ('is_verified', 'email_verified', 'phone_verified', 'is_premium')
        }),
    )

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'membership_level', 'loyalty_points', 'total_trips')
    list_filter = ('membership_level', 'receive_promotions')
    search_fields = ('user__email', 'user__username')

@admin.register(EmailVerification)
class EmailVerificationAdmin(admin.ModelAdmin):
    list_display = ('user', 'email', 'code', 'is_verified', 'created_at', 'expires_at')
    list_filter = ('is_verified', 'created_at')
    search_fields = ('user__email', 'email', 'code')

@admin.register(PhoneVerification)
class PhoneVerificationAdmin(admin.ModelAdmin):
    list_display = ('user', 'phone_number', 'code', 'is_verified', 'created_at', 'expires_at')
    list_filter = ('is_verified', 'created_at')
    search_fields = ('user__phone_number', 'phone_number', 'code')