from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _

class User(AbstractUser):
    class Role(models.TextChoices):
        ADMIN = 'admin', 'Admin'
        AGENT = 'agent', 'Agent'
        CUSTOMER = 'customer', 'Customer'

    full_name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    role = models.CharField(max_length=10, choices=Role.choices, default=Role.CUSTOMER)
    profile_image = models.URLField(max_length=500, blank=True, null=True)
    
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
    land_area = models.CharField(max_length=100, blank=True, null=True)
    orientation = models.CharField(max_length=100, blank=True, null=True)
    parking = models.CharField(max_length=100, blank=True, null=True)
    handover_date = models.CharField(max_length=100, blank=True, null=True)
    features = models.TextField(blank=True, null=True, help_text="Comma-separated features")
    extra_description = models.TextField(blank=True, null=True, help_text="Additional content like 'Incredible Result'")
    total_floors = models.PositiveIntegerField()
    total_units = models.PositiveIntegerField()
    launch_date = models.DateField()
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.UPCOMING)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class ProjectImage(models.Model):
    project = models.ForeignKey(Project, related_name='images', on_delete=models.CASCADE)
    image = models.URLField(max_length=1000, null=True, blank=True)
    
    def __str__(self):
        return f"Image for {self.project.name}"

class Apartment(models.Model):
    class Status(models.TextChoices):
        AVAILABLE = 'available', 'Available'
        BOOKED = 'booked', 'Booked'
        SOLD = 'sold', 'Sold'

    project = models.ForeignKey(Project, related_name='apartments', on_delete=models.CASCADE, null=True, blank=True)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    location = models.CharField(max_length=255)
    floor_area_sqft = models.DecimalField(max_digits=12, decimal_places=2)
    price = models.DecimalField(max_digits=20, decimal_places=2)
    bedrooms = models.IntegerField()
    bathrooms = models.IntegerField()
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.AVAILABLE)
    is_approved = models.BooleanField(default=False)
    total_views = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class ApartmentImage(models.Model):
    apartment = models.ForeignKey(Apartment, related_name='images', on_delete=models.CASCADE)
    image = models.URLField(max_length=1000, null=True, blank=True)

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
    advance_amount = models.DecimalField(max_digits=20, decimal_places=2)

    def __str__(self):
        return f"Booking {self.booking_reference}"

class Installment(models.Model):
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, related_name='installments')
    due_date = models.DateField()
    amount = models.DecimalField(max_digits=20, decimal_places=2)
    is_paid = models.BooleanField(default=False)
    paid_date = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Installment for {self.booking.booking_reference} - Due: {self.due_date}"

class Payment(models.Model):
    class PaymentStatus(models.TextChoices):
        SUCCESS = 'success', 'Success'
        FAILED = 'failed', 'Failed'
    
    class VerificationStatus(models.TextChoices):
        PENDING = 'pending', 'Pending'
        VERIFIED = 'verified', 'Verified'
        REJECTED = 'rejected', 'Rejected'

    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, related_name='payments')
    installment = models.ForeignKey(Installment, on_delete=models.SET_NULL, null=True, blank=True, related_name='payments')
    transaction_id = models.CharField(max_length=100, unique=True)
    amount = models.DecimalField(max_digits=20, decimal_places=2)
    payment_status = models.CharField(max_length=10, choices=PaymentStatus.choices, default=PaymentStatus.SUCCESS)
    verification_status = models.CharField(max_length=10, choices=VerificationStatus.choices, default=VerificationStatus.PENDING)
    payment_date = models.DateTimeField(auto_now_add=True)
    payment_gateway = models.CharField(max_length=50, default='Manual/Proof')
    payment_proof = models.FileField(upload_to='payments/', null=True, blank=True)

    def __str__(self):
        return f"Payment {self.transaction_id} - {self.verification_status}"

class Sale(models.Model):
    apartment = models.OneToOneField(Apartment, on_delete=models.CASCADE, related_name='sale')
    buyer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='purchases')
    sale_date = models.DateTimeField(auto_now_add=True)
    final_price = models.DecimalField(max_digits=20, decimal_places=2)

    def __str__(self):
        return f"Sale of {self.apartment.title}"

class Notification(models.Model):
    class Type(models.TextChoices):
        BOOKING = 'booking', 'Booking'
        INQUIRY = 'inquiry', 'Inquiry'
        PAYMENT = 'payment', 'Payment'
        APPROVAL = 'approval', 'Approval'

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    message = models.TextField()
    type = models.CharField(max_length=10, choices=Type.choices)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Notification for {self.user.email}"

class PropertyView(models.Model):
    apartment = models.ForeignKey(Apartment, on_delete=models.CASCADE, related_name='views')
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    viewed_at = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)

    def __str__(self):
        return f"View of {self.apartment.title} at {self.viewed_at}"

class Favorite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='favorites')
    apartment = models.ForeignKey(Apartment, on_delete=models.CASCADE, related_name='favorited_by')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'apartment')

    def __str__(self):
        return f"{self.user.email} favorited {self.apartment.title}"
