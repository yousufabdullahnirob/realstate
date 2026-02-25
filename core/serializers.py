from rest_framework import serializers
from core.models import Apartment, ApartmentImage, User, Project
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'full_name', 'email', 'phone', 'role']

class RegistrationSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['full_name', 'email', 'phone', 'password', 'confirm_password', 'role']
        extra_kwargs = {
            'password': {'write_only': True},
            'full_name': {'required': True},
            'email': {'required': True},
        }

    def validate_role(self, value):
        if value not in [User.Role.ADMIN, User.Role.CUSTOMER]:
            raise serializers.ValidationError("Invalid role. Must be 'admin' or 'customer'.")
        return value

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})
        
        try:
            validate_password(data['password'])
        except ValidationError as e:
            raise serializers.ValidationError({"password": list(e.messages)})

        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        user = User.objects.create_user(
            username=validated_data['email'], # Django AbstractUser requires username, we use email
            email=validated_data['email'],
            password=validated_data['password'],
            full_name=validated_data['full_name'],
            phone=validated_data.get('phone', ''),
            role=validated_data.get('role', User.Role.CUSTOMER)
        )
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    role = serializers.CharField(required=False)

class ProjectSerializer(serializers.ModelSerializer):
    apartment_count = serializers.IntegerField(source='apartments.count', read_only=True)
    available_units_count = serializers.SerializerMethodField()
    sold_units_count = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            'id', 'name', 'location', 'description', 'total_floors', 
            'total_units', 'launch_date', 'status', 'is_active',
            'apartment_count', 'available_units_count', 'sold_units_count',
            'created_at', 'updated_at'
        ]

    def get_available_units_count(self, obj):
        return obj.apartments.filter(status='available').count()

    def get_sold_units_count(self, obj):
        return obj.apartments.filter(status='sold').count()

    def validate_total_units(self, value):
        if self.instance and value < self.instance.apartments.count():
            raise serializers.ValidationError(
                f"Total units cannot be less than the existing apartment count ({self.instance.apartments.count()})."
            )
        return value

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
