from django.db import models
from rest_framework import status, generics, permissions, filters
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import (
    Apartment, User, Project, Inquiry, Notification, 
    ProjectImage, Payment, Installment, PropertyView, Booking
)
from .serializers import (
    ApartmentSerializer, RegistrationSerializer, LoginSerializer, 
    UserSerializer, ProjectSerializer, InquirySerializer, 
    NotificationSerializer, PaymentSerializer, InstallmentSerializer, BookingSerializer
)
from .permissions import IsAdminRole, IsAgentRole, IsAdminOrAgentRole

# ... existing code ...

class ApartmentDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Apartment.objects.all()
    serializer_class = ApartmentSerializer
    
    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated(), IsAdminOrAgentRole()]

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        # Analytics: Record view
        client_ip = request.META.get('REMOTE_ADDR')
        user = request.user if request.user.is_authenticated else None
        PropertyView.objects.create(apartment=instance, user=user, ip_address=client_ip)
        instance.total_views = instance.views.count()
        instance.save()
        return super().retrieve(request, *args, **kwargs)

class PaymentSubmitView(generics.CreateAPIView):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # Additional logic: Ensure user owns the booking if not admin
        serializer.save()

class PaymentVerifyView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]

    def post(self, request, pk):
        try:
            payment = Payment.objects.get(pk=pk)
            status_val = request.data.get('status') # verified or rejected
            if status_val in Payment.VerificationStatus.values:
                payment.verification_status = status_val
                payment.save()
                
                # If verified, mark installment as paid
                if status_val == Payment.VerificationStatus.VERIFIED and payment.installment:
                    payment.installment.is_paid = True
                    payment.installment.paid_date = payment.payment_date
                    payment.installment.save()

                return Response({"message": f"Payment {status_val} successfully"})
            return Response({"error": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST)
        except Payment.DoesNotExist:
            return Response({"error": "Payment not found"}, status=status.HTTP_404_NOT_FOUND)

class AnalyticsStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdminOrAgentRole]

    def get(self, request):
        total_views = Apartment.objects.aggregate(models.Sum('total_views'))['total_views__sum'] or 0
        apartments = Apartment.objects.all().order_by('-total_views')[:5]
        data = {
            "total_overall_views": total_views,
            "top_apartments": ApartmentSerializer(apartments, many=True).data
        }
        return Response(data)

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

        # Find user by email
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        # Authenticate
        user = authenticate(username=email, password=password)
        if not user:
            return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        # Check if active
        if not user.is_active:
            return Response({"detail": "Account is disabled"}, status=status.HTTP_401_UNAUTHORIZED)

        # Check role if provided
        if required_role and user.role != required_role:
            return Response({"detail": f"Unauthorized role. Access denied for {required_role}."}, status=status.HTTP_401_UNAUTHORIZED)

        # Generate Tokens
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
        # Soft delete: set is_active = False
        if instance.apartments.count() > 0:
            # Business logic: Cannot delete if apartments exist
            from rest_framework import serializers
            raise serializers.ValidationError({"detail": "Cannot delete project with existing apartments."})
        
        instance.is_active = False
        instance.save()

class ApartmentListAPIView(generics.ListAPIView):
    queryset = Apartment.objects.all()
    serializer_class = ApartmentSerializer

class AdminApartmentListCreateAPIView(generics.ListCreateAPIView):
    queryset = Apartment.objects.all().order_by('-id')
    serializer_class = ApartmentSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]

class AdminApartmentDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Apartment.objects.all()
    serializer_class = ApartmentSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]

class ProjectPublicListAPIView(generics.ListAPIView):
    queryset = Project.objects.filter(is_active=True)
    serializer_class = ProjectSerializer

class ProjectPublicDetailAPIView(generics.RetrieveAPIView):
    queryset = Project.objects.filter(is_active=True)
    serializer_class = ProjectSerializer

class DBHealthCheckView(APIView):
    def get(self, request):
        from core.patterns.singleton import DatabaseConnection
        db = DatabaseConnection()
        conn = db.get_connection
        # Singleton check: db1 is db2
        db2 = DatabaseConnection()
        is_singleton = db is db2
        
        return Response({
            "status": "connected",
            "is_singleton": is_singleton,
            "engine": str(conn.vendor)
        })

class AdminStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]

    def get(self, request):
        total_projects = Project.objects.filter(is_active=True).count()
        total_apartments = Apartment.objects.count()
        available_units = Apartment.objects.filter(status='available').count()
        sold_units = Apartment.objects.filter(status='sold').count()
        
        return Response({
            "total_projects": total_projects,
            "total_apartments": total_apartments,
            "available_units": available_units,
            "booked_units": sold_units # Map sold to booked for legacy UI or use sold
        })

class InquiryListAPIView(generics.ListAPIView):
    queryset = Inquiry.objects.all().order_by('-created_at')
    serializer_class = InquirySerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]

class NotificationListAPIView(generics.ListAPIView):
    queryset = Notification.objects.all().order_by('-created_at')
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

class AdminBookingListCreateAPIView(generics.ListCreateAPIView):
    queryset = Booking.objects.select_related('user', 'apartment').all().order_by('-booking_date')
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]

class AdminBookingDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Booking.objects.select_related('user', 'apartment').all()
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]

class AdminInquiryDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Inquiry.objects.select_related('user', 'apartment').all()
    serializer_class = InquirySerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]

class AdminUserListAPIView(generics.ListAPIView):
    queryset = User.objects.all().order_by('-id')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]

class AdminUserDetailAPIView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]
class ClientStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        bookings = Booking.objects.filter(user=user)
        total_paid = Payment.objects.filter(
            booking__in=bookings, 
            verification_status='verified'
        ).aggregate(models.Sum('amount'))['amount__sum'] or 0
        
        active_installments = Installment.objects.filter(
            booking__in=bookings,
            is_paid=False
        ).count()
        
        upcoming = Installment.objects.filter(
            booking__in=bookings,
            is_paid=False
        ).order_by('due_date').first()
        
        return Response({
            "active_installments": active_installments,
            "total_paid": float(total_paid),
            "upcoming_due": upcoming.due_date if upcoming else "N/A"
        })

class MyApartmentsView(generics.ListAPIView):
    serializer_class = ApartmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Return apartments associated with user's bookings or sales
        return Apartment.objects.filter(bookings__user=self.request.user).distinct()

class MyPaymentsView(generics.ListAPIView):
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Payment.objects.filter(booking__user=self.request.user).order_by('-payment_date')
