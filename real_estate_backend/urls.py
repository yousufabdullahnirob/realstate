from django.contrib import admin
from django.urls import path
from core import views

admin.site.site_header = "Administration"
admin.site.site_title = "Administration"
admin.site.index_title = "Welcome to Administration"

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/register/', views.RegisterView.as_view(), name='api_register'),
    path('api/login/', views.CustomLoginView.as_view(), name='api_login'),
    path('api/admin/projects/', views.ProjectListCreateAPIView.as_view(), name='admin_project_list'),
    path('api/admin/projects/<int:pk>/', views.ProjectDetailAPIView.as_view(), name='admin_project_detail'),
    path('api/projects/', views.ProjectPublicListAPIView.as_view(), name='api_project_list'),
    path('api/projects/<int:pk>/', views.ProjectPublicDetailAPIView.as_view(), name='api_project_detail'),
    path('api/apartments/', views.ApartmentListAPIView.as_view(), name='api_apartments'),
    path('api/admin/apartments/', views.AdminApartmentListCreateAPIView.as_view(), name='admin_apartment_list'),
    path('api/admin/apartments/<int:pk>/', views.AdminApartmentDetailAPIView.as_view(), name='admin_apartment_detail'),
    path('api/admin/bookings/', views.AdminBookingListCreateAPIView.as_view(), name='admin_booking_list'),
    path('api/admin/bookings/<int:pk>/', views.AdminBookingDetailAPIView.as_view(), name='admin_booking_detail'),
    path('api/admin/stats/', views.AdminStatsView.as_view(), name='admin_stats'),
    path('api/inquiries/', views.InquiryListAPIView.as_view(), name='inquiry-list'),
    path('api/admin/inquiries/<int:pk>/', views.AdminInquiryDetailAPIView.as_view(), name='admin-inquiry-detail'),
    path('api/notifications/', views.NotificationListAPIView.as_view(), name='notification-list'),
    path('api/users/', views.AdminUserListAPIView.as_view(), name='admin-users-list'),
    path('api/users/<int:pk>/', views.AdminUserDetailAPIView.as_view(), name='admin-users-detail'),
    
    # New Payment & Analytics Routes
    path('api/payments/submit/', views.PaymentSubmitView.as_view(), name='payment-submit'),
    path('api/payments/<int:pk>/verify/', views.PaymentVerifyView.as_view(), name='payment-verify'),
    path('api/analytics/stats/', views.AnalyticsStatsView.as_view(), name='analytics-stats'),
    path('api/client/stats/', views.ClientStatsView.as_view(), name='client-stats'),
    path('api/apartments/my/', views.MyApartmentsView.as_view(), name='my-apartments'),
    path('api/payments/my/', views.MyPaymentsView.as_view(), name='my-payments'),
    path('api/health/', views.DBHealthCheckView.as_view(), name='db-health'),
]
