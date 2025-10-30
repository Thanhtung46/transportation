from django.contrib import admin
from .models import driver, vehicle, route, order, schedule, event

admin.site.register(driver.Driver)
admin.site.register(vehicle.Vehicle)
admin.site.register(route.Route)
admin.site.register(order.TransportOrder)
admin.site.register(schedule.Schedule)
admin.site.register(event.TransportEvent)
