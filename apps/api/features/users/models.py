# features/users/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    class Role(models.TextChoices):
        UMUM    = "umum",    "Masyarakat Umum"
        NELAYAN = "nelayan", "Nelayan"
        TPS     = "tps",     "Pengelola TPS"
        ADMIN   = "admin",   "Admin"

    role              = models.CharField(
        max_length=10, choices=Role.choices, default=Role.UMUM
    )
    no_hp             = models.CharField(max_length=20, blank=True, null=True)
    poin_terkumpul    = models.PositiveIntegerField(default=0)
    is_verified       = models.BooleanField(default=False)
    is_new_oauth_user = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"

    @property
    def is_nelayan(self):
        return self.role == self.Role.NELAYAN

    @property
    def is_tps(self):
        return self.role == self.Role.TPS

    @property
    def is_admin_mitra(self):
        return self.role == self.Role.ADMIN


# ─── TPS Profile ─────────────────────────────────────────────────────────────

class TPSProfile(models.Model):
    user              = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="tps_profile",
        limit_choices_to={"role": User.Role.TPS},
    )
    nama_tps          = models.CharField(max_length=255)
    alamat            = models.TextField()
    kecamatan         = models.CharField(max_length=100)
    kota              = models.CharField(max_length=100)
    latitude          = models.FloatField()
    longitude         = models.FloatField()
    kapasitas_kg_hari = models.FloatField(default=100.0)

    # Format: {"plastik": 2000, "logam": 1500, "kaca": 800, "organik": 500}
    # Nilai = Rupiah per kg
    harga_per_kg      = models.JSONField(default=dict)

    is_active         = models.BooleanField(default=True)
    created_at        = models.DateTimeField(auto_now_add=True)
    updated_at        = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.nama_tps} ({self.kota})"


# ─── Verification Document ────────────────────────────────────────────────────

def verification_upload_path(instance, filename):
    """
    Simpan file ke: media/verifications/<user_id>/<filename>
    Memudahkan audit — semua dokumen per user dikelompokkan.
    """
    return f"verifications/{instance.user.id}/{filename}"


class VerificationDocument(models.Model):

    class DocType(models.TextChoices):
        KTP             = "ktp",              "KTP"
        KARTU_NELAYAN   = "kartu_nelayan",    "Kartu Nelayan / Surat Keterangan"
        NIB             = "nib",              "NIB (Nomor Induk Berusaha)"
        FOTO_LOKASI_TPS = "foto_lokasi_tps",  "Foto Lokasi TPS"

    class Status(models.TextChoices):
        PENDING  = "pending",  "Menunggu Review"
        APPROVED = "approved", "Disetujui"
        REJECTED = "rejected", "Ditolak"

    user            = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="verification_documents",
    )
    role_requested  = models.CharField(
        max_length=10,
        choices=[
            (User.Role.NELAYAN, "Nelayan"),
            (User.Role.TPS,     "Pengelola TPS"),
        ],
    )
    doc_type        = models.CharField(max_length=30, choices=DocType.choices)
    file            = models.ImageField(upload_to=verification_upload_path)
    status          = models.CharField(
        max_length=10,
        choices=Status.choices,
        default=Status.PENDING,
    )
    rejection_note  = models.TextField(
        blank=True,
        help_text="Diisi Admin jika dokumen ditolak, agar user tahu alasannya."
    )
    reviewed_by     = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name="reviewed_documents",
        limit_choices_to={"role": User.Role.ADMIN},
    )
    reviewed_at     = models.DateTimeField(null=True, blank=True)
    created_at      = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user.username} — {self.get_doc_type_display()} ({self.status})"