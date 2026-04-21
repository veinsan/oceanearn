# features/rewards/serializers.py
from rest_framework import serializers
from .models import RewardCatalog, RedemptionOrder, TransactionLedger


class RewardCatalogSerializer(serializers.ModelSerializer):
    stok_label = serializers.SerializerMethodField()

    class Meta:
        model  = RewardCatalog
        fields = [
            "id", "nama_reward", "deskripsi",
            "koin_dibutuhkan", "stok", "stok_label", "is_active",
        ]

    def get_stok_label(self, obj):
        if obj.stok == 0:
            return "Tidak Terbatas"
        return f"{obj.stok} tersisa"


class RedeemRequestSerializer(serializers.Serializer):
    reward_id = serializers.IntegerField()

    def validate_reward_id(self, value):
        try:
            reward = RewardCatalog.objects.get(id=value, is_active=True)
        except RewardCatalog.DoesNotExist:
            raise serializers.ValidationError("Reward tidak ditemukan atau sudah tidak aktif.")
        return value


class RedemptionOrderSerializer(serializers.ModelSerializer):
    reward_nama = serializers.CharField(source="reward.nama_reward", read_only=True)

    class Meta:
        model  = RedemptionOrder
        fields = ["id", "reward", "reward_nama", "koin_spent", "status", "created_at"]
        read_only_fields = fields


class TransactionLedgerSerializer(serializers.ModelSerializer):
    class Meta:
        model  = TransactionLedger
        fields = [
            "id", "amount", "transaction_type",
            "description", "ref_submission_id",
            "ref_redemption_id", "created_at",
        ]
        read_only_fields = fields