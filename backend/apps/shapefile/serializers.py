from rest_framework import serializers


class ValidateShapefilesSerializer(serializers.Serializer):
    region = serializers.FileField()
    district = serializers.FileField()
    commune = serializers.FileField()
    fokontany = serializers.FileField()


class ExportSerializer(serializers.Serializer):
    region = serializers.CharField()
    district = serializers.CharField()
    commune = serializers.CharField()