import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status

User = get_user_model()

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def create_customer():
    user = User.objects.create_user(
        username='testcustomer',
        email='testcustomer@example.com',
        password='testpassword123',
        full_name='Test Customer',
        role='customer',
        phone='1234567890'
    )
    return user

@pytest.mark.django_db
def test_user_authentication_flow(api_client, create_customer):
    """Test JWT token generation flow for a user"""
    url = '/api/login/'
    data = {
        'email': 'testcustomer@example.com',
        'password': 'testpassword123'
    }
    response = api_client.post(url, data, format='json')
    
    assert response.status_code == status.HTTP_200_OK
    assert 'access' in response.data
    assert 'refresh' in response.data

@pytest.mark.django_db
def test_user_registration(api_client):
    """Test new user registration capability"""
    url = '/api/register/'
    data = {
        'username': 'newuser',
        'email': 'newuser@example.com',
        'password': 'newpassword123',
        'confirm_password': 'newpassword123',
        'full_name': 'New User',
        'phone': '0987654321',
        'role': 'customer'
    }
    response = api_client.post(url, data, format='json')
    
    assert response.status_code == status.HTTP_201_CREATED
    assert response.data['user']['email'] == 'newuser@example.com'
