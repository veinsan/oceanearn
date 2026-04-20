# apps/api/oceanearn_core/urls.py
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("admin/", admin.site.urls),

    # JWT Auth endpoints
    path("api/v1/auth/token/", TokenObtainPairView.as_view(), name="token_obtain"),
    path("api/v1/auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    # Feature routers (uncomment saat sudah dibuat)
    # path("api/v1/users/", include("features.users.urls")),
    # path("api/v1/submissions/", include("features.submissions.urls")),
    # path("api/v1/rewards/", include("features.rewards.urls")),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)