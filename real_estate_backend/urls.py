from django.contrib import admin
from django.urls import path
from core import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/register/', views.RegisterView.as_view(), name='api_register'),
    path('api/login/', views.CustomLoginView.as_view(), name='api_login'),
    path('api/admin/projects/', views.ProjectListCreateAPIView.as_view(), name='admin_project_list'),
    path('api/admin/projects/<int:pk>/', views.ProjectDetailAPIView.as_view(), name='admin_project_detail'),
    path('api/apartments/', views.ApartmentListAPIView.as_view(), name='api_apartments'),
    path('api/admin/apartments/', views.AdminApartmentListCreateAPIView.as_view(), name='admin_apartment_list'),
    path('api/admin/apartments/<int:pk>/', views.AdminApartmentDetailAPIView.as_view(), name='admin_apartment_detail'),

    # Booking API endpoints
    path('api/admin/bookings/', views.BookingListCreateAPIView.as_view(), name='booking_list_create'),
    path('api/admin/bookings/<int:pk>/', views.BookingDetailAPIView.as_view(), name='booking_detail'),
    path('api/bookings/my/', views.CustomerBookingListAPIView.as_view(), name='customer_booking_list'),

    # Inquiry API endpoints
    path('api/admin/inquiries/', views.AdminInquiryListAPIView.as_view(), name='admin_inquiry_list'),
    path('api/admin/inquiries/<int:pk>/', views.AdminInquiryDetailAPIView.as_view(), name='admin_inquiry_detail'),

    # Notification API endpoints
    path('api/admin/notifications/', views.AdminNotificationListAPIView.as_view(), name='admin_notification_list'),
    path('api/admin/notifications/<int:pk>/', views.AdminNotificationDetailAPIView.as_view(), name='admin_notification_detail'),

    # Payment API endpoints
    path('api/payments/', views.PaymentListCreateAPIView.as_view(), name='payment_list_create'),
    path('api/payments/<int:pk>/', views.PaymentDetailAPIView.as_view(), name='payment_detail'),
]
