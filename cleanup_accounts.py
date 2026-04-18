import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'real_estate_backend.settings')
django.setup()

from core.models import User

# Delete ALL admin and agent accounts
User.objects.filter(role__in=['admin', 'agent']).delete()

# Create ONE admin and ONE agent
admin, _ = User.objects.get_or_create(
    email='admin@realstate.com',
    defaults={
        'username': 'admin@realstate.com',
        'full_name': 'Administrator',
        'role': 'admin',
        'is_staff': True,
        'is_superuser': True,
        'is_active': True
    }
)
admin.set_password('Admin@123')
admin.save()

agent, _ = User.objects.get_or_create(
    email='agent@realstate.com',
    defaults={
        'username': 'agent@realstate.com',
        'full_name': 'Agent',
        'role': 'agent',
        'is_staff': False,
        'is_superuser': False,
        'is_active': True
    }
)
agent.set_password('Agent@123')
agent.save()

print("✓ Cleaned up accounts:")
print(f"  Admin: admin@realstate.com / Admin@123")
print(f"  Agent: agent@realstate.com / Agent@123")
print(f"\nTotal users: {User.objects.count()}")
print(f"Admins: {User.objects.filter(role='admin').count()}")
print(f"Agents: {User.objects.filter(role='agent').count()}")
