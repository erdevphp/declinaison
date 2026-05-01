from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, AuthenticationFailed

User = get_user_model()

class EmailBackend(ModelBackend):
    """Authentification par email au lieu de username"""
    
    def authenticate(self, request, username=None, password=None, **kwargs):
        # username contient l'email
        try:
            user = User.objects.get(email=username)
        except User.DoesNotExist:
            return None
        
        if user.check_password(password):
            return user
        return None
    
    

class CookieJWTAuthentication(JWTAuthentication):
    """Authentification JWT via cookie HttpOnly ou header Authorization"""
    
    def authenticate(self, request):
        # 1. Essayer le header Authorization
        header = self.get_header(request)
        if header is not None:
            raw_token = self.get_raw_token(header)
            if raw_token is not None:
                return self.get_user_from_token(raw_token)
        
        # 2. Sinon, essayer le cookie
        access_token = request.COOKIES.get('access_token')
        if access_token:
            return self.get_user_from_token(access_token)
        
        return None
    
    def get_user_from_token(self, raw_token):
        try:
            validated_token = self.get_validated_token(raw_token)
            user = self.get_user(validated_token)
            return (user, validated_token)
        except InvalidToken:
            raise AuthenticationFailed('Token invalide ou expiré')