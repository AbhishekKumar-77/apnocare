from django.urls import path
from .views import AppointmentListCreateView, AppointmentDetailView

urlpatterns = [
    path('', AppointmentListCreateView.as_view(), name='appointment-list-create'),
    path('<str:pk>/', AppointmentDetailView.as_view(), name='appointment-detail'),
]
