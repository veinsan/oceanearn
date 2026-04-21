from rest_framework             import status
from rest_framework.response    import Response
from rest_framework.views       import APIView
from rest_framework.permissions import IsAuthenticated

from features.users.permissions import IsNelayan, IsAdminMitra
from .models      import RewardCatalog, RedemptionOrder, TransactionLedger
from .serializers import (
    RewardCatalogSerializer,
    RedeemRequestSerializer,
    RedemptionOrderSerializer,
    TransactionLedgerSerializer,
)
from .services import process_redemption


class RewardCatalogListView(APIView):
    """
    GET /api/v1/rewards/
    Semua user authenticated bisa lihat katalog.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        rewards = RewardCatalog.objects.filter(is_active=True)
        return Response(RewardCatalogSerializer(rewards, many=True).data)


class RedeemView(APIView):
    """
    POST /api/v1/rewards/redeem/
    Hanya Nelayan terverifikasi.
    """
    permission_classes = [IsNelayan]

    def post(self, request):
        serializer = RedeemRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        reward = RewardCatalog.objects.get(id=serializer.validated_data["reward_id"])

        try:
            order = process_redemption(user=request.user, reward=reward)
        except ValueError as e:
            return Response(
                {"error": "redemption_failed", "message": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            {
                "message":     f"Penukaran '{reward.nama_reward}' berhasil!",
                "order":       RedemptionOrderSerializer(order).data,
                "saldo_kini":  request.user.poin_terkumpul,
            },
            status=status.HTTP_201_CREATED,
        )


class RedemptionHistoryView(APIView):
    """
    GET /api/v1/rewards/redemptions/
    Histori penukaran milik nelayan yang login.
    """
    permission_classes = [IsNelayan]

    def get(self, request):
        orders = RedemptionOrder.objects.filter(
            user=request.user
        ).select_related("reward")
        return Response(RedemptionOrderSerializer(orders, many=True).data)


class TransactionLedgerView(APIView):
    """
    GET /api/v1/rewards/transactions/
    Histori mutasi koin (earn + redeem) milik user yang login.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        ledger = TransactionLedger.objects.filter(user=request.user)
        return Response(TransactionLedgerSerializer(ledger, many=True).data)


class AdminRewardManageView(APIView):
    """
    POST /api/v1/rewards/admin/catalog/   — tambah reward baru
    """
    permission_classes = [IsAdminMitra]

    def post(self, request):
        serializer = RewardCatalogSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)