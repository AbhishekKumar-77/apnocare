from django.urls import path
from .views import RegisterView, LoginView, CurrentUserView, ApplyRepresentativeView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='auth-register'),
    path('login/', LoginView.as_view(), name='auth-login'),
    path('me/', CurrentUserView.as_view(), name='auth-me'),
    path('representative/apply/', ApplyRepresentativeView.as_view(), name='auth-rep-apply'),
]
