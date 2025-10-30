from django.db import models
from django.utils import timezone
from datetime import timedelta
import random
import string

def generate_otp():
    return ''.join(random.choices(string.digits, k=6))

class PasswordResetOTP(models.Model):
    email = models.EmailField()
    otp_code = models.CharField(max_length=6, default=generate_otp)
    is_used = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    
    def is_expired(self):
        return timezone.now() > self.expires_at
    
    def is_valid(self):
        return not self.is_expired() and not self.is_used
    
    def mark_used(self):
        self.is_used = True
        self.save()
    
    def save(self, *args, **kwargs):
        if not self.expires_at:
            self.expires_at = timezone.now() + timedelta(minutes=15)  # OTP expires in 15 mins
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"OTP for {self.email} - {self.otp_code}"