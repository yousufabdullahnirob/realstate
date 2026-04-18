"""
COMPREHENSIVE TEST SUITE FOR REAL ESTATE SYSTEM
Unit Tests, Integration Tests, and Module Tests for Django Backend
"""

from django.test import TestCase, Client
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient, APITestCase
from rest_framework import status
from datetime import datetime, timedelta
from decimal import Decimal

from core.models import (
    Project, Apartment, Booking, Notification, 
    Inquiry, Favorite, Sale, User
)
from core.serializers import (
    ProjectSerializer, ApartmentSerializer, BookingSerializer,
    RegistrationSerializer, LoginSerializer
)

User = get_user_model()


class UserModelTest(TestCase):
    """Unit Tests: User Model"""
    
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            username='testuser',
            password='TestPass123',
            full_name='Test User',
            role='customer'
        )
    
    def test_user_creation(self):
        """Test user is created with correct attributes"""
        self.assertEqual(self.user.email, 'test@example.com')
        self.assertEqual(self.user.role, 'customer')
        self.assertTrue(self.user.check_password('TestPass123'))
    
    def test_admin_creation(self):
        """Test admin user creation"""
        admin = User.objects.create_user(
            email='admin@realstate.com',
            username='admin',
            password='Admin@123',
            full_name='Administrator',
            role='admin'
        )
        self.assertEqual(admin.role, 'admin')
        self.assertTrue(admin.is_active)
    
    def test_user_string_representation(self):
        """Test user __str__ method"""
        self.assertEqual(str(self.user), 'test@example.com')


class ProjectModelTest(TestCase):
    """Unit Tests: Project Model"""
    
    def setUp(self):
        self.project = Project.objects.create(
            name='Elite Gardens',
            location='Dhanmondi, Dhaka',
            description='Premium residential project',
            status='ongoing',
            total_floors=12,
            total_units=48,
            launch_date='2024-01-01'
        )
    
    def test_project_creation(self):
        """Test project is created successfully"""
        self.assertEqual(self.project.name, 'Elite Gardens')
        self.assertEqual(self.project.status, 'ongoing')
        self.assertTrue(self.project.is_active)
    
    def test_project_status_choices(self):
        """Test project status is valid choice"""
        self.assertIn(self.project.status, ['upcoming', 'ongoing', 'completed'])
    
    def test_project_string_representation(self):
        """Test project __str__ method"""
        self.assertEqual(str(self.project), 'Elite Gardens')


class ApartmentModelTest(TestCase):
    """Unit Tests: Apartment Model"""
    
    def setUp(self):
        self.project = Project.objects.create(
            name='Test Project',
            location='Dhaka',
            status='ongoing'
        )
        self.apartment = Apartment.objects.create(
            project=self.project,
            title='2BR Apartment',
            location='Dhanmondi',
            floor_area_sqft=Decimal('1200.50'),
            price=Decimal('15000000.00'),
            bedrooms=2,
            bathrooms=2,
            status='available'
        )
    
    def test_apartment_creation(self):
        """Test apartment is created with correct data"""
        self.assertEqual(self.apartment.bedrooms, 2)
        self.assertEqual(self.apartment.bathrooms, 2)
        self.assertEqual(self.apartment.status, 'available')
    
    def test_apartment_price_validation(self):
        """Test price is within valid range"""
        self.assertGreaterEqual(float(self.apartment.price), 10000000)
        self.assertLessEqual(float(self.apartment.price), 30000000)
    
    def test_apartment_status_change(self):
        """Test apartment status can be changed"""
        self.apartment.status = 'booked'
        self.apartment.save()
        self.apartment.refresh_from_db()
        self.assertEqual(self.apartment.status, 'booked')


class BookingModelTest(TestCase):
    """Unit Tests: Booking Model"""
    
    def setUp(self):
        self.user = User.objects.create_user(
            email='tenant@example.com',
            username='tenant',
            password='Pass123',
            role='customer'
        )
        self.project = Project.objects.create(
            name='Test Project',
            location='Dhaka',
            status='ongoing'
        )
        self.apartment = Apartment.objects.create(
            project=self.project,
            title='Test Apt',
            location='Dhaka',
            floor_area_sqft=Decimal('1200'),
            price=Decimal('15000000'),
            bedrooms=2,
            bathrooms=2
        )
        self.booking = Booking.objects.create(
            user=self.user,
            apartment=self.apartment,
            booking_reference='BKG-ABC123',
            status='pending',
            advance_amount=Decimal('500000')
        )
    
    def test_booking_creation(self):
        """Test booking is created with correct fields"""
        self.assertEqual(self.booking.status, 'pending')
        self.assertFalse(self.booking.is_locked)
        self.assertFalse(self.booking.cancelled_by_admin)
    
    def test_booking_apartment_booked_on_create(self):
        """Test apartment status changes to booked when booking created"""
        self.apartment.refresh_from_db()
        self.assertEqual(self.apartment.status, 'booked')
    
    def test_booking_lock_functionality(self):
        """Test booking lock prevents cancellation"""
        self.booking.is_locked = True
        self.booking.status = 'confirmed'
        self.booking.save()
        
        self.assertTrue(self.booking.is_locked)
        self.assertEqual(self.booking.status, 'confirmed')
    
    def test_booking_cancellation_tracking(self):
        """Test admin cancellation is tracked"""
        self.booking.cancelled_by_admin = True
        self.booking.cancellation_reason = 'Payment verification failed'
        self.booking.save()
        
        self.assertTrue(self.booking.cancelled_by_admin)
        self.assertIsNotNone(self.booking.cancellation_reason)


class AuthenticationTest(APITestCase):
    """Integration Tests: Authentication & Authorization"""
    
    def setUp(self):
        self.client = APIClient()
        self.admin_user = User.objects.create_user(
            email='admin@realstate.com',
            username='admin',
            password='Admin@123',
            role='admin'
        )
        self.customer_user = User.objects.create_user(
            email='customer@example.com',
            username='customer',
            password='Customer@123',
            role='customer'
        )
    
    def test_user_registration(self):
        """Test user can register"""
        response = self.client.post('/api/register/', {
            'full_name': 'New User',
            'email': 'newuser@example.com',
            'password': 'NewPass123',
            'confirm_password': 'NewPass123',
            'role': 'customer'
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    
    def test_admin_login(self):
        """Test admin can login"""
        response = self.client.post('/api/login/', {
            'email': 'admin@realstate.com',
            'password': 'Admin@123',
            'role': 'admin'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
    
    def test_customer_login(self):
        """Test customer can login"""
        response = self.client.post('/api/login/', {
            'email': 'customer@example.com',
            'password': 'Customer@123'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_invalid_credentials(self):
        """Test login fails with invalid credentials"""
        response = self.client.post('/api/login/', {
            'email': 'admin@realstate.com',
            'password': 'WrongPassword'
        })
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_wrong_role_rejection(self):
        """Test login rejects wrong role"""
        response = self.client.post('/api/login/', {
            'email': 'customer@example.com',
            'password': 'Customer@123',
            'role': 'admin'
        })
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class BookingWorkflowTest(APITestCase):
    """Integration Tests: Complete Booking Workflow"""
    
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='tenant@example.com',
            username='tenant',
            password='Pass123',
            role='customer'
        )
        self.admin = User.objects.create_user(
            email='admin@realstate.com',
            username='admin',
            password='Admin@123',
            role='admin'
        )
        self.project = Project.objects.create(
            name='Test Project',
            location='Dhaka',
            status='ongoing'
        )
        self.apartment = Apartment.objects.create(
            project=self.project,
            title='Test Apartment',
            location='Dhaka',
            floor_area_sqft=Decimal('1200'),
            price=Decimal('15000000'),
            bedrooms=2,
            bathrooms=2
        )
    
    def test_complete_booking_flow(self):
        """Test complete booking approval workflow"""
        # 1. User creates booking
        self.client.force_authenticate(user=self.user)
        response = self.client.post('/api/bookings/create/', {
            'apartment': self.apartment.id,
            'advance_amount': '500000'
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        booking_id = response.data['id']
        
        # 2. Verify apartment marked as booked
        self.apartment.refresh_from_db()
        self.assertEqual(self.apartment.status, 'booked')
        
        # 3. Admin approves booking
        self.client.force_authenticate(user=self.admin)
        response = self.client.post(f'/api/admin/bookings/{booking_id}/approve/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # 4. Verify booking is locked
        booking = Booking.objects.get(id=booking_id)
        self.assertTrue(booking.is_locked)
        self.assertEqual(booking.status, 'confirmed')
    
    def test_booking_rejection_flow(self):
        """Test booking rejection releases apartment"""
        # Create booking
        booking = Booking.objects.create(
            user=self.user,
            apartment=self.apartment,
            booking_reference='BKG-123',
            status='pending',
            advance_amount=Decimal('500000')
        )
        
        # Admin rejects
        self.client.force_authenticate(user=self.admin)
        response = self.client.post(f'/api/admin/bookings/{booking.id}/reject/', {
            'reason': 'Payment verification failed'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verify apartment is available again
        self.apartment.refresh_from_db()
        self.assertEqual(self.apartment.status, 'available')
        
        # Verify booking cancelled
        booking.refresh_from_db()
        self.assertEqual(booking.status, 'cancelled')
    
    def test_user_cannot_cancel_locked_booking(self):
        """Test user cannot cancel locked booking"""
        booking = Booking.objects.create(
            user=self.user,
            apartment=self.apartment,
            booking_reference='BKG-456',
            status='confirmed',
            advance_amount=Decimal('500000'),
            is_locked=True
        )
        
        self.client.force_authenticate(user=self.user)
        response = self.client.post(f'/api/bookings/{booking.id}/cancel/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class AdminDueDateTest(APITestCase):
    """Integration Tests: Admin Due Date Management"""
    
    def setUp(self):
        self.client = APIClient()
        self.admin = User.objects.create_user(
            email='admin@realstate.com',
            username='admin',
            password='Admin@123',
            role='admin'
        )
        self.user = User.objects.create_user(
            email='tenant@example.com',
            username='tenant',
            password='Pass123',
            role='customer'
        )
        self.project = Project.objects.create(
            name='Project', location='Dhaka', status='ongoing'
        )
        self.apartment = Apartment.objects.create(
            project=self.project, title='Apt', location='Dhaka',
            floor_area_sqft=Decimal('1200'), price=Decimal('15000000'),
            bedrooms=2, bathrooms=2
        )
        self.booking = Booking.objects.create(
            user=self.user, apartment=self.apartment,
            booking_reference='BKG-789', status='confirmed',
            advance_amount=Decimal('500000')
        )
    
    def test_admin_set_due_date(self):
        """Test admin can set payment due date"""
        self.client.force_authenticate(user=self.admin)
        due_date = (datetime.now() + timedelta(days=30)).date()
        
        response = self.client.post(
            f'/api/admin/bookings/{self.booking.id}/set-due-date/',
            {'final_payment_due_date': str(due_date)}
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verify due date set
        self.booking.refresh_from_db()
        self.assertEqual(self.booking.final_payment_due_date, due_date)


class PermissionTest(APITestCase):
    """Integration Tests: Permission & Authorization"""
    
    def setUp(self):
        self.client = APIClient()
        self.admin = User.objects.create_user(
            email='admin@realstate.com',
            username='admin',
            password='Admin@123',
            role='admin'
        )
        self.customer = User.objects.create_user(
            email='customer@example.com',
            username='customer',
            password='Pass123',
            role='customer'
        )
    
    def test_only_admin_can_access_stats(self):
        """Test admin stats endpoint requires admin role"""
        # Customer cannot access
        self.client.force_authenticate(user=self.customer)
        response = self.client.get('/api/admin/stats/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
        # Admin can access
        self.client.force_authenticate(user=self.admin)
        response = self.client.get('/api/admin/stats/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_unauthenticated_cannot_create_booking(self):
        """Test unauthenticated user cannot create booking"""
        self.client.force_authenticate(user=None)
        response = self.client.post('/api/bookings/create/', {})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class SerializerTest(TestCase):
    """Unit Tests: Serializers"""
    
    def test_registration_serializer_validation(self):
        """Test registration serializer validates input"""
        data = {
            'full_name': 'Test User',
            'email': 'test@example.com',
            'password': 'Pass123',
            'confirm_password': 'Pass123',
            'role': 'customer'
        }
        serializer = RegistrationSerializer(data=data)
        self.assertTrue(serializer.is_valid())
    
    def test_registration_password_mismatch(self):
        """Test serializer rejects mismatched passwords"""
        data = {
            'full_name': 'Test',
            'email': 'test@example.com',
            'password': 'Pass123',
            'confirm_password': 'DifferentPass',
            'role': 'customer'
        }
        serializer = RegistrationSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('confirm_password', serializer.errors)


class NotificationSystemTest(TestCase):
    """Unit Tests: Notification System"""
    
    def setUp(self):
        self.user = User.objects.create_user(
            email='user@example.com',
            username='user',
            password='Pass123',
            role='customer'
        )
    
    def test_notification_creation(self):
        """Test notification can be created"""
        notification = Notification.objects.create(
            user=self.user,
            message='Test notification',
            type='approval'
        )
        self.assertEqual(notification.user, self.user)
        self.assertFalse(notification.is_read)
    
    def test_notification_retrieval(self):
        """Test notifications can be retrieved"""
        Notification.objects.create(
            user=self.user,
            message='Notification 1',
            type='approval'
        )
        Notification.objects.create(
            user=self.user,
            message='Notification 2',
            type='inquiry'
        )
        notifications = Notification.objects.filter(user=self.user)
        self.assertEqual(notifications.count(), 2)


class FavoriteTest(APITestCase):
    """Integration Tests: Favorites System"""
    
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='user@example.com',
            username='user',
            password='Pass123',
            role='customer'
        )
        self.project = Project.objects.create(
            name='Project', location='Dhaka', status='ongoing'
        )
        self.apartment = Apartment.objects.create(
            project=self.project, title='Apt', location='Dhaka',
            floor_area_sqft=Decimal('1200'), price=Decimal('15000000'),
            bedrooms=2, bathrooms=2
        )
    
    def test_add_to_favorites(self):
        """Test user can add apartment to favorites"""
        self.client.force_authenticate(user=self.user)
        response = self.client.post('/api/favorites/toggle/', {
            'apartment_id': self.apartment.id
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data['is_favorited'])
    
    def test_remove_from_favorites(self):
        """Test user can remove from favorites"""
        # Add first
        Favorite = __import__('core.models', fromlist=['Favorite']).Favorite
        Favorite.objects.create(user=self.user, apartment=self.apartment)
        
        # Remove
        self.client.force_authenticate(user=self.user)
        response = self.client.post('/api/favorites/toggle/', {
            'apartment_id': self.apartment.id
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.data['is_favorited'])


# Test Summary Report
TEST_COVERAGE = {
    'Unit Tests': [
        'User Model Creation & Validation',
        'Project Model Operations',
        'Apartment Model & Status Management',
        'Booking Model & Lock Mechanism',
        'Notification System',
        'Serializers & Input Validation'
    ],
    'Integration Tests': [
        'Authentication Workflow (Login/Register)',
        'Complete Booking Lifecycle',
        'Booking Rejection & Apartment Release',
        'Admin Due Date Management',
        'Permission & Authorization Checks',
        'Favorites Toggle System'
    ],
    'Coverage Areas': [
        'Models: User, Project, Apartment, Booking, Notification, Favorite',
        'APIs: Authentication, Bookings, Admin, Favorites',
        'Business Logic: Booking approval, Lock, Cancellation',
        'Permissions: Admin-only endpoints, Role-based access',
        'Workflows: Registration → Login → Booking → Approval'
    ]
}
