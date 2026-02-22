from django.contrib import admin
from django.urls import path
from core import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.apartment_list_view, name='apartment_list'),
    path('api/apartments/', views.ApartmentListAPIView.as_view(), name='api_apartments'),
]
