from django.urls import path
from .views import AskApnoCareView

urlpatterns = [
    path('chat/', AskApnoCareView.as_view(), name='ai-chat'),
]
