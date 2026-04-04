import os
import django
from datetime import date

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'real_estate_backend.settings')
django.setup()

from core.models import Project, Apartment

# Some nice realistic unsplash real estate URLs
images = [
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80"
]

def update_images():
    projects = Project.objects.all()
    for i, project in enumerate(projects):
        img_url = images[i % len(images)]
        # We need to make sure Project model or ProjectImage model saves the image properly
        # Wait, the Project model itself doesn't have an 'image' field? Let me check.
        # It has extra_description, features. No image field.
        # Projects images are in ProjectImage model. Let's create ProjectImage instances!
        pass

if __name__ == "__main__":
    from core.models import ProjectImage, ApartmentImage
    
    print("Adding realistic images to existing projects...")
    ProjectImage.objects.all().delete()
    ApartmentImage.objects.all().delete()
    
    for i, project in enumerate(Project.objects.all()):
        img_url = images[i % len(images)]
        ProjectImage.objects.create(project=project, image_url=img_url)
        print(f"Added ProjectImage for {project.name}")

    # Also add images to apartments
    for apt in Apartment.objects.all():
        import random
        apt_img = images[random.randint(0, len(images)-1)]
        ApartmentImage.objects.create(apartment=apt, image_url=apt_img)
        print(f"Added ApartmentImage for {apt.title}")
        
    print("Done attaching images to database!")
