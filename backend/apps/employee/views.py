from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.contrib.auth import get_user_model
from .serializers import EmployeeSerializer
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

Employee = get_user_model()

class ListsView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        employees = Employee.objects.exclude(id=self.request.user.id)
        serializer = EmployeeSerializer(employees, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)



class UpdateProfileView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]  # Important pour les images

    def patch(self, request):
        user = request.user
        serializer = EmployeeSerializer(user, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
