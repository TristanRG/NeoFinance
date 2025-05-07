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

class AdminTokenObtainPairSerializer(TokenObtainPairSerializer):  
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["is_staff"] = user.is_staff
        if user.is_staff:
            token["is_admin"] = True
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data['isStaff'] = self.user.is_staff
        if self.user.is_staff:
            data["is_admin"] = True
        return data