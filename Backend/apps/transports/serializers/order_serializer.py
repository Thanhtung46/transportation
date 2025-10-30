from rest_framework import serializers
from django.contrib.auth import get_user_model
from ..models.order import TransportOrder
from ..models.driver import Driver
from ..models.vehicle import Vehicle
from ..models.route import Route

from .driver_serializer import DriverSerializer
from .vehicle_serializer import VehicleSerializer
from .route_serializer import RouteSerializer


class TransportOrderSerializer(serializers.ModelSerializer):
    assigned_driver = DriverSerializer(read_only=True)
    assigned_driver_id = serializers.PrimaryKeyRelatedField(
        source='assigned_driver',
        queryset=Driver.objects.all(),
        write_only=True, required=False, allow_null=True
    )

    assigned_vehicle = VehicleSerializer(read_only=True)
    assigned_vehicle_id = serializers.PrimaryKeyRelatedField(
        source='assigned_vehicle',
        queryset=Vehicle.objects.all(),
        write_only=True, required=False, allow_null=True
    )

    route = RouteSerializer(read_only=True)
    route_id = serializers.PrimaryKeyRelatedField(
        source='route',
        queryset=Route.objects.all(),
        write_only=True, required=False, allow_null=True
    )

    created_by = serializers.PrimaryKeyRelatedField(
        queryset=get_user_model().objects.all(),
        required=False, allow_null=True
    )

    class Meta:
        model = TransportOrder
        fields = [
            'id', 'order_number', 'created_by', 'ticket', 'customer_name',
            'pickup_address', 'delivery_address', 'scheduled_pickup', 'scheduled_delivery',
            'status', 'assigned_driver', 'assigned_driver_id',
            'assigned_vehicle', 'assigned_vehicle_id', 'route', 'route_id',
            'notes', 'created_at', 'updated_at'
        ]
        read_only_fields = ('created_at', 'updated_at')

    def __init__(self, *args, **kwargs):
        """Gán queryset cho các field liên kết để tránh lỗi import chéo"""
        super().__init__(*args, **kwargs)
        from ..models.driver import Driver
        from ..models.vehicle import Vehicle
        from ..models.route import Route
        self.fields['assigned_driver_id'].queryset = Driver.objects.all()
        self.fields['assigned_vehicle_id'].queryset = Vehicle.objects.all()
        self.fields['route_id'].queryset = Route.objects.all()
        self.fields['created_by'].queryset = get_user_model().objects.all()
