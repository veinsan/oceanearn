from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    is_nelayan      = models.BooleanField(default=False)
    is_admin_mitra  = models.BooleanField(default=False)
    poin_terkumpul  = models.PositiveIntegerField(default=0)
    no_hp           = models.CharField(max_length=20, blank=True, null=True)

    def __str__(self):
        return f"{self.username} ({'Nelayan' if self.is_nelayan else 'Admin'})"