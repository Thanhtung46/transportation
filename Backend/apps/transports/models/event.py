from django.db import models
from django.utils import timezone

class TransportEvent(models.Model):
    order = models.ForeignKey('transports.TransportOrder', on_delete=models.CASCADE, related_name='events')
    timestamp = models.DateTimeField(default=timezone.now)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    status = models.CharField(max_length=200, blank=True, null=True)
    note = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'transports_event'
        ordering = ['-timestamp']

    def __str__(self):
        return f"Event for {self.order.order_number} at {self.timestamp}"
