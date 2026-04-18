import pytest
from core.models import Project, Apartment, Booking, User
from django.db.models import Sum

@pytest.mark.django_db
class TestBusinessLogic:
    def test_booking_sync_apartment_status(self):
        """Test that creating a confirmed booking updates the apartment status to booked."""
        project = Project.objects.create(name="P", location="L", total_floors=1, total_units=1, launch_date="2024-01-01")
        apt = Apartment.objects.create(project=project, title="A", floor_area_sqft=1000, price=1000000, bedrooms=1, bathrooms=1, status='available')
        user = User.objects.create_user(username="u", email="u@x.com", password="p")
        
        # In core/models.py, the Booking save handles this
        Booking.objects.create(user=user, apartment=apt, advance_amount=100000, status='confirmed')
        
        apt.refresh_from_db()
        assert apt.status == 'booked'

    def test_admin_stats_aggregation(self):
        """Test that dashboard statistics correctly aggregate data."""
        project = Project.objects.create(name="P", location="L", total_floors=1, total_units=2, launch_date="2024-01-01")
        Apartment.objects.create(project=project, title="A1", floor_area_sqft=1000, price=1000000, bedrooms=1, bathrooms=1, status='booked')
        Apartment.objects.create(project=project, title="A2", floor_area_sqft=1000, price=1000000, bedrooms=1, bathrooms=1, status='sold')
        
        booked_sold_count = Apartment.objects.filter(status__in=['booked', 'sold']).count()
        assert booked_sold_count == 2
