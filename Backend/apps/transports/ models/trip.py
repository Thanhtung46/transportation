# class Trip(models.Model):
#     route = models.ForeignKey(Route, on_delete=models.CASCADE)
#     vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE)
#     departure_time = models.DateTimeField()
#     arrival_time = models.DateTimeField()
#     available_seats = models.IntegerField()
#     price = models.DecimalField(max_digits=10, decimal_places=2)
    
#     def __str__(self):
#         return f"{self.route} - {self.departure_time.strftime('%d/%m/%Y %H:%M')}"