from django.urls import path
from django.http import JsonResponse

def tickets_home(request):
    return JsonResponse({
        "message": "Tickets API - Endpoints coming soon", 
        "planned_endpoints": [
            "/api/tickets/bookings/",
            "/api/tickets/payments/"
        ]
    })

urlpatterns = [
    path('', tickets_home, name='tickets-home'),
]