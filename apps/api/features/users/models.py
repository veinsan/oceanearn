# features/users/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    class Role(models.TextChoices):
        UMUM        = "umum",        "Masyarakat Umum"
        NELAYAN     = "nelayan",     "Nelayan"
        TPS         = "tps",         "Pengelola TPS"
        ADMIN       = "admin",       "Admin"

    # Role
    role             = models.CharField(
        max_length=10,
        choices=Role.choices,
        default=Role.UMUM,
    )

    # Profile
    no_hp            = models.CharField(max_length=20, blank=True, null=True)
    poin_terkumpul   = models.PositiveIntegerField(default=0)

    # Status flags
    is_verified      = models.BooleanField(default=False)
    is_new_oauth_user = models.BooleanField(default=False)
    # True = user baru dari Google, belum pilih role
    # Frontend pakai flag ini untuk redirect ke /auth/role-setup

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"

    # Helper properties — dipakai di serializer & permission checks
    @property
    def is_nelayan(self):
        return self.role == self.Role.NELAYAN

    @property
    def is_tps(self):
        return self.role == self.Role.TPS

    @property
    def is_admin_mitra(self):
        return self.role == self.Role.ADMIN