from rest_framework import serializers

from core.models import Apartment, ApartmentImage

class ApartmentImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ApartmentImage
        fields = ['image_url']

class ApartmentSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = Apartment
        fields = ['id', 'title', 'price', 'description', 'location', 'image']

    def get_image(self, obj):
        first_image = obj.images.first()
        return first_image.image_url if first_image else "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80" # Fallback image
