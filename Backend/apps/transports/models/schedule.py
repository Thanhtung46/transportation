from django.db import models

class Schedule(models.Model):
    order = models.ForeignKey('transports.TransportOrder', on_delete=models.CASCADE, related_name='schedules')
    driver = models.ForeignKey('transports.Driver', on_delete=models.CASCADE, related_name='schedules')
    vehicle = models.ForeignKey('transports.Vehicle', on_delete=models.CASCADE, related_name='schedules')
    start_time = models.DateTimeField()
    end_time = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'transports_schedule'
        ordering = ['start_time']

    def __str__(self):
        return f"Schedule for {self.order.order_number} - {self.driver}"
