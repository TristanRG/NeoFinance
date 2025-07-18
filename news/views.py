import os
import requests
import asyncio
from pathlib import Path
from dotenv import load_dotenv
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.http import JsonResponse
from googletrans import Translator
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
                    'title':       art.get('title') or '',
                    'description': art.get('description') or '',
                    'url':         art.get('url'),
                    'image':       art.get('urlToImage'),
                    'source':      art.get('source', {}).get('name'),
                    'publishedAt': art.get('publishedAt'),
                }
                for art in data.get('articles', [])
            ]

            if articles:
                async def bulk_translate(titles, descs):
                    async with Translator(service_urls=['translate.googleapis.com']) as tr:
                        translated_titles = await tr.translate(titles, dest='ro')
                        translated_descs  = await tr.translate(descs,  dest='ro')
                        return translated_titles, translated_descs

                titles = [a['title'] for a in articles]
                descs  = [a['description'] for a in articles]

                try:
                    tr_titles, tr_descs = asyncio.run(bulk_translate(titles, descs))
                    for idx, art in enumerate(articles):
                        art['title']       = getattr(tr_titles[idx], 'text', art['title'])
                        art['description'] = getattr(tr_descs[idx],  'text', art['description'])
                except Exception:
                    pass

            return Response({'articles': articles})

        except requests.RequestException as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_502_BAD_GATEWAY
            )


def fetch_and_store_news():
    api_key = os.getenv('NEWS_API_KEY')
    if not api_key:
        return

    res = requests.get(
        'https://newsapi.org/v2/top-headlines',
        params={'country': 'us', 'pageSize': 9, 'apiKey': api_key},
        timeout=10
    )
    if res.status_code != 200:
        return

    articles = res.json().get('articles', [])
    valid = [a for a in articles if a.get('urlToImage')]
    slice9 = valid[:9]

    titles = [a.get('title') or '' for a in slice9]
    descs  = [a.get('description') or '' for a in slice9]

    async def bulk_translate(titles, descs):
        async with Translator(service_urls=['translate.googleapis.com']) as tr:
            t_titles = await tr.translate(titles, dest='ro')
            t_descs  = await tr.translate(descs,  dest='ro')
            return t_titles, t_descs

    try:
        tr_titles, tr_descs = asyncio.run(bulk_translate(titles, descs))
    except Exception:
        tr_titles = [type('O', (), {'text': t}) for t in titles]
        tr_descs  = [type('O', (), {'text': d}) for d in descs]

    for idx, art in enumerate(slice9):
        NewsArticle.objects.create(
            title=tr_titles[idx].text,
            description=tr_descs[idx].text,
            url=art.get('url'),
            image=art.get('urlToImage'),
            source=art.get('source', {}).get('name', 'Unknown'),
            published_at=art.get('publishedAt')
        )


def fallback_news(request):
    articles = list(NewsArticle.objects.all().values())
    return JsonResponse({"articles": articles})
