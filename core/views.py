from django.db import models
from django.db.models import Count, Sum, Min, Max
from django.db.models.functions import TruncMonth
from django.utils import timezone
from datetime import timedelta
from rest_framework import status, generics, permissions, filters, viewsets, parsers
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import (
    Apartment, User, Project, Inquiry, Notification,
    ProjectImage, PropertyView, Favorite, Booking, Message
)
from .serializers import (
    ApartmentSerializer, RegistrationSerializer, LoginSerializer,
    UserSerializer, ProjectSerializer, InquirySerializer,
    NotificationSerializer, FavoriteSerializer, PasswordChangeSerializer, BookingSerializer, MessageSerializer
)
from .permissions import IsAdminRole, IsAgentRole, IsAdminOrAgentRole

import os
from django.conf import settings
from django.http import FileResponse, HttpResponseForbidden

class FilterMetadataAPIView(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def get(self, request):
        apt_locations = Apartment.objects.values_list('location', flat=True).distinct()
        proj_locations = Project.objects.values_list('location', flat=True).distinct()
        
        # Merge and unique locations
        all_locations = sorted(list(set(list(apt_locations) + list(proj_locations))))
        
        price_stats = Apartment.objects.aggregate(min_p=Min('price'), max_p=Max('price'))
        size_stats = Apartment.objects.aggregate(min_s=Min('floor_area_sqft'), max_s=Max('floor_area_sqft'))
        
        return Response({
            "locations": all_locations,
            "price_range": {
                "min": float(price_stats['min_p'] or 0),
                "max": float(price_stats['max_p'] or 0)
            },
            "size_range": {
                "min": float(size_stats['min_s'] or 0),
                "max": float(size_stats['max_s'] or 0)
            }
        })

class ProtectedMediaView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, filename):
        # Determine if it's a payment proof
        # For simplicity, we assume this view handles payments/ path
        try:
            payment = Payment.objects.get(payment_proof__icontains=filename)
        except Payment.DoesNotExist:
            return Response({"error": "File not found"}, status=status.HTTP_404_NOT_FOUND)

        # Security check: Admin or owner of the booking
        if request.user.role == User.Role.ADMIN or payment.booking.user == request.user:
            file_path = os.path.join(settings.MEDIA_ROOT, 'payments', filename)
            if os.path.exists(file_path):
                # Return file
                return FileResponse(open(file_path, 'rb'))
            return Response({"error": "File not found on disk"}, status=status.HTTP_404_NOT_FOUND)
        
        return HttpResponseForbidden("You do not have permission to view this file.")

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
        if self.request and self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated(), IsAdminOrAgentRole()]

    def get_authenticators(self):
        if self.request and self.request.method == 'GET':
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
        
        email = serializer.validated_data.get('email', '').strip()
        password = serializer.validated_data.get('password')
        required_role = serializer.validated_data.get('role')

        # 1. Attempt standard authentication (case-sensitive by default)
        user = authenticate(request=request, username=email, password=password)
        
        # 2. Case-insensitive fallback for email/username
        if not user:
            try:
                # Find the user case-insensitively using the email lookup
                db_user = User.objects.get(email__iexact=email)
                # Try authenticating again with the EXACT case-sensitive email from the database
                user = authenticate(request=request, username=db_user.email, password=password)
            except User.DoesNotExist:
                return Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)
            
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
    parser_classes = [parsers.MultiPartParser, parsers.FormParser, parsers.JSONParser]
    
    def get_permissions(self):
        if self.request and self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated(), IsAdminRole()]

    def get_authenticators(self):
        if self.request and self.request.method == 'GET':
            return []
        return super().get_authenticators()

    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'location']
    ordering_fields = ['created_at', 'launch_date']

    ordering = ['-created_at']

    def perform_create(self, serializer):
        # Explicitly set is_active if not provided
        serializer.save(is_active=True)

class ProjectDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Project.objects.filter(is_active=True)
    serializer_class = ProjectSerializer
    
    def get_permissions(self):
        if self.request and self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated(), IsAdminRole()]

    def get_authenticators(self):
        if self.request and self.request.method == 'GET':
            return []
        return super().get_authenticators()


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
    parser_classes = [parsers.MultiPartParser, parsers.FormParser, parsers.JSONParser]
    
    def get_permissions(self):
        if self.request and self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated(), IsAdminRole()]

    def get_authenticators(self):
        if self.request and self.request.method == 'GET':
            return []
        return super().get_authenticators()

    def get_queryset(self):
        queryset = Apartment.objects.all()
        if not self.request:
            return queryset
        
        # Filtering logic
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        location = self.request.query_params.get('location')
        size = self.request.query_params.get('size')
        
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)
        if location:
            queryset = queryset.filter(location__icontains=location)
        if size:
            # size might be "1000-1400" or just a number
            if '-' in size:
                s_min, s_max = size.split('-')
                queryset = queryset.filter(floor_area_sqft__gte=s_min, floor_area_sqft__lte=s_max)
            else:
                queryset = queryset.filter(floor_area_sqft__gte=size)
        return queryset

    ordering = ['-created_at']

    def perform_create(self, serializer):
        # Automatically approve apartments created via admin/agent interface
        serializer.save(is_approved=True)

class ApartmentUpdateAPIView(generics.UpdateAPIView):
    queryset = Apartment.objects.all()
    serializer_class = ApartmentSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]

class ProjectPublicListAPIView(generics.ListAPIView):
    queryset = Project.objects.filter(is_active=True)
    serializer_class = ProjectSerializer
    permission_classes = [permissions.AllowAny]
    authentication_classes = []
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'location']

class BookingCancelAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            booking = Booking.objects.get(pk=pk, user=request.user)
            if booking.status in ['confirmed', 'sold']:
                return Response({"error": "Cannot cancel a confirmed or sold booking."}, status=status.HTTP_400_BAD_REQUEST)
            
            booking.status = 'cancelled'
            booking.save()

            # Also mark associated apartment as available if it was booked
            apartment = booking.apartment
            if apartment.status == 'booked':
                apartment.status = 'available'
                apartment.save()

            return Response({"message": "Booking cancelled successfully", "status": "cancelled"})
        except Booking.DoesNotExist:
            return Response({"error": "Booking not found"}, status=status.HTTP_404_NOT_FOUND)

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
        booked_units = Apartment.objects.filter(status='booked').count()
        sold_units = Apartment.objects.filter(status='sold').count()
        
        return Response({
            "total_projects": total_projects,
            "total_apartments": total_apartments,
            "available_units": available_units,
            "booked_units": booked_units + sold_units,
            "project_status_counts": {
                "Upcoming": Project.objects.filter(status='upcoming', is_active=True).count(),
                "Ongoing": Project.objects.filter(status='ongoing', is_active=True).count(),
                "Completed": Project.objects.filter(status='completed', is_active=True).count(),
            }
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
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        inquiry = serializer.save(user=user)
        
        # NOTIFY ADMINS of the new inquiry
        from core.models import User, Notification
        admins = User.objects.filter(role=User.Role.ADMIN)
        for admin in admins:
            Notification.objects.create(
                user=admin,
                message=f"New Inquiry from {inquiry.email}",
                type=Notification.Type.INQUIRY
            )


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
        # Generate random booking reference
        ref = f"BKG-{uuid.uuid4().hex[:8].upper()}"
        booking = serializer.save(user=self.request.user, booking_reference=ref)

        # Update apartment status to BOOKED
        apartment = booking.apartment
        if apartment.status == Apartment.Status.AVAILABLE:
            apartment.status = Apartment.Status.BOOKED
            apartment.save()

class BookingPaymentUploadView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]

    def post(self, request, pk):
        try:
            booking = Booking.objects.get(pk=pk, user=request.user)
            if booking.status != Booking.Status.PENDING:
                return Response({"error": "Booking is not in pending status"}, status=status.HTTP_400_BAD_REQUEST)

            transaction_id = request.data.get('transaction_id')
            payment_proof = request.FILES.get('payment_proof')

            if not transaction_id or not payment_proof:
                return Response({"error": "transaction_id and payment_proof are required"}, status=status.HTTP_400_BAD_REQUEST)

            booking.transaction_id = transaction_id
            booking.payment_proof = payment_proof
            booking.save()

            return Response({"message": "Payment proof uploaded successfully"})

        except Booking.DoesNotExist:
            return Response({"error": "Booking not found"}, status=status.HTTP_404_NOT_FOUND)

class AdminBookingApproveView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]

    def post(self, request, pk):
        try:
            booking = Booking.objects.get(pk=pk)
            booking.status = Booking.Status.CONFIRMED
            booking.save()

            # Create notification for user
            Notification.objects.create(
                user=booking.user,
                message=f"Your booking {booking.booking_reference} has been approved!",
                type=Notification.Type.APPROVAL
            )

            return Response({"message": "Booking approved successfully"})

        except Booking.DoesNotExist:
            return Response({"error": "Booking not found"}, status=status.HTTP_404_NOT_FOUND)

class AdminBookingRejectView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]

    def post(self, request, pk):
        try:
            booking = Booking.objects.get(pk=pk)
            booking.status = Booking.Status.CANCELLED
            booking.save()

            # Update apartment status back to AVAILABLE
            apartment = booking.apartment
            if apartment.status == Apartment.Status.BOOKED:
                apartment.status = Apartment.Status.AVAILABLE
                apartment.save()

            # Create notification for user
            Notification.objects.create(
                user=booking.user,
                message=f"Your booking {booking.booking_reference} has been rejected.",
                type=Notification.Type.APPROVAL
            )

            return Response({"message": "Booking rejected successfully"})

        except Booking.DoesNotExist:
            return Response({"error": "Booking not found"}, status=status.HTTP_404_NOT_FOUND)

class NotificationListAPIView(generics.ListAPIView):
    queryset = Notification.objects.all().order_by('-created_at')
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if not self.request or not self.request.user or not self.request.user.is_authenticated:
            return self.queryset.none()
        # Admins should only see notifications intended for them (user=self.request.user)
        # Previously it returned all(), which included notifications for messages sent BY the admin.
        return self.queryset.filter(user=self.request.user)


class NotificationViewSet(viewsets.ModelViewSet):
    """ViewSet for individual notifications, primarily used for marking as read."""
    queryset = Notification.objects.all().order_by('-created_at')
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == User.Role.ADMIN:
            return self.queryset.all()
        return self.queryset.filter(user=self.request.user)
class ClientStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        bookings = Booking.objects.filter(user=user)
        confirmed_bookings = bookings.filter(status='confirmed').count()
        pending_bookings = bookings.filter(status='pending').count()
        total_bookings = bookings.count()
        
        return Response({
            "total_bookings": total_bookings,
            "confirmed_bookings": confirmed_bookings,
            "pending_bookings": pending_bookings
        })

class MyApartmentsView(generics.ListAPIView):
    serializer_class = ApartmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if not self.request or not self.request.user or not self.request.user.is_authenticated:
            return Apartment.objects.none()
        # Return apartments associated with user's bookings or sales
        return Apartment.objects.filter(bookings__user=self.request.user).distinct()

class MyBookingsView(generics.ListAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if not self.request or not self.request.user or not self.request.user.is_authenticated:
            return Booking.objects.none()
        return Booking.objects.filter(user=self.request.user).order_by('-booking_date')

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
        if not self.request or not self.request.user or not self.request.user.is_authenticated:
            return Favorite.objects.none()
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


class AnalyticsSalesView(APIView):
    """Returns sales breakdown data for admin dashboard charts."""
    permission_classes = [permissions.IsAuthenticated, IsAdminOrAgentRole]

    def get(self, request):
        from .models import Sale, Booking
        total_sales = Sale.objects.count()
        total_revenue = Sale.objects.aggregate(models.Sum('final_price'))['final_price__sum'] or 0
        
        # Calculate monthly sales for the last 6 months
        six_months_ago = timezone.now() - timedelta(days=180)
        monthly_sales = Sale.objects.filter(sale_date__gte=six_months_ago)\
            .annotate(month=TruncMonth('sale_date'))\
            .values('month')\
            .annotate(sales=Count('id'))\
            .order_by('month')

        monthly_sales_data = [
            {
                "month_short": entry['month'].strftime('%b'),
                "sales": entry['sales']
            } for entry in monthly_sales
        ]

        bookings_by_status = {
            'pending': Booking.objects.filter(status='pending').count(),
            'confirmed': Booking.objects.filter(status='confirmed').count(),
            'cancelled': Booking.objects.filter(status='cancelled').count(),
        }
        
        return Response({
            "total_sales": total_sales,
            "total_revenue": float(total_revenue),
            "monthly_sales": monthly_sales_data,
            "bookings_by_status": bookings_by_status,
        })


class AnalyticsProjectsView(APIView):
    """Returns project status breakdown for admin dashboard charts."""
    permission_classes = [permissions.IsAuthenticated, IsAdminOrAgentRole]

    def get(self, request):
        from .models import Project
        
        # Formatting for ProjectStatusPieChart (frontend expects array of objects)
        project_status = [
            {"label": "Upcoming", "count": Project.objects.filter(status='upcoming', is_active=True).count(), "color": "#0ea5e9"},
            {"label": "Ongoing", "count": Project.objects.filter(status='ongoing', is_active=True).count(), "color": "#fbbf24"},
            {"label": "Completed", "count": Project.objects.filter(status='completed', is_active=True).count(), "color": "#10b981"},
        ]
        
        # Filter out zero counts if needed, but component handles them
        
        apt_counts = {
            'available': Apartment.objects.filter(status='available').count(),
            'booked': Apartment.objects.filter(status='booked').count(),
            'sold': Apartment.objects.filter(status='sold').count(),
        }
        
        return Response({
            "project_status": project_status,
            "apartment_status": apt_counts,
            "total_projects": Project.objects.filter(is_active=True).count()
        })

# --- REFINED VIEWSETS ---

class ApartmentViewSet(viewsets.ModelViewSet):
    """ViewSet for managing Apartments with price validation and role-based permissions."""
    queryset = Apartment.objects.all().order_by('-created_at')
    serializer_class = ApartmentSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated(), IsAdminRole()]

class BookingViewSet(viewsets.ModelViewSet):
    """ViewSet for managing Bookings, handles reference generation and balance calculations."""
    queryset = Booking.objects.all().order_by('-booking_date')
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == User.Role.ADMIN:
            return Booking.objects.all()
        return Booking.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        import uuid
        # Generate a unique booking reference
        ref = f"BKG-{uuid.uuid4().hex[:8].upper()}"
        booking = serializer.save(user=self.request.user, booking_reference=ref)

        # SYNC: Update apartment status to BOOKED
        apartment = booking.apartment
        if apartment.status == Apartment.Status.AVAILABLE:
            apartment.status = Apartment.Status.BOOKED
            apartment.save()
            print(f"DEBUG: Apartment {apartment.id} status updated to BOOKED.")

class AdminListAPIView(generics.ListAPIView):
    """View to list all administrators, useful for starting a message thread."""
    queryset = User.objects.filter(role=User.Role.ADMIN)
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

class MessageViewSet(viewsets.ModelViewSet):
    """ViewSet for managing real-time chat messages between Clients and Admins."""
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Users can only see messages they sent or received
        return Message.objects.filter(
            models.Q(sender=self.request.user) | models.Q(receiver=self.request.user)
        ).order_by('timestamp')

    def perform_create(self, serializer):
        # Set sender as the current user
        message = serializer.save(sender=self.request.user)
        
        # LOGICAL CONFIRMATION: Automatically create a notification for the receiver
        Notification.objects.create(
            user=message.receiver,
            message=f"New message from {self.request.user.email}",
            type=Notification.Type.MESSAGE
        )
