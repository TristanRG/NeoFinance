import os
import requests
from pathlib import Path
from dotenv import load_dotenv
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny


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