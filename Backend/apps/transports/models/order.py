from django.db import models
from django.conf import settings

# Link to users via AUTH_USER_MODEL and to tickets app via 'tickets.Ticket'
class TransportOrder(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('scheduled', 'Scheduled'),
        ('in_transit', 'In Transit'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    ]
    order_number = models.CharField(max_length=100, unique=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, blank=True, null=True, related_name='transport_orders')
    ticket = models.ForeignKey('tickets.Ticket', on_delete=models.SET_NULL, blank=True, null=True, related_name='transport_orders')
    customer_name = models.CharField(max_length=200, blank=True, null=True)
    pickup_address = models.CharField(max_length=500)
    delivery_address = models.CharField(max_length=500)
    scheduled_pickup = models.DateTimeField(blank=True, null=True)
    scheduled_delivery = models.DateTimeField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    assigned_driver = models.ForeignKey('transports.Driver', on_delete=models.SET_NULL, blank=True, null=True, related_name='orders')
    assigned_vehicle = models.ForeignKey('transports.Vehicle', on_delete=models.SET_NULL, blank=True, null=True, related_name='orders')
    route = models.ForeignKey('transports.Route', on_delete=models.SET_NULL, blank=True, null=True, related_name='orders')
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'transports_order'

    def __str__(self):
        return f"{self.order_number} ({self.status})"
