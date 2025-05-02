from django.urls import path
from django.http import JsonResponse
from .views import NewsListView, fallback_news

urlpatterns = [
    path('', NewsListView.as_view(), name='news-list'),
    path('fallback/', fallback_news, name='news-fallback'),
]
