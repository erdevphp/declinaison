from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model

from apps.employee.serializers import EmployeeSerializer, RegisterSerializer, ChangePasswordSerializer

User = get_user_model()


class LoginView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        
        if not email or not password:
            return Response(
                {'error': 'Email et mot de passe requis'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user = authenticate(request, username=email, password=password)
        
        if not user:
            return Response(
                {'error': 'Email ou mot de passe incorrect'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        if not user.is_active:
            return Response(
                {'error': 'Compte désactivé'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        # Générer les tokens
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)
        
        # Sérialiser l'utilisateur
        serializer = EmployeeSerializer(user)
        
        # Créer la réponse avec les cookies
        response = Response({
            'message': 'Connexion réussie',
            'user': serializer.data
        }, status=status.HTTP_200_OK)
        
        # Définir les cookies HttpOnly
        response.set_cookie(
            key='access_token',
            value=access_token,
            httponly=True,
            secure=False,  # Mettre True en production (HTTPS)
            samesite='Lax',
            max_age=15 * 60  # 15 minutes
        )
        response.set_cookie(
            key='refresh_token',
            value=refresh_token,
            httponly=True,
            secure=False,
            samesite='Lax',
            max_age=7 * 24 * 60 * 60  # 7 jours
        )
        
        return response


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        response = Response({'message': 'Déconnexion réussie'}, status=status.HTTP_200_OK)
        response.delete_cookie('access_token')
        response.delete_cookie('refresh_token')
        return response


class MeView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        serializer = EmployeeSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)


class RefreshTokenView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        refresh_token = request.COOKIES.get('refresh_token')
        
        if not refresh_token:
            return Response(
                {'error': 'Impossible de se connecter!'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            refresh = RefreshToken(refresh_token)
            access_token = str(refresh.access_token)
            
            response = Response({'message': 'Token rafraîchi'}, status=status.HTTP_200_OK)
            response.set_cookie(
                key='access_token',
                value=access_token,
                httponly=True,
                secure=False,
                samesite='Lax',
                max_age=15 * 60
            )
            return response
        except Exception:
            return Response(
                {'error': 'Refresh token invalide ou expiré'},
                status=status.HTTP_401_UNAUTHORIZED
            )


class RegisterView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            
            # Générer les tokens
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            refresh_token = str(refresh)
            
            user_serializer = EmployeeSerializer(user)
            
            # Créer la réponse avec les cookies
            response = Response({
                'message': 'Inscription réussie',
                'user': user_serializer.data
            }, status=status.HTTP_201_CREATED)
            
            # Définir les cookies HttpOnly
            response.set_cookie(
                key='access_token',
                value=access_token,
                httponly=True,
                secure=False,  # Mettre True en production (HTTPS)
                samesite='Lax',
                max_age=15 * 60  # 15 minutes
            )
            response.set_cookie(
                key='refresh_token',
                value=refresh_token,
                httponly=True,
                secure=False,
                samesite='Lax',
                max_age=7 * 24 * 60 * 60  # 7 jours
            )
            
            return response
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            if not user.check_password(serializer.validated_data['old_password']):
                return Response(
                    {'old_password': 'Mot de passe incorrect'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            return Response({'message': 'Mot de passe modifié'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)