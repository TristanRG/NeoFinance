import pytest
from rest_framework.test import APIClient
from users.models import CustomUser
from finance.models import Transaction
from datetime import datetime

@pytest.mark.django_db
def test_create_transaction():
    user = CustomUser.objects.create_user(username='john_view1', email='john_view1@yahoo.com', password='pass123')
    client = APIClient()
    client.force_authenticate(user=user)

    data = {
        "description": "Groceries",
        "amount": "30.00",
        "type": "expense",
        "date": datetime.now().isoformat(),
        "category": "Food",
        "recurrence": "none"
    }

    response = client.post("/finance/transactions/", data)
    assert response.status_code == 201
    assert Transaction.objects.filter(user=user, category="Food").exists()

@pytest.mark.django_db
def test_delete_transaction():
    user = CustomUser.objects.create_user(username='john_view3', email='john_view3@yahoo.com', password='pass123')
    transaction = Transaction.objects.create(user=user, category="Food", amount=20)
    client = APIClient()
    client.force_authenticate(user=user)

    response = client.delete(f"/finance/transactions/{transaction.id}/")
    assert response.status_code == 204
    assert not Transaction.objects.filter(id=transaction.id).exists()

@pytest.mark.django_db
def test_login_view():
    CustomUser.objects.create_user(email="login@example.com", username="loguser", password="pass123")
    client = APIClient()
    response = client.post("/users/login/", {
        "email": "login@example.com",
        "password": "pass123"
    })
    assert response.status_code == 200
    assert "access" in response.data

@pytest.mark.django_db
def test_user_detail_view_authenticated():
    user = CustomUser.objects.create_user(email="me@example.com", username="meuser", password="me123")
    client = APIClient()
    client.force_authenticate(user=user)
    response = client.get("/users/me/")
    assert response.status_code == 200
    assert response.data["email"] == "me@example.com"

@pytest.mark.django_db
def test_guest_signup_view():
    client = APIClient()
    response = client.post("/users/guest-signup/")
    assert response.status_code == 200
    assert response.data["user"]["username"].startswith("Guest")
    assert "access" in response.data
    assert "refresh" in response.data
    assert CustomUser.objects.get(id=response.data["user"]["id"]).is_guest
