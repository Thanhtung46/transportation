# from rest_framework import serializers
# from ..models import Trip

# class TripSerializer(serializers.ModelSerializer):
#     origin = serializers.CharField(source='route.origin.name')
#     destination = serializers.CharField(source='route.destination.name')
#     origin_city = serializers.CharField(source='route.origin.city')
#     destination_city = serializers.CharField(source='route.destination.city')
#     vehicle_type = serializers.CharField(source='vehicle.vehicle_type.name')
#     vehicle_name = serializers.CharField(source='vehicle.name')
    
#     class Meta:
#         model = Trip
#         fields = [
#             'id', 'origin', 'destination', 'origin_city', 'destination_city',
#             'departure_time', 'arrival_time', 'price', 'available_seats',
#             'vehicle_type', 'vehicle_name'
#         ]