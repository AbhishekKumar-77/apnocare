from django.urls import path
from .views import FamilyListCreateView, FamilyDetailView

urlpatterns = [
    path('', FamilyListCreateView.as_view(), name='family-list-create'),
    path('<str:pk>/', FamilyDetailView.as_view(), name='family-detail'),
]
