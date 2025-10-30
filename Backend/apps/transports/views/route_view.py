from rest_framework import viewsets, filters
from ..models.route import Route
from ..serializers.route_serializer import RouteSerializer

class RouteViewSet(viewsets.ModelViewSet):
    queryset = Route.objects.all()
    serializer_class = RouteSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name','origin','destination']
