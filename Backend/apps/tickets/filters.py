import django_filters
from tickets.models.ticket import Ticket

class TicketFilter(django_filters.FilterSet):
    created_after = django_filters.IsoDateTimeFilter(field_name="created_at", lookup_expr="gte")
    created_before = django_filters.IsoDateTimeFilter(field_name="created_at", lookup_expr="lte")

    class Meta:
        model = Ticket
        fields = ["status", "priority", "assignee", "creator", "created_after", "created_before"]
