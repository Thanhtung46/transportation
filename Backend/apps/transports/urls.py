from django.urls import path
from django.http import JsonResponse

def transports_home(request):
    return JsonResponse({
        "message": "Transports API - Endpoints coming soon",
        "planned_endpoints": [
            "/api/transports/trips/search/",
            "/api/transports/routes/",
            "/api/transports/vehicles/"
        ]
    })

urlpatterns = [
    path('', transports_home, name='transports-home'),
]