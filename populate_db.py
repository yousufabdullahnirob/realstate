import os
import django
from datetime import date

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'real_estate_backend.settings')
django.setup()

from core.models import Project, Apartment

def populate():
    # Realistic dummy data for Mahim Builders
    projects_data = [
        {
            "name": "Skyline Residency",
            "location": "Gulshan 1, Dhaka",
            "description": "Luxurious high-rise residential complex in the heart of the city.",
            "land_area": "20 katha",
            "total_floors": 15,
            "total_units": 60,
            "launch_date": date(2023, 1, 15),
            "status": "ongoing",
        },
        {
            "name": "Green Valley Estate",
            "location": "Bashundhara R/A, Dhaka",
            "description": "Eco-friendly apartments with lush green surroundings.",
            "land_area": "15 katha",
            "total_floors": 10,
            "total_units": 40,
            "launch_date": date(2022, 5, 20),
            "status": "completed",
        },
        {
            "name": "Mahim Towers",
            "location": "Banani, Dhaka",
            "description": "Commercial and residential twin towers with cutting edge amenities.",
            "land_area": "30 katha",
            "total_floors": 20,
            "total_units": 100,
            "launch_date": date(2025, 3, 10),
            "status": "upcoming",
        },
        {
            "name": "Lakeshore Heights",
            "location": "Dhanmondi, Dhaka",
            "description": "Premium lake-view apartments with modern interiors.",
            "land_area": "12 katha",
            "total_floors": 12,
            "total_units": 48,
            "launch_date": date(2023, 11, 1),
            "status": "ongoing",
        },
        {
            "name": "Orchid View",
            "location": "Uttara Sector 11, Dhaka",
            "description": "Affordable luxury for modern families.",
            "land_area": "10 katha",
            "total_floors": 8,
            "total_units": 32,
            "launch_date": date(2021, 2, 28),
            "status": "completed",
        },
        {
            "name": "Silver Oak Condos",
            "location": "Mirpur DOHS, Dhaka",
            "description": "Secure and peaceful environment for a tranquil life.",
            "land_area": "18 katha",
            "total_floors": 14,
            "total_units": 56,
            "launch_date": date(2024, 7, 15),
            "status": "upcoming",
        },
        {
            "name": "Crescent Bay",
            "location": "Halishahar, Chittagong",
            "description": "Sea-facing dynamic apartments with open balconies.",
            "land_area": "25 katha",
            "total_floors": 16,
            "total_units": 80,
            "launch_date": date(2023, 8, 5),
            "status": "ongoing",
        },
        {
            "name": "Riverside Elegance",
            "location": "Khulshi, Chittagong",
            "description": "Experience elegance by the river with state of the art facilities.",
            "land_area": "14 katha",
            "total_floors": 10,
            "total_units": 30,
            "launch_date": date(2022, 10, 10),
            "status": "completed",
        }
    ]

    apartments_data = [
        {"title": "Luxurious 3-Bed", "price": 12000000.00, "area": 1800, "beds": 3, "baths": 3},
        {"title": "Premium 4-Bed", "price": 18500000.00, "area": 2400, "beds": 4, "baths": 4},
        {"title": "Modern 2-Bed", "price": 8500000.00, "area": 1200, "beds": 2, "baths": 2},
        {"title": "Penthouse Suite", "price": 35000000.00, "area": 3500, "beds": 5, "baths": 5},
    ]

    print("Populating database...")
    Project.objects.all().delete()
    Apartment.objects.all().delete()

    for p_data in projects_data:
        project = Project.objects.create(**p_data)
        
        # Add a couple of apartments per project
        import random
        for _ in range(random.randint(1, 3)):
            apt = random.choice(apartments_data)
            Apartment.objects.create(
                project=project,
                title=f"{apt['title']} at {project.name}",
                description=f"Beautiful {apt['title'].lower()} in {project.name}. Perfect for families.",
                location=project.location,
                floor_area_sqft=apt['area'],
                price=apt['price'],
                bedrooms=apt['beds'],
                bathrooms=apt['baths'],
                status="available",
                is_approved=True
            )
    print("Database successfully populated with 8 projects and multiple apartments.")

if __name__ == "__main__":
    populate()
