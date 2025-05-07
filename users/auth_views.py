from rest_framework_simplejwt.views import TokenObtainPairView
from .auth_serializers import GuestTokenObtainPairSerializer
from .auth_serializers import AdminTokenObtainPairSerializer

class GuestTokenObtainPairView(TokenObtainPairView):
    serializer_class = GuestTokenObtainPairSerializer
    
class AdminTokenObtainPairView(TokenObtainPairView):
   """
    POST /users/admin-token/
    Returns access+refresh tokens with is_admin and is_staff flags.
   """
   serializer_class = AdminTokenObtainPairSerializer