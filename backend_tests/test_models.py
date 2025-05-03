import pytest
from finance.models import Transaction
from users.models import CustomUser
from django.utils import timezone
from decimal import Decimal

@pytest.mark.django_db
def test_transaction_str_representation():
    user = CustomUser.objects.create_user(username='john_tester1', email='john_tester1@yahoo.com', password='pass123')
    txn = Transaction.objects.create(
        user=user,
        category="Food",
        amount=Decimal("25.50"),
        currency="EUR",
        date=timezone.now(),
        type="expense"
    )
    assert str(txn) == "25.50 - Food"

@pytest.mark.django_db
def test_transaction_get_category_color():
    user = CustomUser.objects.create_user(username='john_tester2', email='john_tester2@yahoo.com', password='pass123')
    txn = Transaction.objects.create(user=user, category="Food", amount=20)
    assert txn.get_category_color() == "#FF6384"

@pytest.mark.django_db
def test_transaction_type_trigger():
    user = CustomUser.objects.create_user(username='john_tester3', email='john_tester3@yahoo.com', password='pass123')
    income = Transaction.objects.create(user=user, category="Salary", amount=1000, type="income")
    expense = Transaction.objects.create(user=user, category="Food", amount=-100, type="expense")

    assert income.type == "income"
    assert expense.type == "expense"

@pytest.mark.django_db
def test_create_user():
    user = CustomUser.objects.create_user(
        email="user@example.com",
        username="user123",
        password="securepass"
    )
    assert user.email == "user@example.com"
    assert user.username == "user123"
    assert user.check_password("securepass")
    assert not user.is_staff

@pytest.mark.django_db
def test_create_superuser():
    admin = CustomUser.objects.create_superuser(
        email="admin@example.com",
        username="admin",
        password="adminpass"
    )
    assert admin.is_staff
    assert admin.is_superuser