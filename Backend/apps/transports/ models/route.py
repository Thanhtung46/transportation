# class Station(models.Model):
#     name = models.CharField(max_length=100)
#     city = models.CharField(max_length=100)
#     address = models.TextField(blank=True)
    
#     def __str__(self):
#         return f"{self.name}, {self.city}"

# class Route(models.Model):
#     origin = models.ForeignKey(Station, on_delete=models.CASCADE, related_name='origin_routes')
#     destination = models.ForeignKey(Station, on_delete=models.CASCADE, related_name='destination_routes')
#     distance_km = models.DecimalField(max_digits=8, decimal_places=2)
#     estimated_duration = models.DurationField()  # HH:MM:SS format
#     base_price = models.DecimalField(max_digits=10, decimal_places=2)
    
#     def __str__(self):
#         return f"{self.origin.name} → {self.destination.name}"