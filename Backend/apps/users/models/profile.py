from django.db import models
from .user import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    
    # Travel Preferences
    preferred_vehicle_types = models.JSONField(default=list)  # ['bus', 'train', 'flight']
    preferred_seat_class = models.CharField(max_length=50, default='standard')
    preferred_payment_method = models.CharField(max_length=50, default='momo')
    
    # Loyalty & Points
    loyalty_points = models.IntegerField(default=0)
    membership_level = models.CharField(max_length=20, default='standard')
    
    # Statistics
    total_trips = models.IntegerField(default=0)
    total_spent = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    favorite_routes = models.JSONField(default=list)
    
    # Settings
    receive_promotions = models.BooleanField(default=True)
    sms_notifications = models.BooleanField(default=True)
    email_notifications = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    # created_at = models.models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Profile of {self.user.email}"