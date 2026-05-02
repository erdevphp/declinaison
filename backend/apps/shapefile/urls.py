from django.urls import path
from . import views

urlpatterns = [
    path('shapefile/validate/', views.ValidateShapefilesView.as_view(), name='shapefile-validate'),
    path('shapefile/regions/', views.RegionsView.as_view(), name='shapefile-regions'),
    path('shapefile/districts/', views.DistrictsView.as_view(), name='shapefile-districts'),
    path('shapefile/communes/', views.CommunesView.as_view(), name='shapefile-communes'),
    path('shapefile/fokontany/', views.FokontanyView.as_view(), name='shapefile-fokontany'),
    path('shapefile/export/', views.ExportShapefilesView.as_view(), name='shapefile-export'),
    path('shapefile/clear/', views.ClearTempDataView.as_view(), name='shapefile-clear'),
]