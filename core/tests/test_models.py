import pytest
from django.contrib.auth import get_user_model
from core.models import Project, Apartment

User = get_user_model()

@pytest.mark.django_db
class TestCoreModels:
    def test_project_creation(self):
        project = Project.objects.create(
            name="Test Project",
            location="Test Location",
            description="Test Description",
            total_floors=10,
            total_units=20,
            launch_date="2024-01-01"
        )
        assert project.name == "Test Project"
        assert str(project) == "Test Project"

    def test_apartment_creation(self):
        project = Project.objects.create(
            name="Project A", 
            location="Loc A", 
            total_floors=5, 
            total_units=10, 
            launch_date="2024-01-01"
        )
        apartment = Apartment.objects.create(
            project=project,
            title="Apartment 101",
            floor_area_sqft=1200,
            price=5000000,
            bedrooms=3,
            bathrooms=2,
            status='available'
        )
        assert apartment.title == "Apartment 101"
        assert apartment.price == 5000000
        assert str(apartment) == "Apartment 101"

    def test_user_creation(self):
        user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="password123",
            role="customer"
        )
        assert user.email == "test@example.com"
        assert user.role == "customer"

    def test_booking_and_notification(self):
        user = User.objects.create_user(username="cust", email="c@x.com", password="p")
        project = Project.objects.create(name="P1", location="L1", total_floors=1, total_units=1, launch_date="2024-01-01")
        apt = Apartment.objects.create(project=project, title="A1", floor_area_sqft=1000, price=1000000, bedrooms=1, bathrooms=1)
        
        from core.models import Booking, Notification
        booking = Booking.objects.create(user=user, apartment=apt, advance_amount=100000)
        assert booking.status == 'pending'
        
        notif = Notification.objects.create(user=user, message="Test Notif", type="booking")
        assert notif.is_read == False
        assert str(notif) == "Notification for c@x.com"

    def test_payment_creation(self):
        user = User.objects.create_user(username="payuser", email="p@x.com", password="p")
        project = Project.objects.create(name="P2", location="L2", total_floors=1, total_units=1, launch_date="2024-01-01")
        apt = Apartment.objects.create(project=project, title="A2", floor_area_sqft=1000, price=1000000, bedrooms=1, bathrooms=1)
        from core.models import Booking, Payment
        booking = Booking.objects.create(user=user, apartment=apt, advance_amount=100000)
        
        payment = Payment.objects.create(booking=booking, transaction_id="TX123", amount=100000, payment_status="success")
        assert payment.transaction_id == "TX123"
        assert payment.payment_status == "success"
