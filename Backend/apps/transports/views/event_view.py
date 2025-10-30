from rest_framework import viewsets
from ..models.event import TransportEvent
from ..serializers.event_serializer import TransportEventSerializer

class TransportEventViewSet(viewsets.ModelViewSet):
    queryset = TransportEvent.objects.all().select_related('order')
    serializer_class = TransportEventSerializer
