from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class GuestTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["is_guest"] = True
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data["is_guest"] = True
        return data