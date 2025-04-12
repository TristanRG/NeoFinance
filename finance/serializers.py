from rest_framework import serializers
from .models import Transaction
from datetime import datetime

class TransactionSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Transaction
        fields = ['id', 'user', 'description', 'amount', 'type', 'date', 'time']
        read_only_fields = ['id', 'user']

    def get_date(self, obj):
        return obj.created_at.strftime("%d %b %y")  

    def get_time(self, obj):
        return obj.created_at.strftime("%I.%M %p")