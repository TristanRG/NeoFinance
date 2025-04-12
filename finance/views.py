from django.shortcuts import render

# Create your views here.

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Transaction, Category
from .serializers import TransactionSerializer
from django.shortcuts import get_object_or_404

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def transactions_view(request):
    user = request.user

    if request.method == 'GET':
        transactions = Transaction.objects.filter(user=user).order_by('-date')
        serializer = TransactionSerializer(transactions, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        data = request.data.copy()
        data['user'] = str(user.id)
        serializer = TransactionSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_transaction(request, transaction_id):
    transaction = get_object_or_404(Transaction, id=transaction_id, user=request.user)
    transaction.delete()
    return Response({'message': 'Transaction deleted'}, status=status.HTTP_204_NO_CONTENT)
