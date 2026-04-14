import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'real_estate_backend.settings')
django.setup()

from core.models import Message, Notification, User

def debug_data():
    print("--- Message Records ---")
    msgs = Message.objects.all().order_by('-timestamp')[:5]
    for m in msgs:
        print(f"ID: {m.id}, From: {m.sender.email}, To: {m.receiver.email}, Content: {m.content[:20]}...")

    print("\n--- Notification Records ---")
    notifs = Notification.objects.all().order_by('-created_at')[:5]
    for n in notifs:
        print(f"ID: {n.id}, User: {n.user.email}, Type: {n.type}, Msg: {n.message[:30]}...")

if __name__ == "__main__":
    debug_data()
