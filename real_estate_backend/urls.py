from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

admin.site.site_header = "Mahim Builders Administration"
admin.site.site_title = "Mahim Builders Admin"
admin.site.index_title = "Welcome to Mahim Builders Administration"

from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView

import os
ADMIN_PATH = os.getenv('ADMIN_URL_PATH', 'admin/')

urlpatterns = [
    path(ADMIN_PATH, admin.site.urls),
    path('api/', include('core.urls')),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
