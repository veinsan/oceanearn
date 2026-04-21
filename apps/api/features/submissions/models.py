from django.db import models
from features.users.models import User, TPSProfile


def submission_upload_path(instance, filename):
    """
    Simpan foto ke: media/submissions/<user_id>/<filename>
    Dikelompokkan per user untuk kemudahan audit.
    """
    return f"submissions/{instance.user.id}/{filename}"


class WasteSubmission(models.Model):

    class Status(models.TextChoices):
        PENDING   = "pending",   "Menunggu Validasi TPS"
        VALIDATED = "validated", "Sudah Divalidasi TPS"
        REJECTED  = "rejected",  "Ditolak"

    # ── Relasi ────────────────────────────────────────────────────────────────
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="submissions",
        limit_choices_to={"role": User.Role.NELAYAN},
    )
    tps = models.ForeignKey(
        TPSProfile,
        on_delete=models.SET_NULL,
        null=True,
        related_name="incoming_submissions",
    )

    # ── Foto & Anti-fraud ─────────────────────────────────────────────────────
    foto_sampah      = models.ImageField(upload_to=submission_upload_path)
    perceptual_hash  = models.CharField(
        max_length=64,
        db_index=True,
        help_text="pHash dari foto. Dipakai untuk deteksi duplikat.",
    )

    # ── AI Estimation (diisi saat analyze, sebelum confirm) ──────────────────
    # Format: {
    #   "jenis_dominan": "plastik",
    #   "confidence": 0.87,
    #   "estimasi_koin": {"min": 200, "max": 280},
    #   "estimasi_co2_kg": 0.8,
    #   "breakdown": {"plastik": 2.5, "logam": 1.0}
    # }
    ai_estimation = models.JSONField(default=dict)

    # ── Validasi Fisik TPS (diisi TPS nanti di Phase 4) ──────────────────────
    # Format: {
    #   "berat_aktual_kg": 2.8,
    #   "jenis_aktual": "plastik",
    #   "harga_per_kg": 2000,
    #   "total_nilai_idr": 5600
    # }
    final_weight = models.JSONField(
        default=dict,
        blank=True,
        help_text="Diisi oleh TPS setelah penimbangan fisik.",
    )

    # ── Status & Timestamps ───────────────────────────────────────────────────
    status     = models.CharField(
        max_length=10,
        choices=Status.choices,
        default=Status.PENDING,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Submission #{self.id} — {self.user.username} ({self.status})"