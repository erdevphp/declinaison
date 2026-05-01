from django.urls import path
from .views import (
    LoginView, LogoutView, MeView, RefreshTokenView,
    RegisterView, ChangePasswordView
)

urlpatterns = [
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('auth/me/', MeView.as_view(), name='me'),
    path('auth/refresh/', RefreshTokenView.as_view(), name='refresh'),
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/change-password/', ChangePasswordView.as_view(), name='change-password'),
]