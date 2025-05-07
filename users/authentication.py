from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken
from datetime import timedelta
from django.conf import settings

class GuestAwareJWTAuthentication(JWTAuthentication):
    def get_validated_token(self, raw_token):
        token = super().get_validated_token(raw_token)
        if token.get("is_guest"):
            issued_at = token.payload.get("iat")
            now = int(self.get_validated_token_clock().timestamp())
            age = now - issued_at
            if age > settings.SIMPLE_JWT["GUEST_REFRESH_TOKEN_LIFETIME"].total_seconds():
                raise InvalidToken("Guest token expired")
        return token

class AdminAwareJWTAuthentication(JWTAuthentication):  
    def get_validated_token(self, raw_token):
        token = super().get_validated_token(raw_token)
        if not token.get("is_admin"):
            raise InvalidToken("Token is not an admin token")
        return token