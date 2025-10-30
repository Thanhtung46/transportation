from django.db import models

class Vehicle(models.Model):
    STATUS_CHOICES = [
        ('available', 'Available'),
        ('busy', 'Busy'),
        ('maintenance', 'Maintenance'),
        ('retired', 'Retired'),
    ]
    plate_number = models.CharField(max_length=20, unique=True)
    make = models.CharField(max_length=100, blank=True)
    model = models.CharField(max_length=100, blank=True)
    year = models.PositiveIntegerField(blank=True, null=True)
    capacity = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True, help_text='Capacity in cubic meters or kg')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='available')
    current_lat = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    current_lng = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'transports_vehicle'

    def __str__(self):
        return f"{self.plate_number} - {self.make} {self.model}"
