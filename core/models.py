from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _

class User(AbstractUser):
    class Role(models.TextChoices):
        ADMIN = 'admin', 'Admin'
        CUSTOMER = 'customer', 'Customer'

    full_name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    role = models.CharField(max_length=10, choices=Role.choices, default=Role.CUSTOMER)
    
    # We use email as the username for login
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'full_name'] # username is required by AbstractUser but we want email login

    def __str__(self):
        return self.email

class Project(models.Model):
    class Status(models.TextChoices):
        UPCOMING = 'upcoming', 'Upcoming'
        ONGOING = 'ongoing', 'Ongoing'
        COMPLETED = 'completed', 'Completed'

    name = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    total_floors = models.PositiveIntegerField()
    total_units = models.PositiveIntegerField()
    launch_date = models.DateField()
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.UPCOMING)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Apartment(models.Model):
    class Status(models.TextChoices):
        AVAILABLE = 'available', 'Available'
        BOOKED = 'booked', 'Booked'
        SOLD = 'sold', 'Sold'

    project = models.ForeignKey(Project, related_name='apartments', on_delete=models.CASCADE, null=True, blank=True)
    title = models.CharField(max_length=255)
    description = models.TextField()
    location = models.CharField(max_length=255)
    floor_area_sqft = models.DecimalField(max_digits=10, decimal_places=2)
    price = models.DecimalField(max_digits=12, decimal_places=2)
    bedrooms = models.IntegerField()
    bathrooms = models.IntegerField()
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.AVAILABLE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class ApartmentImage(models.Model):
    apartment = models.ForeignKey(Apartment, related_name='images', on_delete=models.CASCADE)
    image_url = models.URLField(max_length=500) # Using URL for simplicity, could be ImageField

    def __str__(self):
        return f"Image for {self.apartment.title}"

class Inquiry(models.Model):
    class Status(models.TextChoices):
        NEW = 'new', 'New'
        CONTACTED = 'contacted', 'Contacted'
        CLOSED = 'closed', 'Closed'

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='inquiries')
    apartment = models.ForeignKey(Apartment, on_delete=models.CASCADE, related_name='inquiries')
    message = models.TextField()
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.NEW)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Inquiry by {self.user.email} on {self.apartment.title}"

class Booking(models.Model):
    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        CONFIRMED = 'confirmed', 'Confirmed'
        CANCELLED = 'cancelled', 'Cancelled'

    booking_reference = models.CharField(max_length=100, unique=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookings')
    apartment = models.ForeignKey(Apartment, on_delete=models.CASCADE, related_name='bookings')
    booking_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.PENDING)
    advance_amount = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"Booking {self.booking_reference}"

class Payment(models.Model):
    class PaymentStatus(models.TextChoices):
        SUCCESS = 'success', 'Success'
        FAILED = 'failed', 'Failed'

    booking = models.OneToOneField(Booking, on_delete=models.CASCADE, related_name='payment')
    transaction_id = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_status = models.CharField(max_length=10, choices=PaymentStatus.choices, default=PaymentStatus.FAILED)
    payment_date = models.DateTimeField(auto_now_add=True)
    payment_gateway = models.CharField(max_length=50, default='SSLCommerz')

    def __str__(self):
        return f"Payment for {self.booking.booking_reference}"

class Sale(models.Model):
    apartment = models.OneToOneField(Apartment, on_delete=models.CASCADE, related_name='sale')
    buyer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='purchases')
    sale_date = models.DateTimeField(auto_now_add=True)
    final_price = models.DecimalField(max_digits=12, decimal_places=2)

    def __str__(self):
        return f"Sale of {self.apartment.title}"

class Notification(models.Model):
    class Type(models.TextChoices):
        BOOKING = 'booking', 'Booking'
        INQUIRY = 'inquiry', 'Inquiry'
        PAYMENT = 'payment', 'Payment'

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    message = models.TextField()
    type = models.CharField(max_length=10, choices=Type.choices)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Notification for {self.user.email}"
