import pytest
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model

User = get_user_model()

@pytest.fixture
def api_client():
    return APIClient()

@pytest.mark.django_db
class TestCoreAuth:
    def test_login_successful(self, api_client):
        # Create a user with correct username/password
        User.objects.create_user(username="testuser@example.com", password="password123", email="testuser@example.com")
        
        response = api_client.post("/api/login/", {
            "email": "testuser@example.com",
            "password": "password123"
        })
        assert response.status_code == 200
        assert "access" in response.data

    def test_registration_successful(self, api_client):
        response = api_client.post("/api/register/", {
            "full_name": "New User",
            "email": "register@example.com",
            "password": "StrongPassword123!",
            "confirm_password": "StrongPassword123!",
            "role": "customer"
        })
        assert response.status_code == 201
        assert User.objects.filter(email="register@example.com").exists()

    def test_registration_password_mismatch(self, api_client):
        response = api_client.post("/api/register/", {
            "full_name": "New User 2",
            "email": "bad_password@example.com",
            "password": "StrongPassword123!",
            "confirm_password": "StrongPassword123_456!",
            "role": "customer"
        })
        assert response.status_code == 400
        assert "confirm_password" in response.data
