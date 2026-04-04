import os
import django
from datetime import date

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'real_estate_backend.settings')
django.setup()

from core.models import Project, Apartment, ProjectImage

def populate_exact():
    # Exact original projects from projectsData.js
    projects_data = [
      {
        "name": 'Mahim Tower 1: The Grand Horizon',
        "location": '35/15 Golap Bagh Main Road, Jatrabari, Dhaka',
        "status": 'completed',
        "image_url": 'http://localhost:5173/src/assets/mahim_tower1.png',
        "description": "Ideally located at 35/15 Golap Bagh Main Road, Jatrabari, Dhaka, this residence offers a perfect blend of modern comfort and everyday convenience.",
        "extra_description": "",
        "land_area": "5 Katha",
        "total_floors": 10,
        "total_units": 18,
        "launch_date": date(2020, 1, 1)
      },
      {
        "name": 'Mahim Tower 2: Wari Signature Residence',
        "location": '7 Goli, Gopibagh, Wari, Dhaka',
        "status": 'ongoing',
        "image_url": 'http://localhost:5173/src/assets/mahim_tower2.png',
        "description": "Located at 7 Goli, Gopibagh, Wari, Dhaka, Mahim Tower 2 offers a thoughtfully designed residential experience.",
        "extra_description": "We design with a belief that great architecture must live beautifully inside and out.",
        "land_area": "5.5 Katha",
        "total_floors": 10,
        "total_units": 27,
        "launch_date": date(2022, 1, 1)
      },
      {
        "name": 'Mahim Shopping Mall: The Mugda Galleria',
        "location": '4 No. Manik Nagar, Mugda Para, Dhaka',
        "status": 'ongoing',
        "image_url": 'http://localhost:5173/src/assets/mahim_mall.png',
        "description": "Located at 4 No. Manik Nagar, Mugda Para, Dhaka, Mahim Shopping Mall stands as a landmark development that combines residential comfort with commercial convenience.",
        "extra_description": "Our vision is to create spaces that inspire from the outside and uplift from the inside.",
        "land_area": "17 Katha",
        "total_floors": 13, # B+G+9 (Total G+12) mapping to 13
        "total_units": 56,
        "launch_date": date(2023, 1, 1)
      },
      {
        "name": 'Mahim Palace 2: Bashundhara Royal Ascent',
        "location": 'Plot 1015 & 1024, Road-7th Sarani/47, Block-L, Bashundhara R/A, Dhaka',
        "status": 'ongoing',
        "image_url": 'http://localhost:5173/src/assets/mahim_palace2.jpg',
        "description": "Ideally positioned in Bashundhara R/A, Mahim Palace-2 offers an exceptional living experience that balances elegance, comfort, and convenience.",
        "extra_description": "We believe exceptional living begins with design that connects the inside and the outside seamlessly.",
        "orientation": "South Facing",
        "land_area": "6 Katha",
        "parking": "11 Nos",
        "handover_date": "June 2027",
        "total_floors": 10,
        "total_units": 9,
        "launch_date": date(2024, 1, 1)
      },
      {
        "name": 'Mahim and Sheikh View: Urban Family Nest',
        "location": 'Golap Bagh, Dhaka',
        "status": 'completed',
        "image_url": 'http://localhost:5173/src/assets/mahim_sheikh_view.png',
        "description": "Located in Golap Bagh, Dhaka, Mahim & Sheikh View presents a thoughtfully designed residential address where comfort meets contemporary living.",
        "extra_description": "We take pride in designing spaces that blur the boundary between exterior elegance and interior refinement.",
        "total_floors": 8, # G+7
        "total_units": 12,
        "launch_date": date(2019, 1, 1)
      },
      {
        "name": 'Mahim Rose 1: Gopibagh Signature Suites',
        "location": '129/130 R.K. Mission Road, 4th Lane, Gopibagh, Motijheel, Dhaka',
        "status": 'completed',
        "image_url": 'http://localhost:5173/src/assets/mahim_rose1.png',
        "description": "Situated at 129/130 R.K. Mission Road, 4th Lane, Gopibagh, Motijheel, Dhaka, Mahim Rose 1 offers a modern residential experience within one of Dhaka’s most accessible and vibrant neighborhoods.",
        "extra_description": "As a company rooted in design innovation, we approach each project as a union of architecture and interior artistry.",
        "land_area": "3.5 Katha",
        "total_floors": 7, # G+6
        "total_units": 18,
        "launch_date": date(2018, 1, 1)
      },
      {
        "name": 'Mahim Rose 2: The Metropolitan Rose',
        "location": '129/B, 129/C R.K. Mission Road, 4th Lane, Gopibagh, Motijheel, Dhaka',
        "status": 'completed',
        "image_url": 'http://localhost:5173/src/assets/mahim_rose2.png',
        "description": "Located at 129/B, 129/C R.K. Mission Road, 4th Lane, Gopibagh, Motijheel, Dhaka, Mahim Rose 2 offers a harmonious blend of modern comfort and practical living.",
        "extra_description": "We specialize in creating complete environments that inspire from every angle.",
        "total_floors": 7, # G+6
        "total_units": 12,
        "launch_date": date(2019, 5, 1)
      },
      {
        "name": 'Mahim Palace 1: Bashundhara Elite Manor',
        "location": 'Plot 2008, Road 44, Block I-Extension, Bashundhara R/A, Dhaka',
        "status": 'ongoing',
        "image_url": 'http://localhost:5173/src/assets/mahim_palace1.png',
        "description": "Situated at Plot 2008, Road 44, Block I-Extension, Bashundhara R/A, Dhaka, Mahim Palace 1 offers an elegant residential experience designed for comfort.",
        "extra_description": "We see architecture and interior design as two parts of one living story.",
        "land_area": "6 Katha",
        "total_floors": 9, # G+8
        "total_units": 8,
        "launch_date": date(2023, 6, 1)
      }
    ]

    print("Clearing projects...")
    Project.objects.all().delete()

    print("Populating exact local Mahim projects...")
    for p_data in projects_data:
        image_url = p_data.pop('image_url')
        project = Project.objects.create(**p_data)
        ProjectImage.objects.create(project=project, image_url=image_url)
        print(f"Created {project.name}")
        
        # Add 1 demo apartment just to not be empty
        Apartment.objects.create(
            project=project,
            title=f"Sample 3BHK at {project.name}",
            description=f"Standard 3BHK for {project.name}",
            location=project.location,
            floor_area_sqft=1500,
            price=12000000,
            bedrooms=3,
            bathrooms=3,
            status='available',
            is_approved=True
        )

    print("Done populating Exact Original projects!")

if __name__ == "__main__":
    populate_exact()
