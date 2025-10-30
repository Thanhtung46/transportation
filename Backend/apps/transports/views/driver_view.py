from rest_framework import viewsets, filters
from ..models.driver import Driver
from ..serializers.driver_serializer import DriverSerializer

class DriverViewSet(viewsets.ModelViewSet):
    queryset = Driver.objects.all()
    serializer_class = DriverSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['first_name','last_name','license_number','phone']
