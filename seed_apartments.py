import os
import django
import random

import sys

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, BASE_DIR)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'real_estate_backend.settings')
django.setup()

from core.models import Apartment, Project, User

def seed():
    print("Starting data seeding...")
    
    # Ensure we have an admin or agent to own the properties
    owner = User.objects.filter(role__in=['admin', 'agent']).first()
    if not owner:
        print("Error: No admin/agent found. Please ensure users are created first.")
        return

    # Ensure we have a project
    project, created = Project.objects.get_or_create(
        name="Premium Lifestyle Residencies",
        defaults={
            'description': "Luxury living in the heart of Dhaka's most elite neighborhoods.",
            'location': "Dhaka, Bangladesh",
            'status': 'ongoing',
            'total_floors': 12,
            'total_units': 48,
            'launch_date': '2024-01-01'
        }
    )

    sample_apts = [
        {
            "title": "Dhanmondi Lake View Luxury",
            "location": "Dhanmondi, Dhaka",
            "price": 18500000, # 1.85 Crore
            "area": 2200,
            "bedrooms": 3,
            "bathrooms": 3,
            "description": "Quiet luxury overlooking the Dhanmondi lake. Features premium marble flooring and smart security.",
        },
        {
            "title": "Banani Sky Villa",
            "location": "Banani, Dhaka",
            "price": 24000000, # 2.4 Crore
            "area": 2800,
            "bedrooms": 4,
            "bathrooms": 4,
            "description": "Located in the prime diplomatic zone of Banani. Stunning city views and high-end fixtures.",
        },
        {
            "title": "Gulshan 2 Executive Penthouse",
            "location": "Gulshan 2, Dhaka",
            "price": 29500000, # 2.95 Crore
            "area": 3200,
            "bedrooms": 4,
            "bathrooms": 5,
            "description": "Top-floor penthouse with a private terrace. Walking distance to international clubs and parks.",
        },
        {
            "title": "Banani Road 11 Boutique Flat",
            "location": "Banani, Dhaka",
            "price": 12500000, # 1.25 Crore
            "area": 1600,
            "bedrooms": 3,
            "bathrooms": 3,
            "description": "Perfect for young professionals. Close to the best dining and shopping on Road 11.",
        },
        {
            "title": "Gulshan 1 Lake-Front Residency",
            "location": "Gulshan 1, Dhaka",
            "price": 21000000, # 2.1 Crore
            "area": 2400,
            "bedrooms": 3,
            "bathrooms": 3,
            "description": "Spacious lake-side living. Features a large balcony and state-of-the-art gym access.",
        }
    ]

    for data in sample_apts:
        apt, created = Apartment.objects.get_or_create(
            title=data['title'],
            defaults={
                'project': project,
                'location': data['location'],
                'price': data['price'],
                'floor_area_sqft': data['area'],
                'bedrooms': data['bedrooms'],
                'bathrooms': data['bathrooms'],
                'description': data['description'],
                'is_approved': True,
                'status': 'available'
            }
        )
        if created:
            print(f"Created: {apt.title}")
        else:
            print(f"Already exists: {apt.title}")

    print("Seeding complete!")

if __name__ == "__main__":
    seed()
