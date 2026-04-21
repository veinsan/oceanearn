from django.db import transaction as db_transaction
from features.users.models import User
from .models import RewardCatalog, RedemptionOrder, TransactionLedger


def debit_koin(
    user: User,
    amount: int,
    description: str,
    ref_redemption_id: int = None,
) -> TransactionLedger:
    """
    Kurangi koin user dan catat di ledger.
    Selalu dipanggil dalam atomic transaction.
    """
    user.poin_terkumpul -= amount
    user.save(update_fields=["poin_terkumpul"])

    return TransactionLedger.objects.create(
        user              = user,
        amount            = -amount,   # Negatif untuk redeem
        transaction_type  = TransactionLedger.TransactionType.REDEEM,
        description       = description,
        ref_redemption_id = ref_redemption_id,
    )


def process_redemption(user: User, reward: RewardCatalog) -> RedemptionOrder:
    """
    Proses penukaran hadiah.

    Urutan atomik:
      1. Validasi saldo cukup
      2. Validasi stok (jika terbatas)
      3. Buat RedemptionOrder
      4. Debit koin + catat ledger
      5. Kurangi stok jika perlu

    Raises:
        ValueError — saldo tidak cukup atau stok habis
    """
    if user.poin_terkumpul < reward.koin_dibutuhkan:
        raise ValueError(
            f"Saldo koin tidak cukup. "
            f"Dibutuhkan: {reward.koin_dibutuhkan}, "
            f"Dimiliki: {user.poin_terkumpul}."
        )

    if reward.stok > 0:
        # stok == 0 artinya tidak terbatas, skip check
        if reward.stok < 1:
            raise ValueError(f"Stok reward '{reward.nama_reward}' sudah habis.")

    with db_transaction.atomic():
        # Buat order dulu — dapat ID untuk ref ledger
        order = RedemptionOrder.objects.create(
            user       = user,
            reward     = reward,
            koin_spent = reward.koin_dibutuhkan,
            status     = RedemptionOrder.Status.PENDING,
        )

        # Debit koin + ledger
        debit_koin(
            user              = user,
            amount            = reward.koin_dibutuhkan,
            description       = f"Penukaran: {reward.nama_reward}",
            ref_redemption_id = order.id,
        )

        # Kurangi stok jika terbatas
        if reward.stok > 0:
            reward.stok -= 1
            reward.save(update_fields=["stok"])

        # Update status order ke success
        order.status = RedemptionOrder.Status.SUCCESS
        order.save(update_fields=["status"])

    return order