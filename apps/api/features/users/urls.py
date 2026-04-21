# features/users/urls.py
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from .views import RegisterView, LoginView, MeView, RoleSelectionView

urlpatterns = [
    # Email auth
    path("register/",      RegisterView.as_view(),     name="register"),
    path("login/",         LoginView.as_view(),         name="login"),
    path("token/refresh/", TokenRefreshView.as_view(),  name="token-refresh"),
    path("me/",            MeView.as_view(),             name="me"),

    # Google SSO
    path("social/",        include("dj_rest_auth.registration.urls")),
    path("google/",        include("allauth.socialaccount.urls")),

    # Post-OAuth role setup
    path("role-setup/",    RoleSelectionView.as_view(), name="role-setup"),
]