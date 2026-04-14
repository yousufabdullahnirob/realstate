from django.db import models
from django.http import HttpResponse
from rest_framework import status, generics, permissions, filters
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import (
    Apartment, User, Project, Inquiry, Notification, 
    ProjectImage, Payment, Installment, PropertyView, Favorite, Booking
)
from .serializers import (
    ApartmentSerializer, RegistrationSerializer, LoginSerializer, 
    UserSerializer, ProjectSerializer, InquirySerializer, 
    NotificationSerializer, PaymentSerializer, InstallmentSerializer,
    FavoriteSerializer, PasswordChangeSerializer, BookingSerializer
)
from .permissions import IsAdminRole, IsAgentRole, IsAdminOrAgentRole


class HomeView(APIView):
        permission_classes = [permissions.AllowAny]
        authentication_classes = []

        def get(self, request):
                return HttpResponse(
                        """
                        <!doctype html>
                        <html lang="en">
                            <head>
                                <meta charset="utf-8">
                                <meta name="viewport" content="width=device-width, initial-scale=1">
                                <title>Mahim Builders</title>
                                <style>
                                    body { font-family: Arial, sans-serif; margin: 0; background: #f6f7fb; color: #1f2937; }
                                    .card { max-width: 760px; margin: 10vh auto; background: white; border-radius: 16px; padding: 32px; box-shadow: 0 12px 40px rgba(0,0,0,.08); }
                                    h1 { margin-top: 0; }
                                    a { color: #0f766e; text-decoration: none; }
                                    a:hover { text-decoration: underline; }
                                    .links { display: flex; gap: 16px; flex-wrap: wrap; margin-top: 20px; }
                                </style>
                            </head>
                            <body>
                                <main class="card">
                                    <h1>Mahim Builders</h1>
                                    <p>The backend is running. Use the API or open the frontend app from the links below.</p>
                                    <div class="links">
                                        <a href="http://localhost:5173/">Open Frontend</a>
                                        <a href="/api/health/">API Health</a>
                                        <a href="/admin/">Admin</a>
                                    </div>
                                </main>
                            </body>
                        </html>
                        """,
                        content_type="text/html; charset=utf-8",
                )

class AdminUserListAPIView(generics.ListAPIView):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]

class AdminUserRoleUpdateAPIView(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]

    def perform_update(self, serializer):
        # Additional business logic for role changes if necessary
        serializer.save()# ... existing code ...

class ApartmentDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Apartment.objects.all()
    serializer_class = ApartmentSerializer
    
    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated(), IsAdminOrAgentRole()]

    def get_authenticators(self):
        if self.request.method == 'GET':
            return []
        return super().get_authenticators()

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

                # Create notification for client
                Notification.objects.create(
                    user=payment.booking.user,
                    message=f"Your payment with TrxID {payment.transaction_id} has been {status_val}.",
                    type=Notification.Type.PAYMENT
                )

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

class FilterMetadataView(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def get(self, request):
        from django.db.models import Min, Max
        apts = Apartment.objects.filter(status=Apartment.Status.AVAILABLE)
        apt_agg = apts.aggregate(min_price=Min('price'), max_price=Max('price'), min_size=Min('floor_area_sqft'), max_size=Max('floor_area_sqft'))
        locations = list(Apartment.objects.filter(status=Apartment.Status.AVAILABLE).values_list('location', flat=True).distinct().order_by('location'))
        project_locations = list(Project.objects.filter(is_active=True).values_list('location', flat=True).distinct().order_by('location'))
        bedrooms = sorted(list(Apartment.objects.filter(status=Apartment.Status.AVAILABLE).values_list('bedrooms', flat=True).distinct()))
        return Response({
            'apartment_locations': locations,
            'project_locations': project_locations,
            'bedrooms': bedrooms,
            'price_range': {
                'min': float(apt_agg['min_price'] or 0),
                'max': float(apt_agg['max_price'] or 0)
            },
            'size_range': {
                'min': float(apt_agg['min_size'] or 0),
                'max': float(apt_agg['max_size'] or 0)
            }
        })

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegistrationSerializer
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

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
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

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

class ApartmentListCreateAPIView(generics.ListCreateAPIView):
    queryset = Apartment.objects.all()
    serializer_class = ApartmentSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated(), IsAdminRole()]

    def get_authenticators(self):
        if self.request.method == 'GET':
            return []
        return super().get_authenticators()

    def get_queryset(self):
        queryset = Apartment.objects.all()
        # Public users only see available apartments
        user = self.request.user
        if not user.is_authenticated or not hasattr(user, 'role') or user.role != User.Role.ADMIN:
            queryset = queryset.filter(status=Apartment.Status.AVAILABLE)

        p = self.request.query_params

        location = p.get('location', '').strip()
        if location:
            queryset = queryset.filter(location__icontains=location)

        bedrooms = p.get('bedrooms', '').strip()
        if bedrooms:
            try:
                queryset = queryset.filter(bedrooms=int(bedrooms))
            except ValueError:
                pass

        min_price = p.get('min_price', '').strip()
        if min_price:
            try:
                queryset = queryset.filter(price__gte=float(min_price))
            except ValueError:
                pass

        max_price = p.get('max_price', '').strip()
        if max_price:
            try:
                queryset = queryset.filter(price__lte=float(max_price))
            except ValueError:
                pass

        min_size = p.get('min_size', '').strip()
        if min_size:
            try:
                queryset = queryset.filter(floor_area_sqft__gte=float(min_size))
            except ValueError:
                pass

        max_size = p.get('max_size', '').strip()
        if max_size:
            try:
                queryset = queryset.filter(floor_area_sqft__lte=float(max_size))
            except ValueError:
                pass

        return queryset

class ApartmentUpdateAPIView(generics.UpdateAPIView):
    queryset = Apartment.objects.all()
    serializer_class = ApartmentSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]

class ProjectPublicListAPIView(generics.ListAPIView):
    serializer_class = ProjectSerializer
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def get_queryset(self):
        queryset = Project.objects.filter(is_active=True)
        p = self.request.query_params

        location = p.get('location', '').strip()
        if location:
            queryset = queryset.filter(location__icontains=location)

        proj_status = p.get('status', '').strip()
        if proj_status and proj_status != 'all':
            queryset = queryset.filter(status__iexact=proj_status)

        return queryset

class ProjectPublicDetailAPIView(generics.RetrieveAPIView):
    queryset = Project.objects.filter(is_active=True)
    serializer_class = ProjectSerializer
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

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

class AdminBookingListAPIView(generics.ListAPIView):
    queryset = Booking.objects.all().order_by('-booking_date')
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]

class InquiryCreateAPIView(generics.CreateAPIView):
    queryset = Inquiry.objects.all()
    serializer_class = InquirySerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class InquiryUpdateAPIView(generics.UpdateAPIView):
    queryset = Inquiry.objects.all()
    serializer_class = InquirySerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]

class BookingCreateAPIView(generics.CreateAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        import uuid
        from decimal import Decimal
        # Generate random booking reference
        ref = f"BKG-{uuid.uuid4().hex[:8].upper()}"
        booking = serializer.save(user=self.request.user, booking_reference=ref)
        
        # Create an initial installment for the advance amount
        import datetime
        Installment.objects.create(
            booking=booking,
            due_date=datetime.date.today() + datetime.timedelta(days=7),
            amount=booking.advance_amount,
            is_paid=False
        )

class NotificationListAPIView(generics.ListAPIView):
    queryset = Notification.objects.all().order_by('-created_at')
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)
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

class MyBookingsView(generics.ListAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user).order_by('-booking_date')

class MyPaymentsView(generics.ListAPIView):
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Payment.objects.filter(booking__user=self.request.user).order_by('-payment_date')

class AdminPaymentListAPIView(generics.ListAPIView):
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]
    queryset = Payment.objects.all().order_by('-payment_date')

class AdminPendingPaymentListAPIView(generics.ListAPIView):
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]
    queryset = Payment.objects.filter(verification_status='pending').order_by('-payment_date')

class FavoriteToggleAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        apartment_id = request.data.get('apartment_id')
        if not apartment_id:
            return Response({"error": "apartment_id is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            apartment = Apartment.objects.get(id=apartment_id)
        except Apartment.DoesNotExist:
            return Response({"error": "Apartment not found"}, status=status.HTTP_404_NOT_FOUND)
        
        favorite, created = Favorite.objects.get_or_create(user=request.user, apartment=apartment)
        
        if not created:
            favorite.delete()
            return Response({"message": "Removed from favorites", "is_favorited": False})
        
        return Response({"message": "Added to favorites", "is_favorited": True}, status=status.HTTP_201_CREATED)

class FavoriteListAPIView(generics.ListAPIView):
    serializer_class = FavoriteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user)

class ProfileUpdateAPIView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user
    
    def post(self, request, *args, **kwargs):
        # Handle POST as a partial update (PATCH) for frontend compatibility
        return self.partial_update(request, *args, **kwargs)

class PasswordChangeAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = PasswordChangeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = request.user
        if not user.check_password(serializer.validated_data['old_password']):
            return Response({"old_password": ["Wrong password."]}, status=status.HTTP_400_BAD_REQUEST)
        
        user.set_password(serializer.validated_data['new_password'])
        user.save()
        return Response({"message": "Password updated successfully"})

class CreatePropertyNotificationView(APIView):
    # This could be called after creating an apartment
    permission_classes = [permissions.IsAuthenticated, IsAdminOrAgentRole]

    def post(self, request):
        apartment_name = request.data.get('apartment_name')
        # Notify all users or specific ones? For now, let's notify all customers
        customers = User.objects.filter(role=User.Role.CUSTOMER)
        notifications = [
            Notification(
                user=customer,
                message=f"New property added: {apartment_name}. Check it out!",
                type=Notification.Type.APPROVAL # Or add a NEW_PROPERTY type
            )
            for customer in customers
        ]
        Notification.objects.bulk_create(notifications)
        return Response({"message": f"Notifications sent to {len(notifications)} users"})
