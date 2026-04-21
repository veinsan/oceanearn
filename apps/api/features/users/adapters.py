# features/users/adapters.py
from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from allauth.socialaccount.models import SocialLogin


class OceanEarnSocialAccountAdapter(DefaultSocialAccountAdapter):
    """
    Custom adapter untuk intercept flow Google OAuth.
    Saat user BARU login via Google:
      - Set is_new_oauth_user = True
      - Set role = umum (default, akan diupdate via RoleSelectionView)
    """

    def populate_user(self, request, sociallogin: SocialLogin, data: dict):
        user = super().populate_user(request, sociallogin, data)
        return user

    def save_user(self, request, sociallogin: SocialLogin, form=None):
        user = super().save_user(request, sociallogin, form)

        # Hanya set flag untuk user yang benar-benar baru
        if sociallogin.is_existing is False:
            user.is_new_oauth_user = True
            user.role = "umum"   # Default role
            user.save(update_fields=["is_new_oauth_user", "role"])

        return user