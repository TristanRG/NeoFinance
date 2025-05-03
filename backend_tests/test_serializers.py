import pytest
from finance.serializers import TransactionSerializer
from users.models import CustomUser
from rest_framework.test import APIRequestFactory
from datetime import datetime
from users.serializers import UserSerializer

@pytest.mark.django_db
def test_transaction_serializer_valid_data():
    user = CustomUser.objects.create_user(username='john_serial1', email='john_serial1@yahoo.com', password='testpass')
    factory = APIRequestFactory()
    request = factory.post('/finance/transactions/')
    
    data = {
        "description": "Dinner",
        "amount": "20.00",
        "type": "expense",
        "date": datetime.now().isoformat(),
        "category": "Food",
        "recurrence": "none"
    }

    serializer = TransactionSerializer(data=data, context={'request': request})
    assert serializer.is_valid(), serializer.errors

@pytest.mark.django_db
def test_transaction_serializer_invalid_category():
    user = CustomUser.objects.create_user(username='john_serial2', email='john_serial2@yahoo.com', password='testpass')
    factory = APIRequestFactory()
    request = factory.post('/finance/transactions/')

    data = {
        "description": "Bad category",
        "amount": "50.00",
        "type": "expense",
        "date": datetime.now().isoformat(),
        "category": "InvalidCategory",
        "recurrence": "none"
    }

    serializer = TransactionSerializer(data=data, context={'request': request})
    assert not serializer.is_valid()
    assert 'category' in serializer.errors

@pytest.mark.django_db
def test_user_serializer_creates_user():
    data = {
        "email": "serialize@example.com",
        "username": "serialuser",
        "password": "pass1234"
    }
    serializer = UserSerializer(data=data)
    assert serializer.is_valid(), serializer.errors
    user = serializer.save()
    assert CustomUser.objects.filter(email="serialize@example.com").exists()
    assert user.username == "serialuser"