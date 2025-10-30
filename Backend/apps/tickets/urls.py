from django.urls import path, include
from django.http import JsonResponse
from rest_framework.routers import DefaultRouter

from apps.tickets.views.ticket_viewset import TicketViewSet


def tickets_home(request):
    return JsonResponse({
        "message": "Tickets API",
        "available_endpoints": [
            "/api/tickets/",                # list/create
            "/api/tickets/{id}/",           # retrieve/update/delete
            "/api/tickets/{id}/update_status/",  # custom action
        ]
    })

router = DefaultRouter()
router.register(r'tickets', TicketViewSet, basename='ticket')

urlpatterns = [
    path('', tickets_home, name='tickets-home'),
    path('', include(router.urls)),   # thêm router cho API CRUD
]
