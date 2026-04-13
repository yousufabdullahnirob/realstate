import os
import django
from django.core.files import File
from PIL import Image
import io

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'real_estate_backend.settings')
django.setup()

from core.models import ProjectImage, ApartmentImage

def create_placeholder_image(name, color=(14, 165, 233)):
    img = Image.new('RGB', (800, 600), color=color)
    img_io = io.BytesIO()
    img.save(img_io, format='JPEG', quality=85)
    return File(img_io, name=name)

def seed():
    print("Seeding project images...")
    # Check for empty ImageField
    p_imgs = ProjectImage.objects.all()
    for i, pi in enumerate(p_imgs):
        if not pi.image:
            color = (14 + (i*20)%100, 165, 233)
            pi.image.save(f'project_{pi.id}.jpg', create_placeholder_image(f'p_{pi.id}.jpg', color))
            pi.save()
            print(f"Added image to {pi.project.name}")

    print("\nSeeding apartment images...")
    a_imgs = ApartmentImage.objects.all()
    for i, ai in enumerate(a_imgs):
        if not ai.image:
            color = (139 + (i*20)%50, 92, 246)
            ai.image.save(f'apartment_{ai.id}.jpg', create_placeholder_image(f'a_{ai.id}.jpg', color))
            ai.save()
            print(f"Added image to {ai.apartment.title}")

if __name__ == '__main__':
    seed()
