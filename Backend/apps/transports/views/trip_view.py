# from rest_framework.views import APIView
# from rest_framework.response import Response
# from django.db.models import Q
# from ..models import Trip
# from ..serializers import TripSerializer

# class TripSearchView(APIView):
#     def get(self, request):
#         origin = request.GET.get('origin', '')
#         destination = request.GET.get('destination', '')
#         date = request.GET.get('date', '')
        
#         # Build query
#         query = Q()
        
#         if origin:
#             query &= Q(route__origin__city__icontains=origin) | Q(route__origin__name__icontains=origin)
#         if destination:
#             query &= Q(route__destination__city__icontains=destination) | Q(route__destination__name__icontains=destination)
#         if date:
#             query &= Q(departure_time__date=date)
        
#         trips = Trip.objects.filter(query).select_related('route', 'vehicle')
#         serializer = TripSerializer(trips, many=True)
        
#         return Response({
#             "count": trips.count(),
#             "results": serializer.data
#         })