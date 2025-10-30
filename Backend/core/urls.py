from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from django.views.decorators.csrf import csrf_exempt
def csrf_exempt_view(view_func):
    return csrf_exempt(view_func)
# 👇 Tạo view cho trang chủ
def home_view(request):
    return JsonResponse({
        "message": "Welcome to Smart Travel Backend API",
        "version": "1.0.0",
        "endpoints": {
            "admin": "/admin/",
            "api_docs": "/swagger/",
            "user_auth": "/api/auth/",
            "transports": "/api/transports/",
            "tickets": "/api/tickets/"
        }
    })

# 👇 Tạo view cho API root
def api_root(request):
    return JsonResponse({
        "message": "Smart Travel API Root",
        "endpoints": {
            "auth": {
                "register": "/api/auth/register/",
                "login": "/api/auth/login/",
                "profile": "/api/auth/profile/"
            },
            "documentation": "/swagger/"
        }
    })

schema_view = get_schema_view(
    openapi.Info(
        title="Smart Travel API",
        default_version='v1',
        description="API for Smart Travel Transportation System",
        contact=openapi.Contact(email="support@smarttravel.com"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    # 👇 THÊM 2 DÒNG NÀY - Route cho trang chủ và API root
    path('', home_view, name='home'),
    path('api/', api_root, name='api-root'),
    
    path('admin/', admin.site.urls),
    path('api/auth/', include('apps.users.urls')),
    path('api/transports/', include('apps.transports.urls')),
    path('api/tickets/', include('apps.tickets.urls')),
    

    # Documentation
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]
def apply_csrf_exempt(pattern_list):
    for i, pattern in enumerate(pattern_list):
        if hasattr(pattern, 'callback'):
            pattern.callback = csrf_exempt(pattern.callback)
        elif hasattr(pattern, 'url_patterns'):
            apply_csrf_exempt(pattern.url_patterns)
    return pattern_list

urlpatterns = apply_csrf_exempt(urlpatterns)
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)