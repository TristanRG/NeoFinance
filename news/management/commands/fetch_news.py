from django.core.management.base import BaseCommand
from news.views import fetch_and_store_news

class Command(BaseCommand):
    help = 'Fetch and store latest news articles'

    def handle(self, *args, **kwargs):
        fetch_and_store_news()
        self.stdout.write(self.style.SUCCESS('Successfully fetched and stored news'))