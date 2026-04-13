import pytest
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from core.models import Project
from datetime import date

User = get_user_model()

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def create_project():
    return Project.objects.create(
        name='Test Project',
        description='A test project for API verification.',
        location='Test Location',
        status='upcoming',
        total_floors=5,
        total_units=10,
        launch_date=date.today()
    )

@pytest.fixture
def admin_client(api_client):
    user = User.objects.create_user(
        username='admin_user',
        email='admin@example.com',
        password='adminpassword',
        role='admin'
    )
    api_client.force_authenticate(user=user)
    return api_client

@pytest.mark.django_db
def test_project_list_public_access(api_client, create_project):
    """Verify that public users can access project list"""
    url = '/api/projects/'
    response = api_client.get(url)
    
    assert response.status_code == status.HTTP_200_OK
    assert len(response.data) > 0
    assert response.data[0]['name'] == 'Test Project'

@pytest.mark.django_db
def test_project_creation_requires_admin(api_client):
    """Verify that unauthenticated users cannot create projects"""
    url = '/api/admin/projects/'
    data = {
        'name': 'Unauthorized Project',
        'location': 'Nowhere',
        'status': 'ongoing',
        'total_floors': 2,
        'total_units': 4,
        'launch_date': '2025-01-01'
    }
    response = api_client.post(url, data, format='json')
    
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

@pytest.mark.django_db
def test_project_creation_with_admin(admin_client):
    """Verify that admin users can create projects"""
    url = '/api/admin/projects/'
    data = {
        'name': 'Authorized Project',
        'location': 'Admin Location',
        'status': 'ongoing',
        'description': 'Created by admin',
        'total_floors': 10,
        'total_units': 20,
        'launch_date': '2025-01-01'
    }
    response = admin_client.post(url, data, format='json')
    
    assert response.status_code == status.HTTP_201_CREATED
    assert response.data['name'] == 'Authorized Project'
