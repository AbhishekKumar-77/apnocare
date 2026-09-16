from django.urls import path
from .views import HealthRecordListCreateView, HealthTimelineView, HealthRecordDetailView

urlpatterns = [
    path('', HealthRecordListCreateView.as_view(), name='health-records-list-create'),
    path('timeline/', HealthTimelineView.as_view(), name='health-timeline'),
    path('<str:pk>/', HealthRecordDetailView.as_view(), name='health-record-detail'),
]
