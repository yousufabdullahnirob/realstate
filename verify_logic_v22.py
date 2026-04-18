import os
import django
import sys

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'real_estate_backend.settings')
django.setup()

from django.contrib.auth import authenticate
from core.models import User

def verify():
    admin_email = 'AdminMahimBuilders@gmail.com'
    admin_password = '123456789'
    
    print("--- Admin Verification ---")
    user = authenticate(username=admin_email, password=admin_password)
    if user and user.role == 'admin':
        print(f"SUCCESS: {admin_email} authenticated correctly.")
    else:
        print(f"FAILURE: Authentication for {admin_email} failed.")
        
    admin_count = User.objects.filter(role='admin').count()
    print(f"Admin Count: {admin_count} (Expected: 1)")

    print("\n--- Non-existent User Verification ---")
    fake_email = "missing_user@test.com"
    try:
        User.objects.get(email__iexact=fake_email)
        print("FAILURE: Fake user actually exists.")
    except User.DoesNotExist:
        print("SUCCESS: Fake user correctly missing from DB.")

if __name__ == "__main__":
    verify()
