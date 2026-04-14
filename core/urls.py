from django.urls import path, include
from .views import (
    ClientStatsView, MyApartmentsView, MyPaymentsView, PaymentSubmitView,
    AdminStatsView, AnalyticsStatsView, AnalyticsSalesView, AnalyticsProjectsView,
    PaymentVerifyView, MyBookingsView,
    ApartmentDetailAPIView, ProjectPublicListAPIView,
    ProjectPublicDetailAPIView, FavoriteToggleAPIView,
    FavoriteListAPIView, ProfileUpdateAPIView, PasswordChangeAPIView,
    CreatePropertyNotificationView, NotificationListAPIView,
    BookingCreateAPIView, AdminBookingListAPIView, InquiryCreateAPIView,
    InquiryUpdateAPIView, InquiryListAPIView, AdminPaymentListAPIView, AdminPendingPaymentListAPIView,
    RegisterView, CustomLoginView, ProjectListCreateAPIView, ProjectDetailAPIView, DBHealthCheckView,
    ApartmentUpdateAPIView, AdminUserListAPIView, AdminUserRoleUpdateAPIView, ApartmentListCreateAPIView,
    ProtectedMediaView, BookingCancelAPIView, FilterMetadataAPIView,
    ApartmentViewSet, BookingViewSet, InstallmentViewSet, MessageViewSet, NotificationViewSet, AdminListAPIView
)
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'v2/apartments', ApartmentViewSet, basename='apartment-v2')
router.register(r'v2/bookings', BookingViewSet, basename='booking-v2')
router.register(r'v2/installments', InstallmentViewSet, basename='installment-v2')
router.register(r'v2/messages', MessageViewSet, basename='message-v2')
router.register(r'v2/notifications', NotificationViewSet, basename='notification-v2')

urlpatterns = [
    path('', include(router.urls)),
    path('v2/admins/', AdminListAPIView.as_view(), name='admin-list-v2'),
    # PUBLIC METADATA
    path('filters/metadata/', FilterMetadataAPIView.as_view(), name='filter-metadata'),

    # MEDIA
    path('media/payments/<str:filename>/', ProtectedMediaView.as_view(), name='protected-media'),

    # AUTH APIs
    path('register/', RegisterView.as_view(), name='api_register'),
    path('login/', CustomLoginView.as_view(), name='api_login'),

    # CLIENT APIs
    path('client/stats/', ClientStatsView.as_view(), name='client-stats'),
    path('apartments/my/', MyApartmentsView.as_view(), name='my-apartments'),
    path('bookings/my/', MyBookingsView.as_view(), name='my-bookings'),
    path('bookings/<int:pk>/cancel/', BookingCancelAPIView.as_view(), name='cancel-booking'),
    path('payments/my/', MyPaymentsView.as_view(), name='my-payments'),
    path('payments/submit/', PaymentSubmitView.as_view(), name='submit-payment'),
    path('favorites/', FavoriteListAPIView.as_view(), name='favorite-list'),
    path('favorites/toggle/', FavoriteToggleAPIView.as_view(), name='favorite-toggle'),
    path('profile/update/', ProfileUpdateAPIView.as_view(), name='profile-update'),
    path('profile/change-password/', PasswordChangeAPIView.as_view(), name='password-change'),
    path('notifications/', NotificationListAPIView.as_view(), name='notification-list'),
    path('bookings/create/', BookingCreateAPIView.as_view(), name='create-booking'),
    path('inquiries/submit/', InquiryCreateAPIView.as_view(), name='submit-inquiry'),

    # ADMIN APIs
    path('users/', AdminUserListAPIView.as_view(), name='admin-user-list'),
    path('users/<int:pk>/', AdminUserRoleUpdateAPIView.as_view(), name='admin-user-update'),
    path('admin/projects/', ProjectListCreateAPIView.as_view(), name='admin_project_list'),
    path('admin/projects/<int:pk>/', ProjectDetailAPIView.as_view(), name='admin_project_detail'),
    path('apartments/<int:pk>/update/', ApartmentUpdateAPIView.as_view(), name='apartment-update'),
    path('admin/stats/', AdminStatsView.as_view(), name='admin-stats'),
    path('admin/bookings/', AdminBookingListAPIView.as_view(), name='admin-bookings'),
    path('admin/inquiries/', InquiryListAPIView.as_view(), name='admin-inquiries'),
    path('admin/inquiries/<int:pk>/', InquiryUpdateAPIView.as_view(), name='update-inquiry'),
    path('payments/all/', AdminPaymentListAPIView.as_view(), name='all-payments'),
    path('payments/pending/', AdminPendingPaymentListAPIView.as_view(), name='pending-payments'),
    path('payments/<int:pk>/verify/', PaymentVerifyView.as_view(), name='verify-payment'),

    # Admin apartment routes (used by ApartmentForm.jsx)
    path('admin/apartments/', ApartmentListCreateAPIView.as_view(), name='admin-apartment-list'),
    path('admin/apartments/<int:pk>/', ApartmentDetailAPIView.as_view(), name='admin-apartment-detail'),

    # Admin inquiry list (used by AdminDashboard.jsx)
    path('inquiries/', InquiryListAPIView.as_view(), name='inquiry-list-admin'),

    # Public APIs (for completeness)
    path('apartments/', ApartmentListCreateAPIView.as_view(), name='apartment-list'),
    path('apartments/<int:pk>/', ApartmentDetailAPIView.as_view(), name='apartment-detail'),
    path('projects/', ProjectPublicListAPIView.as_view(), name='project-list'),
    path('projects/<int:pk>/', ProjectPublicDetailAPIView.as_view(), name='project-detail'),
    path('analytics/stats/', AnalyticsStatsView.as_view(), name='analytics-stats'),
    path('analytics/sales/', AnalyticsSalesView.as_view(), name='analytics-sales'),
    path('analytics/projects/', AnalyticsProjectsView.as_view(), name='analytics-projects'),
    path('admin/notify-new-property/', CreatePropertyNotificationView.as_view(), name='notify-new-property'),
    path('health/', DBHealthCheckView.as_view(), name='db-health'),
]
