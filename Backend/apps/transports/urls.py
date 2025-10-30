from django.urls import path, include
from rest_framework import routers
from .views import driver_view, vehicle_view, route_view, order_view, schedule_view, event_view

router = routers.DefaultRouter()
router.register(r'drivers', driver_view.DriverViewSet)
router.register(r'vehicles', vehicle_view.VehicleViewSet)
router.register(r'routes', route_view.RouteViewSet)
router.register(r'orders', order_view.TransportOrderViewSet)
router.register(r'schedules', schedule_view.ScheduleViewSet)
router.register(r'events', event_view.TransportEventViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
