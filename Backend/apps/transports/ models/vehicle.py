# from django.db import models

# class VehicleType(models.Model):
#     name = models.CharField(max_length=50)  # Bus, Train, Flight
#     icon = models.CharField(max_length=100, default='🚌')
    
#     def __str__(self):
#         return self.name

# class Vehicle(models.Model):
#     name = models.CharField(max_length=100)
#     vehicle_type = models.ForeignKey(VehicleType, on_delete=models.CASCADE)
#     license_plate = models.CharField(max_length=20)
#     capacity = models.IntegerField()
#     amenities = models.JSONField(default=list)  # ['wifi', 'ac', 'water']
    
#     def __str__(self):
#         return f"{self.name} ({self.license_plate})"