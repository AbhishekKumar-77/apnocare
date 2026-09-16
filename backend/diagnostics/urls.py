from django.urls import path
from .views import DiagnosticCatalogView, DiagnosticBookingListCreateView

urlpatterns = [
    path('catalog/', DiagnosticCatalogView.as_view(), name='diagnostic-catalog'),
    path('bookings/', DiagnosticBookingListCreateView.as_view(), name='diagnostic-bookings-list-create'),
]
