import os
import django
import random
from datetime import date, timedelta

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'real_estate_backend.settings')
django.setup()

from core.models import User, Project, Apartment, Inquiry, Notification, ProjectImage, ApartmentImage, PropertyView

def seed_data():
    print("Seeding data...")

    # 1. Create Users
    admin, _ = User.objects.get_or_create(
        email='admin@mahimbuilders.com',
        defaults={
            'username': 'admin@mahimbuilders.com',
            'full_name': 'Admin User',
            'role': User.Role.ADMIN,
            'is_staff': True,
            'is_superuser': True
        }
    )
    admin.set_password('admin123')
    admin.save()

    agent, _ = User.objects.get_or_create(
        email='agent@mahimbuilders.com',
        defaults={
            'username': 'agent@mahimbuilders.com',
            'full_name': 'Agent Nirob',
            'role': User.Role.AGENT
        }
    )
    agent.set_password('agent123')
    agent.save()

    customer, _ = User.objects.get_or_create(
        email='testuser@example.com',
        defaults={
            'username': 'testuser@example.com',
            'full_name': 'Yousuf Abdullah',
            'role': User.Role.CUSTOMER
        }
    )
    customer.set_password('user123')
    customer.save()

    # 2. Projects & Images (Unique Professional Images)
    projects_info = [
        {
            'name': 'Mahim Sky View', 'location': 'Banani, Dhaka', 
            'images': ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80']
        },
        {
            'name': 'Heritage Heights', 'location': 'Gulshan 2, Dhaka',
            'images': ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80']
        },
        {
            'name': 'Emerald Gardens', 'location': 'Uttara, Dhaka',
            'images': ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80']
        }
    ]

    # Clean existing
    Project.objects.all().delete()
    Apartment.objects.all().delete()
    Inquiry.objects.all().delete()
    Notification.objects.all().delete()
    ApartmentImage.objects.all().delete()
    ProjectImage.objects.all().delete()
    
    # Image pool (Unique URLs)
    image_pool = [
        "https://images.unsplash.com/photo-1621415263481-9964d4206689?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1621259182978-fbf9312269b8?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1590644365607-1c5a519a7a37?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1623298317883-6b70254ef39a?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1621259181231-158296339ac0?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1600566752355-35792bed65ec?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1600607687940-4e2889315d?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1600607687644-c7171b424982?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1600607688066-890987f18a86?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1600572235204-5e0edc38e214?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1600585154542-6379b74459db?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1600121848594-d8641e576d13?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1600607687940-4e2889315d?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1600566752229-1269ed0ac274?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1600121848594-d8641e576d13?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1600566752355-35792bed65ec?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80"
    ]
    random.shuffle(image_pool)

    def get_unique_image():
        return image_pool.pop() if image_pool else "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80"

    print("Seeding Projects...")
    project_defs = [
        {"name": "Mahim Sky View", "loc": "Plot 12, Road 45, Gulshan-2, Dhaka", "status": "ongoing"},
        {"name": "Heritage Heights", "loc": "Sector 7, Uttara, Dhaka", "status": "completed"},
        {"name": "Elite Plaza", "loc": "Banani Block E, Dhaka", "status": "upcoming"},
        {"name": "Green Valley Residency", "loc": "Purbachal New Town, Dhaka", "status": "ongoing"}
    ]
    projects = []
    for p_def in project_defs:
        p = Project.objects.create(
            name=p_def["name"],
            location=p_def["loc"],
            description=f"Premium {p_def['name']} located in {p_def['loc']}. High-end architectural design with premium finishings.",
            total_floors=random.randint(10, 25),
            total_units=random.randint(40, 100),
            launch_date="2024-01-01",
            status=p_def["status"]
        )
        projects.append(p)
        ProjectImage.objects.create(project=p, image_url=get_unique_image())

    print("Seeding Apartments...")
    apartment_titles = ["Royal Suite", "Penthouse Elite", "Family Haven", "Executive Living", "Lakeside View"]
    for i in range(15):
        project = random.choice(projects)
        apt = Apartment.objects.create(
            project=project,
            title=f"{random.choice(apartment_titles)} - {i+1}",
            description="Luxury apartment with premium wooden flooring, smart home features, and an expansive balcony for natural light.",
            location=project.location,
            floor_area_sqft=random.randint(1500, 3500),
            price=random.randint(10000000, 50000000), # 1Cr - 5Cr BDT
            bedrooms=random.randint(3, 5),
            bathrooms=random.randint(3, 4),
            status=random.choice(['available', 'available', 'available', 'booked', 'sold'])
        )
        ApartmentImage.objects.create(apartment=apt, image_url=get_unique_image())

    # Seed Admin User if not exists
    admin_user, _ = User.objects.get_or_create(
        email='admin@realstate.com',
        defaults={'username': 'admin@realstate.com', 'full_name': 'Super Admin', 'role': 'admin', 'is_staff': True, 'is_superuser': True}
    )
    admin_user.set_password('admin123')
    admin_user.save()

    # Seed Customer User
    customer_user, _ = User.objects.get_or_create(
        email='customer@realstate.com',
        defaults={'username': 'customer@realstate.com', 'full_name': 'Rahim Ahmed', 'role': 'customer'}
    )
    customer_user.set_password('pass123')
    customer_user.save()

    print("Seeding Inquiries & Notifications...")
    for _ in range(5):
        apt = Apartment.objects.order_by('?').first()
        Inquiry.objects.create(
            user=customer_user,
            apartment=apt,
            message=f"I am interested in {apt.title}. Please provide more details about the price and floor plan.",
            status='new'
        )
        Notification.objects.create(
            user=admin_user,
            message=f"New inquiry from {customer_user.full_name} for {apt.title}",
            type='inquiry'
        )

    print("Done seeding data!")

if __name__ == "__main__":
    seed_data()
