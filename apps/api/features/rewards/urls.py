from django.urls import path
from .views import (
    RewardCatalogListView,
    RedeemView,
    RedemptionHistoryView,
    TransactionLedgerView,
    AdminRewardManageView,
)

urlpatterns = [
    path("",               RewardCatalogListView.as_view(),  name="reward-catalog"),
    path("redeem/",        RedeemView.as_view(),              name="reward-redeem"),
    path("redemptions/",   RedemptionHistoryView.as_view(),   name="redemption-history"),
    path("transactions/",  TransactionLedgerView.as_view(),   name="transaction-ledger"),
    path("admin/catalog/", AdminRewardManageView.as_view(),   name="admin-reward-manage"),
]