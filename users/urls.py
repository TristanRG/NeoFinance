from django.urls import path
from .views import RegisterView, LoginView, TokenRefreshView, UserDetailView, guest_signup
from .auth_views import GuestTokenObtainPairView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('refresh-token/', TokenRefreshView.as_view(), name='token_refresh'),
    path('me/', UserDetailView.as_view(), name='user_detail'),  
    path('guest-signup/', guest_signup, name='guest-signup'),
    path('guest-token/', GuestTokenObtainPairView.as_view(), name='guest-token'),
]
