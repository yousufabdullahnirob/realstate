import pytest
from rest_framework.test import APIClient
from core.models import Project, Apartment

@pytest.fixture
def api_client():
    return APIClient()

@pytest.mark.django_db
class TestCoreAPI:
    def test_get_projects_list(self, api_client):
        Project.objects.create(name="Project 1", location="Loc 1", total_floors=1, total_units=1, launch_date="2024-01-01")
        Project.objects.create(name="Project 2", location="Loc 2", total_floors=1, total_units=1, launch_date="2024-01-01")
        
        response = api_client.get("/api/projects/")
        assert response.status_code == 200
        assert len(response.data) == 2

    def test_get_apartments_list(self, api_client):
        project = Project.objects.create(name="Real Estate Project", location="Loc", total_floors=1, total_units=1, launch_date="2024-01-01")
        Apartment.objects.create(project=project, title="Apt 1", floor_area_sqft=1000, price=10000, bedrooms=1, bathrooms=1, status="available")
        
        response = api_client.get("/api/apartments/")
        assert response.status_code == 200
        assert len(response.data) == 1

    def test_create_inquiry_requires_login(self, api_client):
        # Without authentication
        response = api_client.post("/api/inquiries/submit/", {
            "apartment": 1,
            "message": "Interested"
        })
        assert response.status_code == 401
