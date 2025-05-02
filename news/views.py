import os
import requests
from pathlib import Path
from dotenv import load_dotenv
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
import requests
from .models import NewsArticle
from django.http import JsonResponse
from .models import NewsArticle

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / '.env')

class NewsListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        api_key = os.getenv('NEWS_API_KEY')
        if not api_key:
            return Response(
                {"error": "NEWS_API_KEY not found in environment."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        url = 'https://newsapi.org/v2/top-headlines'
        headers = {'X-Api-Key': api_key}
        params = {
            'country': 'us',
            'category': 'business',
            'pageSize': 10,
        }

        try:
            res = requests.get(url, headers=headers, params=params, timeout=5)
            data = res.json()

            if data.get('status') != 'ok':
                return Response(
                    {'error': data.get('message', 'Unknown error from NewsAPI')},
                    status=status.HTTP_502_BAD_GATEWAY
                )

            articles = [
                {
                    'title':       art.get('title'),
                    'description': art.get('description'),
                    'url':         art.get('url'),
                    'image':       art.get('urlToImage'),
                    'source':      art.get('source', {}).get('name'),
                    'publishedAt': art.get('publishedAt'),
                }
                for art in data.get('articles', [])
            ]
            return Response({'articles': articles})

        except requests.RequestException as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_502_BAD_GATEWAY
            )

def fetch_and_store_news():
    api_key = os.getenv('NEWS_API_KEY')
    res = requests.get(f'https://newsapi.org/v2/top-headlines?country=us&apiKey={api_key}')
    if res.status_code == 200:
        articles = res.json().get('articles', [])[:9]
        valid_articles = [a for a in articles if a.get("urlToImage")]

        NewsArticle.objects.all().delete()

        for article in valid_articles[:9]:
            NewsArticle.objects.create(
                title=article["title"],
                description=article.get("description"),
                url=article["url"],
                image=article["urlToImage"],
                source=article.get("source", "Unknown"),
                published_at=article["publishedAt"]
            )

def fallback_news(request):
    articles = list(NewsArticle.objects.all().values())
    return JsonResponse({"articles": articles})