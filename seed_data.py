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
        {
            "name": "Mahim Tower 1: The Grand Horizon", 
            "loc": "35/15 Golap Bagh Main Road, Jatrabari, Dhaka", 
            "status": "completed",
            "image": "/assets/projects/mahim_tower1.png",
            "description": "Ideally located at 35/15 Golap Bagh Main Road, Jatrabari, Dhaka, this residence offers a perfect blend of modern comfort and everyday convenience. Designed to cater to urban families, the project provides an ideal environment that balances functionality with aesthetic appeal.\n\nResidents will enjoy seamless connectivity to major roads, educational institutions, healthcare centers, and vibrant marketplaces, making daily life effortless and enriching.",
            "land_area": "5 Katha",
            "features": "Elevator Facility, Ground Floor Parking, Rooftop Green Zone, Children’s Play Area, Prayer Room, Well-Ventilated Rooms, Functional Kitchen, Modern Architectural Design",
            "extra_description": "Our expertise lies in uniting architectural form and interior expression. We design environments that are as inspiring on the outside as they are comforting within. Each project celebrates proportion, natural light, and materials that age gracefully.\n\nFrom modern exteriors that enhance the neighborhood to interiors that invite warmth and creativity, our designs embody both sophistication and sustainability.",
            "total_floors": 10,
            "total_units": 18
        },
        {
            "name": "Mahim Tower 2: Wari Signature Residence", 
            "loc": "7 Goli, Gopibagh, Wari, Dhaka", 
            "status": "ongoing",
            "image": "/assets/projects/mahim_tower2.png",
            "description": "Located at 7 Goli, Gopibagh, Wari, Dhaka, Mahim Tower 2 offers a thoughtfully designed residential experience that blends modern architecture with everyday practicality. The project ensures comfort and convenience through spacious layouts, natural ventilation, and well-balanced design elements suited for urban family living.\n\nPositioned in a prime area of Wari, residents enjoy close proximity to schools, hospitals, markets, and key transport routes.",
            "land_area": "5.5 Katha",
            "features": "Welcoming Entrance & Reception Area, Convenient Access Roads, Reliable Elevator Service, Ground Floor Car Parking Facility, Rooftop Green Space & Community Zone, Fitness Corner / Mini Gym, Children’s Play Area, Dedicated Prayer Room, Well-Ventilated Bedrooms with Natural Light, Open Living and Dining Spaces, Functional Kitchen with Standard Fixtures, Neat and Comfortable Bathrooms, Simple & Modern Architectural Design",
            "extra_description": "We design with a belief that great architecture must live beautifully inside and out. Our projects showcase strong exterior identities that complement soft, inviting interiors. The result is a seamless integration of design and purpose—spaces that reflect character, warmth, and intelligence.\n\nOur team brings together architects, designers, and planners who share one vision: to shape environments that improve quality of life, respect the natural context, and express a distinct sense of place.",
            "total_floors": 10,
            "total_units": 27
        },
        {
            "name": "Mahim Shopping Mall: The Mugda Galleria", 
            "loc": "4 No. Manik Nagar, Mugda Para, Dhaka", 
            "status": "ongoing",
            "image": "/assets/projects/mahim_mall.png",
            "description": "Located at 4 No. Manik Nagar, Mugda Para, Dhaka, Mahim Shopping Mall stands as a landmark development that combines residential comfort with commercial convenience. Designed with a modern architectural approach, the project seamlessly integrates functionality, accessibility, and aesthetic appeal.\n\nIts strategic location ensures easy access to nearby schools, hospitals, markets, and main city routes.",
            "land_area": "17 Katha",
            "features": "Welcoming Entrance & Reception Area, Convenient Access Roads, Reliable Elevator Service, Ground Floor Car Parking Facility, Rooftop Green Space & Community Zone, Fitness Corner / Mini Gym, Children’s Play Area, Dedicated Prayer Room, Well-Ventilated Bedrooms with Natural Light, Open Living and Dining Spaces, Functional Kitchen with Standard Fixtures, Neat and Comfortable Bathrooms, Simple & Modern Architectural Design",
            "extra_description": "Our vision is to create spaces that inspire from the outside and uplift from the inside. We bring together the strength of architecture and the artistry of interior design to deliver developments that redefine modern living.\n\nEach project is an exploration of light, texture, and proportion—crafted to be functional, enduring, and beautiful.",
            "total_floors": 13,
            "total_units": 56
        },
        {
            "name": "Mahim Palace 2: Bashundhara Royal Ascent", 
            "loc": "Plot 1015 & 1024, Road-7th Sarani, Block-L, Bashundhara R/A, Dhaka", 
            "status": "ongoing",
            "image": "/assets/projects/mahim_palace2.jpg",
            "description": "Ideally positioned in Bashundhara R/A, Mahim Palace-2 offers an exceptional living experience that balances elegance, comfort, and convenience. Surrounded by top institutions such as North South University, IUB, and AIUB, and leading healthcare centers like Evercare and Bashundhara Eye Hospital.\n\nMahim Palace-2 stands as a symbol of refined urban lifestyle—crafted for families who appreciate tranquility and thoughtful design.",
            "land_area": "6 Katha",
            "orientation": "South Facing",
            "parking": "11 Nos",
            "handover_date": "June 2027",
            "features": "Grand Entrance & Reception, 40 ft & 25 ft Wide Access Roads, High-Speed Elevator, Ground Floor Parking, Rooftop Garden & Play Zone, Modern Gymnasium, Children’s Play Area, Prayer Room, Spacious Bedrooms with Large Windows, Open Living Spaces with Private Terraces, Premium Kitchen with Modern Appliances, Contemporary Architecture",
            "extra_description": "We believe exceptional living begins with design that connects the inside and the outside seamlessly. From elegant façades to thoughtfully detailed interiors, every project we undertake reflects harmony, balance, and purpose.\n\nOur team blends architectural precision with artistic sensibility to create environments that inspire.",
            "total_floors": 10,
            "total_units": 9
        },
        {
            "name": "Mahim and Sheikh View: Urban Family Nest", 
            "loc": "Golap Bagh, Dhaka", 
            "status": "completed",
            "image": "/assets/projects/mahim_sheikh_view.png",
            "description": "Located in Golap Bagh, Dhaka, Mahim & Sheikh View presents a thoughtfully designed residential address where comfort meets contemporary living. The project reflects a perfect balance between modern architecture and everyday practicality.\n\nWith convenient access to nearby schools, hospitals, and local amenities, life here is designed for ease and peace of mind.",
            "land_area": "N/A",
            "features": "Elevator Facility, Ground Floor Parking, Rooftop Green Zone, Children’s Play Area, Prayer Room, Well-Ventilated Rooms, Functional Kitchen, Modern Architectural Design",
            "extra_description": "We take pride in designing spaces that blur the boundary between exterior elegance and interior refinement. Every project is conceived with a holistic vision—one that embraces structure, environment, and experience.\n\nWhether residential or commercial, we create places that feel alive, connected, and enduring.",
            "total_floors": 8,
            "total_units": 12
        },
        {
            "name": "Mahim Rose 1: Gopibagh Signature Suites", 
            "loc": "129/130 R.K. Mission Road, 4th Lane, Gopibagh, Motijheel, Dhaka", 
            "status": "completed",
            "image": "/assets/projects/mahim_rose1.png",
            "description": "Situated at 129/130 R.K. Mission Road, 4th Lane, Gopibagh, Motijheel, Dhaka, Mahim Rose 1 offers a modern residential experience within one of Dhaka’s most accessible and vibrant neighborhoods. Thoughtfully designed to combine functionality with aesthetic appeal, the project provides a comfortable and secure environment for urban families.\n\nResidents benefit from close proximity to major commercial areas, educational institutions, healthcare facilities, and everyday conveniences.",
            "land_area": "3.5 Katha",
            "features": "Elevator Facility, Ground Floor Parking, Rooftop Green Zone, Children’s Play Area, Prayer Room, Well-Ventilated Rooms, Functional Kitchen, Modern Architectural Design",
            "extra_description": "As a company rooted in design innovation, we approach each project as a union of architecture and interior artistry. The exterior defines presence; the interior defines experience. Our designs capture both—modern façades that stand out in the urban fabric, and interiors that nurture human connection and well-being.\n\nWe balance structural intelligence with aesthetic warmth, ensuring each development becomes more than a building—it becomes a lasting lifestyle statement.",
            "total_floors": 7,
            "total_units": 18
        },
        {
            "name": "Mahim Rose 2: The Metropolitan Rose", 
            "loc": "129/B, 129/C R.K. Mission Road, 4th Lane, Gopibagh, Motijheel, Dhaka", 
            "status": "completed",
            "image": "/assets/projects/mahim_rose2.png",
            "description": "Located at 129/B, 129/C R.K. Mission Road, 4th Lane, Gopibagh, Motijheel, Dhaka, Mahim Rose 2 offers a harmonious blend of modern comfort and practical living in one of the city’s most well-connected areas. Designed with attention to detail, the project ensures an elevated lifestyle with spacious interiors, natural light, and thoughtful planning.\n\nIts central location provides residents with easy access to schools, hospitals, shopping centers, and major business hubs.",
            "land_area": "N/A",
            "features": "Elevator Facility, Ground Floor Parking, Rooftop Green Zone, Children’s Play Area, Prayer Room, Well-Ventilated Rooms, Functional Kitchen, Modern Architectural Design",
            "extra_description": "We specialize in creating complete environments that inspire from every angle. From bold architectural silhouettes to serene and stylish interiors, our projects embody design excellence at every scale. Our strength lies in seeing buildings as living ecosystems, where the exterior and interior complement each other naturally.\n\nEach space we craft reflects a sense of place, balance, and purpose. With a deep respect for nature, materials, and human emotion, we build environments that enhance how people live, work, and connect.",
            "total_floors": 7,
            "total_units": 12
        },
        {
            "name": "Mahim Palace 1: Bashundhara Elite Manor", 
            "loc": "Block I-Extension, Bashundhara R/A, Dhaka", 
            "status": "ongoing",
            "image": "/assets/projects/mahim_palace1.png",
            "description": "Refined yet practical approach to urban living in one of Dhaka’s most desirable neighborhoods."
        }
    ]

    projects = []
    for p_def in project_defs:
        p = Project.objects.create(
            name=p_def["name"],
            location=p_def["loc"],
            description=p_def["description"],
            land_area=p_def.get("land_area"),
            orientation=p_def.get("orientation"),
            parking=p_def.get("parking"),
            handover_date=p_def.get("handover_date"),
            features=p_def.get("features"),
            extra_description=p_def.get("extra_description"),
            total_floors=p_def.get("total_floors", random.randint(7, 15)),
            total_units=p_def.get("total_units", random.randint(10, 50)),
            launch_date="2023-01-01",
            status=p_def["status"]
        )
        projects.append(p)
        ProjectImage.objects.create(project=p, image_url=p_def["image"])

    print("Seeding Apartments...")
    apartment_titles = ["Royal Suite", "Penthouse Elite", "Family Haven", "Executive Living", "Lakeside View"]
    for p in projects:
        # Find the original def to get the image
        p_def = next((d for d in project_defs if d["name"] == p.name), None)
        img_url = p_def["image"] if p_def else "/assets/projects/default.png"
        
        # Create 2-3 apartments per project
        for i in range(random.randint(2, 3)):
            apt = Apartment.objects.create(
                project=p,
                title=f"{random.choice(apartment_titles)} - {p.name} {i+1}",
                description=f"Luxury living at {p.name}. Features premium finishes, smart home integration, and breathtaking views.",
                location=p.location,
                floor_area_sqft=random.randint(1500, 3500),
                price=random.randint(10000000, 50000000),
                bedrooms=random.randint(3, 5),
                bathrooms=random.randint(3, 4),
                status=random.choice(['available', 'available', 'available', 'booked', 'sold'])
            )
            ApartmentImage.objects.create(apartment=apt, image_url=img_url)

    # Seed Admin User
    admin_user, _ = User.objects.get_or_create(
        email='admin@mahimbuilders.com',
        defaults={'username': 'admin@mahimbuilders.com', 'full_name': 'Admin User', 'role': 'admin', 'is_staff': True, 'is_superuser': True}
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
