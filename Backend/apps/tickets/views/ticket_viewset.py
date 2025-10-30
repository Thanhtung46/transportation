from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter



from apps.tickets.models.ticket import Ticket
from apps.tickets.serializers.ticket_serializer import TicketSerializer

class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all().select_related("creator", "assignee")
    serializer_class = TicketSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ["status", "priority", "assignee", "creator"]
    search_fields = ["title", "description"]
    ordering_fields = ["created_at", "priority", "updated_at"]
    ordering = ["-created_at"]

    def perform_create(self, serializer):
        request = self.request
        if request.user and request.user.is_authenticated:
            serializer.save(creator=request.user)
        else:
            serializer.save()

    @action(detail=True, methods=["patch"], url_path="update_status")
    def update_status(self, request, pk=None):
        ticket = self.get_object()
        new_status = request.data.get("status")
        if new_status not in dict(Ticket.Status.choices):
            return Response({"detail": "Invalid status."}, status=status.HTTP_400_BAD_REQUEST)
        ticket.status = new_status
        ticket.save()
        serializer = self.get_serializer(ticket)
        return Response(serializer.data)
