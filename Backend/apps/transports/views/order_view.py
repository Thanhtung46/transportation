from rest_framework import viewsets, filters
from ..models.order import TransportOrder
from ..serializers.order_serializer import TransportOrderSerializer

class TransportOrderViewSet(viewsets.ModelViewSet):
    queryset = TransportOrder.objects.all().select_related('assigned_driver','assigned_vehicle','route','created_by')
    serializer_class = TransportOrderSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['order_number','customer_name','pickup_address','delivery_address']
