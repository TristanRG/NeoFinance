from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import get_object_or_404

from .models import CustomUser
from .serializers import UserSerializer
from .permissions import IsStaffUser

class UserAdminList(generics.ListAPIView):
    """
    GET /users/admin/ → list all users
    """
    queryset = CustomUser.objects.all().order_by('created_at')
    serializer_class = UserSerializer
    permission_classes = [IsStaffUser]  

class UserAdminDetail(generics.DestroyAPIView):
    """
    DELETE /users/admin/<uuid:pk>/ → delete (or deactivate) a user
    """
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsStaffUser]

    def perform_destroy(self, instance):
        instance.is_active = False
        instance.save()