from django.urls import path
from . import views

urlpatterns = [
    path('transactions/', views.transactions_view, name='transactions'),
    path('transactions/<uuid:transaction_id>/', views.delete_transaction, name='delete-transaction'),
    path('transactions/<uuid:transaction_id>/update/', views.update_transaction, name='update-transaction'),
]