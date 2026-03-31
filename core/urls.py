from django.urls import path
from .views import (
    ClientStatsView, MyApartmentsView, MyPaymentsView, PaymentSubmitView,
    AdminStatsView, AnalyticsStatsView, PaymentVerifyView,
    ApartmentDetailAPIView, ApartmentListAPIView, ProjectPublicListAPIView,
    ProjectPublicDetailAPIView, MyPaymentsView, FavoriteToggleAPIView,
    FavoriteListAPIView, ProfileUpdateAPIView, PasswordChangeAPIView,
    CreatePropertyNotificationView, NotificationListAPIView
)

urlpatterns = [
    # CLIENT APIs
    path('client/stats/', ClientStatsView.as_view(), name='client-stats'),
    path('apartments/my/', MyApartmentsView.as_view(), name='my-apartments'),
    path('payments/my/', MyPaymentsView.as_view(), name='my-payments'),
    path('payments/submit/', PaymentSubmitView.as_view(), name='submit-payment'),
    path('favorites/', FavoriteListAPIView.as_view(), name='favorite-list'),
    path('favorites/toggle/', FavoriteToggleAPIView.as_view(), name='favorite-toggle'),
    path('profile/update/', ProfileUpdateAPIView.as_view(), name='profile-update'),
    path('profile/change-password/', PasswordChangeAPIView.as_view(), name='password-change'),
    path('notifications/', NotificationListAPIView.as_view(), name='notification-list'),

    # ADMIN APIs
    path('admin/stats/', AdminStatsView.as_view(), name='admin-stats'),
    path('payments/all/', MyPaymentsView.as_view(), name='all-payments'),
    path('payments/pending/', MyPaymentsView.as_view(), name='pending-payments'),
    path('payments/<int:pk>/verify/', PaymentVerifyView.as_view(), name='verify-payment'),

    # Public APIs (for completeness)
    path('apartments/', ApartmentListAPIView.as_view(), name='apartment-list'),
    path('apartments/<int:pk>/', ApartmentDetailAPIView.as_view(), name='apartment-detail'),
    path('projects/', ProjectPublicListAPIView.as_view(), name='project-list'),
    path('projects/<int:pk>/', ProjectPublicDetailAPIView.as_view(), name='project-detail'),
    path('analytics/stats/', AnalyticsStatsView.as_view(), name='analytics-stats'),
    path('admin/notify-new-property/', CreatePropertyNotificationView.as_view(), name='notify-new-property'),
]
