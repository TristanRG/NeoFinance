from django.urls import path
from .views import (
    RegisterView, LoginView, TokenRefreshView, UserDetailView,
    guest_signup
)
from .auth_views import GuestTokenObtainPairView
from users.auth_views import AdminTokenObtainPairView
from users.views      import AdminUserViewSet

admin_list = AdminUserViewSet.as_view({'get': 'list'})
admin_delete = AdminUserViewSet.as_view({'delete': 'destroy'})

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('refresh-token/', TokenRefreshView.as_view(), name='token_refresh'),
    path('me/', UserDetailView.as_view(), name='user_detail'),  
    path('guest-signup/', guest_signup, name='guest-signup'),
    path('guest-token/', GuestTokenObtainPairView.as_view(), name='guest-token'),
    path('admin-token/', AdminTokenObtainPairView.as_view(), name='admin-token'),
    path('admin/users/', admin_list, name='admin-user-list'),
    path('admin/users/<uuid:pk>/', admin_delete, name='admin-user-delete'),
]