from django.urls import path
from .views import (
    AdminOverviewStatsView,
    AdminRepresentativesManageView,
    AdminCareRequestsManageView
)

urlpatterns = [
    path('overview/', AdminOverviewStatsView.as_view(), name='admin-overview'),
    path('representatives/', AdminRepresentativesManageView.as_view(), name='admin-reps-list'),
    path('representatives/<str:pk>/', AdminRepresentativesManageView.as_view(), name='admin-rep-verify'),
    path('care-requests/', AdminCareRequestsManageView.as_view(), name='admin-care-requests'),
    path('care-requests/<str:pk>/', AdminCareRequestsManageView.as_view(), name='admin-care-request-manage'),
]
