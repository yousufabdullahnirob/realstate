import os
from django.core.wsgi import get_wsgi_application

# Point Django to the actual settings module in real_estate_backend
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'real_estate_backend.settings')

application = get_wsgi_application()
app = application
