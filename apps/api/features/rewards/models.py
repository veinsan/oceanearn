from django.db import models
from features.users.models import User


class TransactionLedger(models.Model):

    class TransactionType(models.TextChoices):
        EARN   = "earn",   "Koin Masuk (Setoran Sampah)"
        REDEEM = "redeem", "Koin Keluar (Penukaran Hadiah)"

    user             = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="transactions",
    )
    amount           = models.IntegerField(
        help_text="Positif untuk earn, negatif untuk redeem."
    )
    transaction_type = models.CharField(
        max_length=10,
        choices=TransactionType.choices,
    )
    description      = models.CharField(max_length=255)

    # Referensi opsional ke sumber transaksi — untuk audit trail
    ref_submission_id = models.IntegerField(null=True, blank=True)
    ref_redemption_id = models.IntegerField(null=True, blank=True)

    created_at       = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        sign = "+" if self.amount > 0 else ""
        return f"{self.user.username} | {sign}{self.amount} koin | {self.transaction_type}"


class RewardCatalog(models.Model):
    nama_reward      = models.CharField(max_length=255)
    deskripsi        = models.TextField(blank=True)
    koin_dibutuhkan  = models.PositiveIntegerField()
    stok             = models.PositiveIntegerField(
        default=0,
        help_text="0 = tidak terbatas."
    )
    is_active        = models.BooleanField(default=True)
    created_at       = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["koin_dibutuhkan"]

    def __str__(self):
        return f"{self.nama_reward} ({self.koin_dibutuhkan} koin)"


class RedemptionOrder(models.Model):

    class Status(models.TextChoices):
        PENDING = "pending", "Menunggu Proses"
        SUCCESS = "success", "Berhasil"
        FAILED  = "failed",  "Gagal"

    user       = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="redemptions",
    )
    reward     = models.ForeignKey(
        RewardCatalog,
        on_delete=models.PROTECT,   # PROTECT: jangan hapus reward yang pernah diredeem
        related_name="orders",
    )
    koin_spent = models.PositiveIntegerField(
        help_text="Snapshot koin saat transaksi — harga bisa berubah di catalog."
    )
    status     = models.CharField(
        max_length=10,
        choices=Status.choices,
        default=Status.PENDING,
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user.username} → {self.reward.nama_reward} ({self.status})"