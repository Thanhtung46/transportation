from rest_framework import viewsets, filters
from ..models.vehicle import Vehicle
from ..serializers.vehicle_serializer import VehicleSerializer

class VehicleViewSet(viewsets.ModelViewSet):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['plate_number','make','model']
