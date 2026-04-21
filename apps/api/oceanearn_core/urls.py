# oceanearn_core/urls.py
from django.contrib import admin
from django.urls     import path, include
from django.conf     import settings
from django.conf.urls.static import static

urlpatterns = [
    path("admin/",              admin.site.urls),
    path("api/v1/users/",       include("features.users.urls")),
    path("api/v1/submissions/", include("features.submissions.urls")),
    path("api/v1/rewards/",     include("features.rewards.urls")),
    path("accounts/",           include("allauth.urls")),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)