from django.urls import path
from .views import PaymentCheckoutView, PaymentHistoryView

urlpatterns = [
    path('checkout/', PaymentCheckoutView.as_view(), name='payment-checkout'),
    path('history/', PaymentHistoryView.as_view(), name='payment-history'),
]
