from rest_framework import serializers
from ..models.event import TransportEvent

class TransportEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransportEvent
        fields = '__all__'
        read_only_fields = ('timestamp',)
