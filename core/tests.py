from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from core.models import Project, Apartment, Booking, Payment
import datetime

User = get_user_model()


class UserRegistrationTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_register_customer_success(self):
        """A new customer can register with valid data."""
        payload = {
            "full_name": "Test Customer",
            "email": "customer@test.com",
            "password": "SecurePass123!",
            "confirm_password": "SecurePass123!",
            "role": "customer"
        }
        res = self.client.post("/api/register/", payload, format="json")
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertIn("user_id", res.data)
        self.assertEqual(res.data["user"]["role"], "customer")

    def test_register_password_mismatch_fails(self):
        """Registration fails when passwords do not match."""
        payload = {
            "full_name": "Bad User",
            "email": "bad@test.com",
            "password": "SecurePass123!",
            "confirm_password": "WrongPass999!",
            "role": "customer"
        }
        res = self.client.post("/api/register/", payload, format="json")
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_duplicate_email_fails(self):
        """Registration with an already-used email is rejected."""
        User.objects.create_user(
            username="dup@test.com", email="dup@test.com",
            password="Pass1234!", full_name="Dup User"
        )
        payload = {
            "full_name": "Dup User2",
            "email": "dup@test.com",
            "password": "Pass1234!",
            "confirm_password": "Pass1234!",
            "role": "customer"
        }
        res = self.client.post("/api/register/", payload, format="json")
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)


class UserLoginTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin = User.objects.create_user(
            username="admin@test.com", email="admin@test.com",
            password="AdminPass1!", full_name="Admin User", role="admin"
        )
        self.customer = User.objects.create_user(
            username="customer@test.com", email="customer@test.com",
            password="CustPass1!", full_name="Cust User", role="customer"
        )

    def test_login_customer_success(self):
        """Customer can log in and receives JWT tokens."""
        res = self.client.post("/api/login/", {
            "email": "customer@test.com", "password": "CustPass1!", "role": "customer"
        }, format="json")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn("access", res.data)
        self.assertIn("refresh", res.data)

    def test_login_admin_success(self):
        """Admin can log in with role=admin."""
        res = self.client.post("/api/login/", {
            "email": "admin@test.com", "password": "AdminPass1!", "role": "admin"
        }, format="json")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data["user"]["role"], "admin")

    def test_login_wrong_role_fails(self):
        """Login with wrong role is rejected with 401."""
        res = self.client.post("/api/login/", {
            "email": "customer@test.com", "password": "CustPass1!", "role": "admin"
        }, format="json")
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_login_wrong_password_fails(self):
        """Login with wrong password is rejected."""
        res = self.client.post("/api/login/", {
            "email": "customer@test.com", "password": "WrongPass!"
        }, format="json")
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_login_nonexistent_user_fails(self):
        """Login for unknown email returns 401."""
        res = self.client.post("/api/login/", {
            "email": "ghost@test.com", "password": "Ghost123!"
        }, format="json")
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)


class ProjectAdminTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin = User.objects.create_user(
            username="admin2@test.com", email="admin2@test.com",
            password="AdminPass1!", full_name="Admin2", role="admin"
        )
        self.customer = User.objects.create_user(
            username="cust2@test.com", email="cust2@test.com",
            password="CustPass1!", full_name="Cust2", role="customer"
        )
        # Get JWT for admin
        res = self.client.post("/api/login/", {
            "email": "admin2@test.com", "password": "AdminPass1!", "role": "admin"
        }, format="json")
        self.admin_token = res.data["access"]

        # Get JWT for customer
        res2 = self.client.post("/api/login/", {
            "email": "cust2@test.com", "password": "CustPass1!", "role": "customer"
        }, format="json")
        self.cust_token = res2.data["access"]

        self.project_payload = {
            "name": "Test Block A",
            "location": "Dhaka",
            "description": "A test project",
            "total_floors": 10,
            "total_units": 40,
            "launch_date": "2026-01-01",
            "status": "upcoming"
        }

    def _admin_client(self):
        c = APIClient()
        c.credentials(HTTP_AUTHORIZATION=f"Bearer {self.admin_token}")
        return c

    def _cust_client(self):
        c = APIClient()
        c.credentials(HTTP_AUTHORIZATION=f"Bearer {self.cust_token}")
        return c

    def test_admin_can_create_project(self):
        """Admin role can create a project."""
        res = self._admin_client().post(
            "/api/admin/projects/", self.project_payload, format="json"
        )
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(res.data["name"], "Test Block A")

    def test_customer_cannot_create_project(self):
        """Customer role is forbidden from creating projects."""
        res = self._cust_client().post(
            "/api/admin/projects/", self.project_payload, format="json"
        )
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_unauthenticated_cannot_list_projects(self):
        """Unauthenticated requests to admin projects return 401."""
        res = APIClient().get("/api/admin/projects/")
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_admin_can_soft_delete_project(self):
        """Soft delete sets is_active=False instead of removing the row."""
        project = Project.objects.create(
            name="Del Project", location="CTG", total_floors=5,
            total_units=20, launch_date=datetime.date(2026, 6, 1), status="upcoming"
        )
        res = self._admin_client().delete(f"/api/admin/projects/{project.pk}/")
        self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)
        project.refresh_from_db()
        self.assertFalse(project.is_active)

    def test_cannot_delete_project_with_apartments(self):
        """Deleting a project that has apartments must be rejected."""
        project = Project.objects.create(
            name="Busy Project", location="CTG", total_floors=5,
            total_units=20, launch_date=datetime.date(2026, 6, 1)
        )
        Apartment.objects.create(
            project=project, title="Apt 1", description="desc",
            location="CTG", floor_area_sqft="900.00", price="500000.00",
            bedrooms=2, bathrooms=1
        )
        res = self._admin_client().delete(f"/api/admin/projects/{project.pk}/")
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)


class ApartmentPublicTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_apartments_list_public(self):
        """Public visitors can list apartments without authentication."""
        res = self.client.get("/api/apartments/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIsInstance(res.data, list)


class PaymentVerificationFlowTests(TestCase):
    def setUp(self):
        self.admin = User.objects.create_user(
            username="payadmin@test.com", email="payadmin@test.com",
            password="AdminPass1!", full_name="Pay Admin", role="admin"
        )
        self.customer = User.objects.create_user(
            username="paycustomer@test.com", email="paycustomer@test.com",
            password="CustPass1!", full_name="Pay Customer", role="customer"
        )

        self.project = Project.objects.create(
            name="Payment Project", location="Dhaka", description="desc",
            total_floors=8, total_units=30,
            launch_date=datetime.date(2026, 5, 1), status="upcoming"
        )
        self.apartment = Apartment.objects.create(
            project=self.project, title="Apt P1", description="desc",
            location="Dhaka", floor_area_sqft="900.00", price="5000000.00",
            bedrooms=3, bathrooms=2
        )
        self.booking = Booking.objects.create(
            booking_reference="BK-PAY-001",
            user=self.customer,
            apartment=self.apartment,
            status="pending",
            advance_amount="100000.00"
        )

        admin_login = APIClient().post("/api/login/", {
            "email": "payadmin@test.com", "password": "AdminPass1!", "role": "admin"
        }, format="json")
        self.admin_token = admin_login.data["access"]

        customer_login = APIClient().post("/api/login/", {
            "email": "paycustomer@test.com", "password": "CustPass1!", "role": "customer"
        }, format="json")
        self.customer_token = customer_login.data["access"]

    def _admin_client(self):
        c = APIClient()
        c.credentials(HTTP_AUTHORIZATION=f"Bearer {self.admin_token}")
        return c

    def _customer_client(self):
        c = APIClient()
        c.credentials(HTTP_AUTHORIZATION=f"Bearer {self.customer_token}")
        return c

    def test_customer_cannot_mark_payment_success_on_submit(self):
        res = self._customer_client().post("/api/payments/", {
            "booking": self.booking.id,
            "transaction_id": "TXN-CUST-1",
            "amount": "100000.00",
            "payment_gateway": "bKash",
            "payment_status": "success"
        }, format="json")
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_customer_submission_stays_unverified(self):
        res = self._customer_client().post("/api/payments/", {
            "booking": self.booking.id,
            "transaction_id": "TXN-CUST-2",
            "amount": "100000.00",
            "payment_gateway": "bKash"
        }, format="json")
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        payment = Payment.objects.get(id=res.data["id"])
        self.assertEqual(payment.payment_status, "failed")

    def test_admin_can_verify_payment(self):
        payment = Payment.objects.create(
            booking=self.booking,
            transaction_id="TXN-ADMIN-1",
            amount="100000.00",
            payment_gateway="bKash",
            payment_status="failed"
        )
        res = self._admin_client().patch(
            f"/api/payments/{payment.pk}/",
            {"payment_status": "success"},
            format="json"
        )
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        payment.refresh_from_db()
        self.assertEqual(payment.payment_status, "success")

    def test_customer_cannot_verify_payment_endpoint(self):
        payment = Payment.objects.create(
            booking=self.booking,
            transaction_id="TXN-CUST-BLOCK",
            amount="100000.00",
            payment_gateway="bKash",
            payment_status="failed"
        )
        res = self._customer_client().patch(
            f"/api/payments/{payment.pk}/",
            {"payment_status": "success"},
            format="json"
        )
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_customer_only_sees_own_bookings_for_payment_submission(self):
        other_customer = User.objects.create_user(
            username="othercustomer@test.com", email="othercustomer@test.com",
            password="CustPass1!", full_name="Other Customer", role="customer"
        )
        Booking.objects.create(
            booking_reference="BK-OTHER-001",
            user=other_customer,
            apartment=self.apartment,
            status="pending",
            advance_amount="50000.00"
        )

        res = self._customer_client().get("/api/bookings/my/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), 1)
        self.assertEqual(res.data[0]["booking_reference"], self.booking.booking_reference)

    def test_payment_rejects_invalid_transaction_id(self):
        res = self._customer_client().post("/api/payments/", {
            "booking": self.booking.id,
            "transaction_id": "***",
            "amount": "100000.00",
            "payment_gateway": "bKash"
        }, format="json")
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
