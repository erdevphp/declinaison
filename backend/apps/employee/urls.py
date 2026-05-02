from django.urls import path
from .views import (ListsView, UpdateProfileView)

urlpatterns = [
    path('employee/list/', ListsView.as_view(), name='lists'),
    path('employee/profile/update/', UpdateProfileView.as_view(), name='update-profile')
]