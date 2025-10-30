from django.db import models

class Route(models.Model):
    name = models.CharField(max_length=200)
    origin = models.CharField(max_length=255)
    destination = models.CharField(max_length=255)
    waypoints = models.JSONField(blank=True, null=True, help_text='List of waypoints (optional)')
    estimated_distance_km = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True)
    estimated_time_minutes = models.PositiveIntegerField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'transports_route'

    def __str__(self):
        return self.name
