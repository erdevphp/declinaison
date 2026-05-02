import logging
import traceback

from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

from .serializers import ValidateShapefilesSerializer, ExportSerializer
from .services.shapefile_service import ShapefileService

logger = logging.getLogger(__name__)


class ValidateShapefilesView(APIView):
    """Valide les 4 shapefiles uploadés"""
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        # Debug
        print("=== VALIDATION SHAPEFILES ===")
        print(f"Fichiers reçus: {list(request.FILES.keys())}")
        for key, f in request.FILES.items():
            print(f"  {key}: {f.name} ({f.size} bytes)")

        serializer = ValidateShapefilesSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                'error': 'Fichiers invalides',
                'details': serializer.errors
            }, status=400)

        try:
            result = ShapefileService.validate_shapefiles(serializer.validated_data)
            
            if result['success']:
                return Response(result['data'], status=200)
            else:
                return Response({
                    'error': 'Validation échouée',
                    'errors': result['errors']
                }, status=400)
                
        except Exception as e:
            logger.exception("Erreur lors de la validation")
            return Response({'error': str(e)}, status=500)


class RegionsView(APIView):
    """Liste des régions"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        regions = ShapefileService.get_regions()
        return Response(regions)


class DistrictsView(APIView):
    """Liste des districts par région"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        region = request.query_params.get('region')
        if not region:
            return Response({'error': 'Région requise'}, status=400)
        
        districts = ShapefileService.get_districts(region)
        return Response(districts)


class CommunesView(APIView):
    """Liste des communes par région et district"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        region = request.query_params.get('region')
        district = request.query_params.get('district')
        
        if not region or not district:
            return Response({'error': 'Région et district requis'}, status=400)
        
        communes = ShapefileService.get_communes(region, district)
        return Response(communes)


class FokontanyView(APIView):
    """Liste des fokontany par région, district et commune"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        region = request.query_params.get('region')
        district = request.query_params.get('district')
        commune = request.query_params.get('commune')
        
        if not all([region, district, commune]):
            return Response({
                'error': 'Région, district et commune requis'
            }, status=400)
        
        fokontany = ShapefileService.get_fokontany(region, district, commune)
        return Response(fokontany)


class ClearTempDataView(APIView):
    """Nettoie les données temporaires"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        ShapefileService.clear_temp_data()
        return Response({'message': 'Données nettoyées'})
    

class ExportShapefilesView(APIView):
    """Exporte les shapefiles sélectionnés"""
    permission_classes = [IsAuthenticated]
    parser_classes = [JSONParser]  # ← Important : ne pas utiliser MultiPartParser ici

    def post(self, request):
        serializer = ExportSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({'error': 'Données invalides'}, status=400)
        
        data = serializer.validated_data
        
        try:
            zip_content = ShapefileService.export_selection(
                data['region'],
                data['district'],
                data['commune']
            )
            
            # CRUCIAL : Retourner un HttpResponse, pas un Response DRF !
            response = HttpResponse(zip_content, content_type='application/zip')
            response['Content-Disposition'] = (
                f'attachment; filename="Limite_Admin_{data["region"]}_{data["district"]}_{data["commune"]}.zip"'
            )
            return response
            
        except Exception as e:
            logger.exception("Erreur lors de l'export")
            return Response({'error': str(e)}, status=500)