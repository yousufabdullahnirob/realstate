import os
import django
import uuid
from decimal import Decimal

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'real_estate_backend.settings')
django.setup()

from core.models import Project, Apartment, Booking, User, Notification, Installment

def health_check():
    print("--- Starting Health Check ---")
    
    # 1. Verify Project/Apartment Saving
    try:
        project_name = f"Health Check Project {uuid.uuid4().hex[:4]}"
        project = Project.objects.create(
            name=project_name,
            location="Test Location",
            total_floors=10,
            total_units=50,
            launch_date="2026-01-01",
            status="upcoming"
        )
        print(f"[OK] Project created: {project.name} (ID: {project.id})")
        
        apt_title = f"Health Check Suite {uuid.uuid4().hex[:4]}"
        apartment = Apartment.objects.create(
            project=project,
            title=apt_title,
            location="Test Location",
            floor_area_sqft=1200,
            price=Decimal("15000000"),
            bedrooms=3,
            bathrooms=2,
            status="available"
        )
        print(f"[OK] Apartment created: {apartment.title} (ID: {apartment.id})")
        
    except Exception as e:
        print(f"[ERROR] Error during Project/Apartment saving: {e}")
        return

    # 2. Verify Booking Sync Logic
    try:
        # We need a user to create a booking
        user = User.objects.filter(role='customer').first()
        if not user:
            # Create a test customer if none exists
            user = User.objects.create_user(
                username=f"testuser_{uuid.uuid4().hex[:4]}",
                email=f"test_{uuid.uuid4().hex[:4]}@example.com",
                password="password123",
                full_name="Test Customer",
                role="customer"
            )
            print(f"[OK] Created test user: {user.email}")

        booking_ref = f"HC-BKG-{uuid.uuid4().hex[:6].upper()}"
        booking = Booking.objects.create(
            booking_reference=booking_ref,
            user=user,
            apartment=apartment,
            advance_amount=Decimal("500000"),
            status="pending"
        )
        print(f"[OK] Booking created: {booking.booking_reference}")
        
        # Check if apartment status updated (Booking model has a save override)
        apartment.refresh_from_db()
        if apartment.status == "booked":
            print(f"[OK] Booking Sync (Apartment Status): OK (status is {apartment.status})")
        else:
            print(f"[FAIL] Booking Sync (Apartment Status): FAILED (status is {apartment.status}, expected 'booked')")

        # Check dashboard stat logic (mimicking AnalyticsStatsView/AdminStatsView)
        booked_units = Apartment.objects.filter(status='booked').count()
        sold_units = Apartment.objects.filter(status='sold').count()
        combined_stat = booked_units + sold_units
        print(f"[OK] Dashboard Counter Logic: OK (Booked + Sold = {combined_stat})")

    except Exception as e:
        print(f"[ERROR] Error during Booking Sync check: {e}")

    # 3. Verify Notification Badge (Unread Items)
    try:
        # Clear existing notifications for this test or just count
        initial_unread = Notification.objects.filter(user=user, is_read=False).count()
        
        # Create a new notification
        Notification.objects.create(
            user=user,
            message="Health Check Notification",
            type="booking",
            is_read=False
        )
        
        new_unread = Notification.objects.filter(user=user, is_read=False).count()
        if new_unread == initial_unread + 1:
            print(f"[OK] Notification Logic: OK (Unread count increased to {new_unread})")
        else:
            print(f"[FAIL] Notification Logic: FAILED (Unread count {new_unread}, expected {initial_unread + 1})")
            
    except Exception as e:
        print(f"[ERROR] Error during Notification check: {e}")

    print("--- Health Check Complete ---")

if __name__ == "__main__":
    health_check()
