import re

from rest_framework import serializers
from core.models import Apartment, ApartmentImage, User, Project, Payment, Booking, Inquiry, Notification
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
        return first_image.image_url if first_image else "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80"

class BookingSerializer(serializers.ModelSerializer):
    apartment_title = serializers.CharField(source='apartment.title', read_only=True)
    tenant_name = serializers.CharField(source='user.full_name', read_only=True)
    tenant_email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = Booking
        fields = [
            'id', 'booking_reference', 'user', 'tenant_name', 'tenant_email',
            'apartment', 'apartment_title', 'booking_date', 'status', 'advance_amount'
        ]
        read_only_fields = ['id', 'booking_date', 'booking_reference']

class PaymentSerializer(serializers.ModelSerializer):
    booking_reference = serializers.CharField(source='booking.booking_reference', read_only=True)
    client_name = serializers.CharField(source='booking.user.full_name', read_only=True)
    allowed_gateways = {'SSLCommerz', 'bKash', 'Nagad'}

    class Meta:
        model = Payment
        fields = [
            'id', 'booking', 'booking_reference', 'client_name', 'transaction_id',
            'amount', 'payment_status', 'payment_date', 'payment_gateway'
        ]
        read_only_fields = ['id', 'payment_date']

    def validate_payment_status(self, value):
        request = self.context.get('request')
        if not request or request.user.is_anonymous:
            return value

        if request.user.role != User.Role.ADMIN and value != Payment.PaymentStatus.FAILED:
            raise serializers.ValidationError('Only admin can verify a payment.')
        return value

    def validate_transaction_id(self, value):
        cleaned_value = value.strip().upper()
        if not re.fullmatch(r'[A-Z0-9-]{6,100}', cleaned_value):
            raise serializers.ValidationError(
                'Transaction ID must be 6-100 characters and contain only letters, numbers, and hyphens.'
            )
        return cleaned_value

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError('Amount must be greater than zero.')
        return value

    def validate_payment_gateway(self, value):
        if value not in self.allowed_gateways:
            raise serializers.ValidationError('Unsupported payment gateway.')
        return value

    def validate_booking(self, value):
        if hasattr(value, 'payment'):
            raise serializers.ValidationError('Payment already exists for this booking.')
        return value

    def validate(self, attrs):
        request = self.context.get('request')
        booking = attrs.get('booking') or getattr(self.instance, 'booking', None)

        if booking and booking.status == Booking.Status.CANCELLED:
            raise serializers.ValidationError({'booking': 'Cancelled bookings cannot accept payments.'})

        if request and request.method == 'POST' and request.user.role != User.Role.ADMIN:
            if booking and booking.user_id != request.user.id:
                raise serializers.ValidationError({'booking': 'You can only submit payment for your own booking.'})

        return attrs

    def create(self, validated_data):
        request = self.context.get('request')
        if request and request.user.role != User.Role.ADMIN:
            validated_data['payment_status'] = Payment.PaymentStatus.FAILED
        validated_data['transaction_id'] = validated_data['transaction_id'].strip().upper()
        return super().create(validated_data)


class AdminApartmentSerializer(serializers.ModelSerializer):
    project_name = serializers.CharField(source='project.name', read_only=True)

    class Meta:
        model = Apartment
        fields = [
            'id', 'project', 'project_name', 'title', 'description', 'location',
            'floor_area_sqft', 'price', 'bedrooms', 'bathrooms', 'status',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class AdminInquirySerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.full_name', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)
    apartment_title = serializers.CharField(source='apartment.title', read_only=True)
    project_name = serializers.CharField(source='apartment.project.name', read_only=True)

    class Meta:
        model = Inquiry
        fields = [
            'id', 'user', 'user_name', 'user_email', 'apartment', 'apartment_title',
            'project_name', 'message', 'status', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class AdminNotificationSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.full_name', read_only=True)

    class Meta:
        model = Notification
        fields = ['id', 'user', 'user_name', 'message', 'type', 'is_read', 'created_at']
        read_only_fields = ['id', 'created_at']
