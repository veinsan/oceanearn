from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import AllowAny

from features.users.permissions import IsNelayan
from features.users.permissions import IsTPS
from .models import WasteSubmission
from .serializers import (
    AnalyzeRequestSerializer,
    SubmissionConfirmSerializer,
    WasteSubmissionSerializer,
    NearestTPSSerializer,
    TPSValidationSerializer,
)
from .services import (
    generate_image_hash,
    is_duplicate_submission,
    predict_waste_with_yolo,
    find_nearest_tps,
    validate_and_credit,
)


class AnalyzeSubmissionView(APIView):
    """
    POST /api/v1/submissions/analyze/
    """
    permission_classes = [IsNelayan]
    parser_classes     = [MultiPartParser, FormParser]

    def post(self, request):
        serializer = AnalyzeRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        foto = serializer.validated_data["foto_sampah"]
        lat  = serializer.validated_data["lat"]
        lon  = serializer.validated_data["lon"]

        image_hash = generate_image_hash(foto)

        if is_duplicate_submission(image_hash, user_id=request.user.id):
            return Response(
                {
                    "error":   "duplicate_image",
                    "message": (
                        "Foto ini terdeteksi mirip dengan submission Anda sebelumnya. "
                        "Mohon upload foto sampah yang berbeda."
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        foto.seek(0)
        ai_result = predict_waste_with_yolo(foto)

        nearest_tps  = find_nearest_tps(lat, lon, limit=5)
        tps_serialized = NearestTPSSerializer(nearest_tps, many=True).data

        return Response(
            {
                "image_hash":   image_hash,
                "ai_estimation": ai_result,
                "nearest_tps":  tps_serialized,
            },
            status=status.HTTP_200_OK,
        )


class ConfirmSubmissionView(APIView):
    """
    POST /api/v1/submissions/confirm/
    """
    permission_classes = [IsNelayan]
    parser_classes     = [MultiPartParser, FormParser]

    def post(self, request):
        serializer = SubmissionConfirmSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        foto = serializer.validated_data["foto_sampah"]

        image_hash = generate_image_hash(foto)
        if is_duplicate_submission(image_hash, user_id=request.user.id):
            return Response(
                {
                    "error":   "duplicate_image",
                    "message": "Foto terdeteksi duplikat. Submission dibatalkan.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        submission = serializer.save(
            user             = request.user,
            perceptual_hash  = image_hash,
            status           = WasteSubmission.Status.PENDING,
        )

        return Response(
            {
                "message":    "Submission berhasil disimpan. Silakan datang ke TPS yang dipilih.",
                "submission": WasteSubmissionSerializer(submission).data,
            },
            status=status.HTTP_201_CREATED,
        )


class SubmissionHistoryView(APIView):
    """
    GET /api/v1/submissions/history/
    """
    permission_classes = [IsNelayan]

    def get(self, request):
        submissions = WasteSubmission.objects.filter(
            user=request.user
        ).select_related("tps")

        return Response(
            WasteSubmissionSerializer(submissions, many=True).data,
            status=status.HTTP_200_OK,
        )


class ValidateSubmissionView(APIView):
    """
    PATCH /api/v1/submissions/<submission_id>/validate/
    """
    permission_classes = [IsTPS]

    def patch(self, request, submission_id):
        try:
            submission = WasteSubmission.objects.select_related("user").get(
                id=submission_id
            )
        except WasteSubmission.DoesNotExist:
            return Response(
                {"detail": "Submission tidak ditemukan."},
                status=status.HTTP_404_NOT_FOUND,
            )

        if submission.tps.user != request.user:
            return Response(
                {"detail": "Submission ini bukan milik TPS Anda."},
                status=status.HTTP_403_FORBIDDEN,
            )

        if submission.status != WasteSubmission.Status.PENDING:
            return Response(
                {"detail": f"Submission sudah diproses dengan status: {submission.status}."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = TPSValidationSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        result = validate_and_credit(
            submission      = submission,
            berat_aktual_kg = serializer.validated_data["berat_aktual_kg"],
            jenis_aktual    = serializer.validated_data["jenis_aktual"],
        )

        return Response(
            {
                "message": (
                    f"Validasi berhasil. {result['koin_earned']} koin "
                    f"dikreditkan ke {submission.user.username}."
                ),
                "detail": result,
            },
            status=status.HTTP_200_OK,
        )


# ================= FINAL (CLEAN) =================
class PublicStatsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        from .models import WasteSubmission
        from features.users.models import User

        validated = WasteSubmission.objects.filter(status='validated')

        total_kg = sum(
            s.final_weight.get('berat_aktual_kg', 0)
            for s in validated if s.final_weight
        )

        nelayan_aktif = User.objects.filter(
            role='nelayan',
            is_verified=True
        ).count()

        return Response({
            'sampah_ton':      round(total_kg / 1000, 1),
            'co2_dicegah_ton': round(total_kg * 0.002, 1),
            'nelayan_aktif':   nelayan_aktif,
        })