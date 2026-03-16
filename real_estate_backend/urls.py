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
]
