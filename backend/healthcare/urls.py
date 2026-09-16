from django.urls import path
from .views import DoctorListView, DoctorDetailView, HospitalListView, HospitalDetailView, HealthcareCategoriesView

urlpatterns = [
    path('doctors/', DoctorListView.as_view(), name='doctors-list'),
    path('doctors/<str:pk>/', DoctorDetailView.as_view(), name='doctor-detail'),
    path('hospitals/', HospitalListView.as_view(), name='hospitals-list'),
    path('hospitals/<str:pk>/', HospitalDetailView.as_view(), name='hospital-detail'),
    path('categories/', HealthcareCategoriesView.as_view(), name='healthcare-categories'),
]
