from django.urls import path
from .views import (
    ClientStatsView, MyApartmentsView, MyPaymentsView, PaymentSubmitView,
    AdminStatsView, AnalyticsStatsView, PaymentVerifyView,
    ApartmentDetailAPIView, ApartmentListAPIView, ProjectPublicListAPIView,
    ProjectPublicDetailAPIView, MyPaymentsView,
)

urlpatterns = [
    # CLIENT APIs
    path('client/stats/', ClientStatsView.as_view(), name='client-stats'),
    path('apartments/my/', MyApartmentsView.as_view(), name='my-apartments'),
    path('payments/my/', MyPaymentsView.as_view(), name='my-payments'),
    path('payments/submit/', PaymentSubmitView.as_view(), name='submit-payment'),

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
]
