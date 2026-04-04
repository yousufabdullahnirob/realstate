from rest_framework import serializers
from core.models import (
    Apartment, ApartmentImage, User, Project, ProjectImage, 
    Inquiry, Notification, Installment, Payment, PropertyView, Favorite, Booking
)
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'full_name', 'email', 'phone', 'role', 'profile_image']

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

class ProjectImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectImage
        fields = ['image_url']

class ProjectSerializer(serializers.ModelSerializer):
    apartment_count = serializers.IntegerField(source='apartments.count', read_only=True)
    available_units_count = serializers.SerializerMethodField()
    sold_units_count = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()
    images = ProjectImageSerializer(many=True, read_only=True)
    image_url = serializers.URLField(write_only=True, required=False)

    class Meta:
        model = Project
        fields = [
            'id', 'name', 'location', 'description', 
            'land_area', 'orientation', 'parking', 'handover_date',
            'features', 'extra_description',
            'total_floors', 'total_units', 'launch_date', 'status', 'is_active',
            'apartment_count', 'available_units_count', 'sold_units_count',
            'image', 'images', 'image_url', 'created_at', 'updated_at'
        ]

    def get_image(self, obj):
        first_image = obj.images.first()
        return first_image.image_url if first_image else None

    def get_available_units_count(self, obj):
        return obj.apartments.filter(status='available').count()

    def get_sold_units_count(self, obj):
        return obj.apartments.filter(status='sold').count()

    def create(self, validated_data):
        image_url = validated_data.pop('image_url', None)
        project = Project.objects.create(**validated_data)
        if image_url:
            ProjectImage.objects.create(project=project, image_url=image_url)
        return project

    def update(self, instance, validated_data):
        image_url = validated_data.pop('image_url', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if image_url:
            # For simplicity, replace or add
            ProjectImage.objects.filter(project=instance).delete()
            ProjectImage.objects.create(project=instance, image_url=image_url)
        return instance

class ApartmentImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ApartmentImage
        fields = ['image_url']

class ApartmentSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    project_name = serializers.ReadOnlyField(source='project.name')
    images = ApartmentImageSerializer(many=True, read_only=True)
    image_url = serializers.URLField(write_only=True, required=False)

    class Meta:
        model = Apartment
        fields = [
            'id', 'title', 'price', 'description', 'location', 'image', 'images', 'image_url',
            'project', 'project_name', 'floor_area_sqft', 'bedrooms', 'bathrooms', 'status',
            'is_approved', 'total_views'
        ]

    def get_image(self, obj):
        first_image = obj.images.first()
        if first_image:
            return first_image.image_url
        return None

    def create(self, validated_data):
        image_url = validated_data.pop('image_url', None)
        apartment = Apartment.objects.create(**validated_data)
        if image_url:
            ApartmentImage.objects.create(apartment=apartment, image_url=image_url)
        return apartment

    def update(self, instance, validated_data):
        image_url = validated_data.pop('image_url', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if image_url:
            ApartmentImage.objects.filter(apartment=instance).delete()
            ApartmentImage.objects.create(apartment=instance, image_url=image_url)
        return instance

class InquirySerializer(serializers.ModelSerializer):
    user_email = serializers.ReadOnlyField(source='user.email')
    apartment_title = serializers.ReadOnlyField(source='apartment.title')

    class Meta:
        model = Inquiry
        fields = ['id', 'user', 'user_email', 'apartment', 'apartment_title', 'message', 'status', 'created_at']
        extra_kwargs = {
            'user': {'read_only': True}
        }

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'user', 'message', 'type', 'is_read', 'created_at']

class InstallmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Installment
        fields = '__all__'

class BookingSerializer(serializers.ModelSerializer):
    installments = InstallmentSerializer(many=True, read_only=True)
    user_email = serializers.ReadOnlyField(source='user.email')
    apartment_title = serializers.ReadOnlyField(source='apartment.title')

    class Meta:
        model = Booking
        fields = ['id', 'booking_reference', 'user', 'user_email', 'apartment', 'apartment_title', 'booking_date', 'status', 'advance_amount', 'installments']
        extra_kwargs = {
            'booking_reference': {'read_only': True},
            'user': {'read_only': True}
        }

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'
        extra_kwargs = {
            'verification_status': {'read_only': True}
        }

class PropertyViewSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyView
        fields = '__all__'

class FavoriteSerializer(serializers.ModelSerializer):
    apartment_details = ApartmentSerializer(source='apartment', read_only=True)
    
    class Meta:
        model = Favorite
        fields = ['id', 'user', 'apartment', 'apartment_details', 'created_at']
        extra_kwargs = {'user': {'read_only': True}}

class PasswordChangeSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

    def validate_new_password(self, value):
        validate_password(value)
        return value
