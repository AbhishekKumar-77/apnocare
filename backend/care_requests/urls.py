from django.urls import path
from .views import (
    CareRequestListCreateView,
    CareRequestDetailView,
    CareRequestStatusUpdateView,
    CareRequestUploadDocView,
    CareRepresentativeAssignedListView,
    CareRepresentativeResponseView
)

urlpatterns = [
    path('requests/', CareRequestListCreateView.as_view(), name='care-requests-list-create'),
    path('requests/<str:pk>/', CareRequestDetailView.as_view(), name='care-request-detail'),
    path('requests/<str:pk>/update-status/', CareRequestStatusUpdateView.as_view(), name='care-request-status-update'),
    path('requests/<str:pk>/upload-document/', CareRequestUploadDocView.as_view(), name='care-request-upload-doc'),
    path('representative/assigned/', CareRepresentativeAssignedListView.as_view(), name='care-rep-assigned'),
    path('requests/<str:pk>/respond/', CareRepresentativeResponseView.as_view(), name='care-rep-respond'),
]
