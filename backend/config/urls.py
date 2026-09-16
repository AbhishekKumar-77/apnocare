from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/family/', include('family.urls')),
    path('api/healthcare/', include('healthcare.urls')),
    path('api/appointments/', include('appointments.urls')),
    path('api/care/', include('care_requests.urls')),
    path('api/medicines/', include('medicines.urls')),
    path('api/diagnostics/', include('diagnostics.urls')),
    path('api/health-records/', include('health_records.urls')),
    path('api/notifications/', include('notifications.urls')),
    path('api/payments/', include('payments.urls')),
    path('api/ai/', include('ai_assistant.urls')),
    path('api/admin-portal/', include('admin_portal.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
