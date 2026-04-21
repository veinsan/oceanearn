# features/users/permissions.py
from rest_framework.permissions import BasePermission


class IsNelayan(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == "nelayan"
            and request.user.is_verified
        )


class IsTPS(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == "tps"
            and request.user.is_verified
        )


class IsAdminMitra(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == "admin"
        )


class IsNewOAuthUser(BasePermission):
    """Hanya izinkan user yang baru OAuth dan belum pilih role."""
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.is_new_oauth_user is True
        )