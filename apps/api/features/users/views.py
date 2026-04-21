from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import parsers

from .models import User, TPSProfile, VerificationDocument
from .permissions import IsNewOAuthUser, IsAdminMitra, IsTPS
from .serializers import (
    UserRegistrationSerializer,
    UserProfileSerializer,
    RoleSelectionSerializer,
    CustomTokenObtainPairSerializer,
    TPSProfileSerializer,
    VerificationDocumentUploadSerializer,
    VerificationDocumentListSerializer,
    AdminReviewSerializer,
)
from .services import (
    approve_verification,
    reject_verification,
    user_has_pending_or_approved_doc,
)


# ─── Auth & Profile ──────────────────────────────────────────────────────────

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(
                {"message": "Registrasi berhasil.", "user": UserProfileSerializer(user).data},
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(TokenObtainPairView):
    permission_classes = [AllowAny]
    serializer_class   = CustomTokenObtainPairSerializer


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserProfileSerializer(request.user).data)


class RoleSelectionView(APIView):
    """
    Endpoint one-time: dipanggil setelah user baru login via Google.
    Hanya bisa diakses oleh user dengan is_new_oauth_user = True.
    
    POST /api/v1/users/role-setup/
    Body: { "role": "umum" | "nelayan" | "tps" }
    """
    permission_classes = [IsAuthenticated, IsNewOAuthUser]

    def post(self, request):
        serializer = RoleSelectionSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save(user=request.user)
            return Response(
                {
                    "message": f"Role berhasil diset: {user.get_role_display()}",
                    "user": UserProfileSerializer(user).data,
                    # Frontend pakai redirect_to untuk tau mau ke mana
                    "redirect_to": _get_redirect(user.role),
                },
                status=status.HTTP_200_OK,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def _get_redirect(role: str) -> str:
    return {
        "umum":    "/dashboard",
        "nelayan": "/upgrade",   # Upload dokumen dulu
        "tps":     "/upgrade",
    }.get(role, "/dashboard")


# ─── TPS Profile ─────────────────────────────────────────────────────────────

class TPSProfileView(APIView):
    """
    GET  /api/v1/users/tps/profile/  — lihat profil TPS sendiri
    POST /api/v1/users/tps/profile/  — Admin buat profil TPS untuk user TPS
    PUT  /api/v1/users/tps/profile/  — TPS update profil sendiri
    """

    def get_permissions(self):
        if self.request.method in ["POST"]:
            return [IsAdminMitra()]
        return [IsTPS()]

    def get(self, request):
        try:
            profile = request.user.tps_profile
        except TPSProfile.DoesNotExist:
            return Response(
                {"detail": "Profil TPS belum dibuat."},
                status=status.HTTP_404_NOT_FOUND,
            )
        return Response(TPSProfileSerializer(profile).data)

    def post(self, request):
        """Admin-only: buat profil TPS untuk user yang sudah verified."""
        user_id = request.data.get("user_id")
        try:
            tps_user = User.objects.get(id=user_id, role=User.Role.TPS)
        except User.DoesNotExist:
            return Response(
                {"detail": "User TPS tidak ditemukan."},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = TPSProfileSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=tps_user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        """TPS update profil sendiri."""
        try:
            profile = request.user.tps_profile
        except TPSProfile.DoesNotExist:
            return Response(
                {"detail": "Profil TPS belum dibuat."},
                status=status.HTTP_404_NOT_FOUND,
            )
        serializer = TPSProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ─── Verification Document — User Upload ─────────────────────────────────────

class VerificationDocumentUploadView(APIView):
    """
    POST /api/v1/users/verification/upload/
    Hanya untuk user authenticated yang belum verified.
    """
    permission_classes = [IsAuthenticated]
    parser_classes     = [MultiPartParser, FormParser]

    def post(self, request):
        if request.user.is_verified:
            return Response(
                {"detail": "Akun Anda sudah terverifikasi."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if user_has_pending_or_approved_doc(request.user):
            return Response(
                {"detail": "Anda sudah memiliki dokumen yang sedang diproses atau sudah disetujui."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = VerificationDocumentUploadSerializer(
            data=request.data,
            context={"request": request},
        )
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(
                {
                    "message": "Dokumen berhasil diunggah. Admin akan mereview dalam 1x24 jam.",
                    "document": serializer.data,
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ─── Verification Document — Admin Review ────────────────────────────────────

class AdminVerificationListView(APIView):
    """
    GET /api/v1/admin/verifications/          — semua dokumen (filter by status)
    GET /api/v1/admin/verifications/?status=pending
    """
    permission_classes = [IsAdminMitra]

    def get(self, request):
        qs = VerificationDocument.objects.select_related("user", "reviewed_by").all()

        status_filter = request.query_params.get("status")
        if status_filter:
            qs = qs.filter(status=status_filter)

        return Response(VerificationDocumentListSerializer(qs, many=True).data)


class AdminVerificationReviewView(APIView):
    """
    PATCH /api/v1/admin/verifications/<doc_id>/review/
    Body: { "action": "approve" | "reject", "rejection_note": "..." }
    """
    permission_classes = [IsAdminMitra]

    def patch(self, request, doc_id):
        try:
            doc = VerificationDocument.objects.select_related("user").get(id=doc_id)
        except VerificationDocument.DoesNotExist:
            return Response({"detail": "Dokumen tidak ditemukan."}, status=status.HTTP_404_NOT_FOUND)

        if doc.status != VerificationDocument.Status.PENDING:
            return Response(
                {"detail": f"Dokumen sudah diproses sebelumnya dengan status: {doc.status}."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = AdminReviewSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        action = serializer.validated_data["action"]

        if action == "approve":
            doc = approve_verification(doc, reviewed_by=request.user)
            return Response({
                "message": f"Dokumen disetujui. User '{doc.user.username}' kini terverifikasi.",
                "document_id": doc.id,
                "user_is_verified": doc.user.is_verified,   # Konfirmasi side effect
            })

        doc = reject_verification(
            doc,
            reviewed_by=request.user,
            rejection_note=serializer.validated_data["rejection_note"],
        )
        return Response({
            "message": f"Dokumen ditolak. Notifikasi akan dikirim ke '{doc.user.username}'.",
            "document_id": doc.id,
        })