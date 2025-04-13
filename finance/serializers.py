from rest_framework import serializers
from .models import Transaction, Category
from datetime import datetime

class TransactionSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(write_only=True)  
    
class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ['id', 'user', 'description', 'amount', 'type', 'date', 'category', 'recurrence']
        read_only_fields = ['id', 'user']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
    
    def get_date(self, obj):
        return obj.created_at.strftime("%d %b %y")  

    def get_time(self, obj):
        return obj.created_at.strftime("%I.%M %p")
