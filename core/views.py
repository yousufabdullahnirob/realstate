import uuid
from rest_framework import status, generics, permissions, filters
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import Apartment, User, Project, Payment, Booking, Inquiry, Notification
from .serializers import (
    ApartmentSerializer, RegistrationSerializer, LoginSerializer,
    UserSerializer, ProjectSerializer, PaymentSerializer, BookingSerializer,
    AdminApartmentSerializer, AdminInquirySerializer, AdminNotificationSerializer
)
from .permissions import IsAdminRole


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegistrationSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            "message": "User registered successfully",
            "user_id": user.id,
            "user": UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)


class CustomLoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data.get('email')
        password = serializer.validated_data.get('password')
        required_role = serializer.validated_data.get('role')

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        user = authenticate(username=email, password=password)
        if not user:
            return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        if not user.is_active:
            return Response({"detail": "Account is disabled"}, status=status.HTTP_401_UNAUTHORIZED)

        if required_role and user.role != required_role:
            return Response(
                {"detail": f"Unauthorized role. Access denied for {required_role}."},
                status=status.HTTP_401_UNAUTHORIZED
            )

        refresh = RefreshToken.for_user(user)
        return Response({
            "message": "Login successful",
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": UserSerializer(user).data
        }, status=status.HTTP_200_OK)


class ProjectListCreateAPIView(generics.ListCreateAPIView):
    queryset = Project.objects.filter(is_active=True)
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'location']
    ordering_fields = ['created_at', 'launch_date']

    def perform_create(self, serializer):
        serializer.save()


class ProjectDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Project.objects.filter(is_active=True)
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]

    def perform_destroy(self, instance):
        if instance.apartments.count() > 0:
            from rest_framework import serializers as drf_serializers
            raise drf_serializers.ValidationError({"detail": "Cannot delete project with existing apartments."})
        instance.is_active = False
        instance.save()


class ApartmentListAPIView(generics.ListAPIView):
    queryset = Apartment.objects.all()
    serializer_class = ApartmentSerializer


class AdminApartmentListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = AdminApartmentSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'location', 'project__name']
    ordering_fields = ['created_at', 'price', 'status']

    def get_queryset(self):
        return Apartment.objects.select_related('project').all().order_by('-created_at')


class AdminApartmentDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Apartment.objects.select_related('project').all()
    serializer_class = AdminApartmentSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]


class BookingListCreateAPIView(generics.ListCreateAPIView):
    """GET: Admin lists all bookings. POST: Admin creates a booking."""
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['booking_reference', 'user__full_name', 'apartment__title']
    ordering_fields = ['booking_date', 'status']

    def get_queryset(self):
        return Booking.objects.all().order_by('-booking_date')

    def perform_create(self, serializer):
        booking_reference = f"BK-{uuid.uuid4().hex[:8].upper()}"
        serializer.save(booking_reference=booking_reference)


class BookingDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    """Admin retrieves, updates, or deletes a booking."""
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]


class CustomerBookingListAPIView(generics.ListAPIView):
    """Authenticated customers can only view their own bookings for payment submission."""
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user).order_by('-booking_date')


class PaymentListCreateAPIView(generics.ListCreateAPIView):
    """GET: Admin lists all payments. POST: Client submits a payment."""
    serializer_class = PaymentSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['transaction_id', 'booking__booking_reference', 'payment_status']
    ordering_fields = ['payment_date', 'amount']

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.IsAuthenticated(), IsAdminRole()]

    def get_queryset(self):
        if getattr(self.request.user, 'role', None) == 'admin':
            return Payment.objects.all()
        return Payment.objects.filter(booking__user=self.request.user)

    def perform_create(self, serializer):
        booking = serializer.validated_data['booking']
        if booking.user != self.request.user:
            from rest_framework import serializers as drf_serializers
            raise drf_serializers.ValidationError({'booking': 'You can only submit payment for your own booking.'})
        serializer.save()


class PaymentDetailAPIView(generics.RetrieveUpdateAPIView):
    """Admin retrieves or updates (verifies/rejects) a payment."""
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]

    def patch(self, request, *args, **kwargs):
        allowed_fields = {'payment_status'}
        invalid_fields = set(request.data.keys()) - allowed_fields
        if invalid_fields:
            return Response(
                {'detail': 'Only payment_status can be updated during verification.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        return super().patch(request, *args, **kwargs)


class AdminInquiryListAPIView(generics.ListAPIView):
    serializer_class = AdminInquirySerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['user__full_name', 'user__email', 'apartment__title', 'message', 'status']
    ordering_fields = ['created_at', 'status']

    def get_queryset(self):
        return Inquiry.objects.select_related('user', 'apartment', 'apartment__project').all().order_by('-created_at')


class AdminInquiryDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Inquiry.objects.select_related('user', 'apartment', 'apartment__project').all()
    serializer_class = AdminInquirySerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]


class AdminNotificationListAPIView(generics.ListAPIView):
    serializer_class = AdminNotificationSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['message', 'type', 'user__full_name']
    ordering_fields = ['created_at', 'type', 'is_read']

    def get_queryset(self):
        return Notification.objects.select_related('user').all().order_by('-created_at')


class AdminNotificationDetailAPIView(generics.RetrieveUpdateAPIView):
    queryset = Notification.objects.select_related('user').all()
    serializer_class = AdminNotificationSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]
