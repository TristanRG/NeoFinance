from django.urls import path
from . import views

urlpatterns = [
    path('', views.chat, name='chat'),
    path('csv/',  views.chat_with_csv, name='chat_with_csv'),
]
