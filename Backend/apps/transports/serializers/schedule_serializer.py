from rest_framework import serializers
from ..models.schedule import Schedule
from ..models.order import TransportOrder
from ..models.driver import Driver
from ..models.vehicle import Vehicle
from .order_serializer import TransportOrderSerializer
from .driver_serializer import DriverSerializer
from .vehicle_serializer import VehicleSerializer


class ScheduleSerializer(serializers.ModelSerializer):
    order = TransportOrderSerializer(read_only=True)
    order_id = serializers.PrimaryKeyRelatedField(
        source='order',
        queryset=TransportOrder.objects.all(),
        write_only=True,
        required=False,
        allow_null=True
    )

    assigned_driver = DriverSerializer(read_only=True)
    assigned_driver_id = serializers.PrimaryKeyRelatedField(
        source='assigned_driver',
        queryset=Driver.objects.all(),
        write_only=True,
        required=False,
        allow_null=True
    )

    assigned_vehicle = VehicleSerializer(read_only=True)
    assigned_vehicle_id = serializers.PrimaryKeyRelatedField(
        source='assigned_vehicle',
        queryset=Vehicle.objects.all(),
        write_only=True,
        required=False,
        allow_null=True
    )

    class Meta:
        model = Schedule
        fields = [
            'id', 'order', 'order_id',
            'scheduled_date', 'assigned_driver', 'assigned_driver_id',
            'assigned_vehicle', 'assigned_vehicle_id',
            'status', 'notes', 'created_at', 'updated_at'
        ]
        read_only_fields = ('created_at', 'updated_at')

    def __init__(self, *args, **kwargs):
        """Thiết lập queryset động để tránh lỗi import chéo."""
        super().__init__(*args, **kwargs)
        from ..models.order import TransportOrder
        from ..models.driver import Driver
        from ..models.vehicle import Vehicle

        self.fields['order_id'].queryset = TransportOrder.objects.all()
        self.fields['assigned_driver_id'].queryset = Driver.objects.all()
        self.fields['assigned_vehicle_id'].queryset = Vehicle.objects.all()
