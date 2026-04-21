# features/users/urls.py
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView,
    LoginView,
    MeView,
    RoleSelectionView,
    TPSProfileView,
    VerificationDocumentUploadView,
    AdminVerificationListView,
    AdminVerificationReviewView,
)

urlpatterns = [
    # ── Auth ──────────────────────────────────────────────
    path("register/",      RegisterView.as_view(),     name="register"),
    path("login/",         LoginView.as_view(),         name="login"),
    path("token/refresh/", TokenRefreshView.as_view(),  name="token-refresh"),
    path("me/",            MeView.as_view(),             name="me"),
    path("role-setup/",    RoleSelectionView.as_view(), name="role-setup"),
    path("social/",        include("dj_rest_auth.registration.urls")),
    path("google/",        include("allauth.socialaccount.urls")),

    # ── TPS ───────────────────────────────────────────────
    path("tps/profile/",   TPSProfileView.as_view(),    name="tps-profile"),

    # ── Verification ──────────────────────────────────────
    path("verification/upload/",
         VerificationDocumentUploadView.as_view(),
         name="verification-upload"),

    # ── Admin ─────────────────────────────────────────────
    path("admin/verifications/",
         AdminVerificationListView.as_view(),
         name="admin-verification-list"),
    path("admin/verifications/<int:doc_id>/review/",
         AdminVerificationReviewView.as_view(),
         name="admin-verification-review"),
]