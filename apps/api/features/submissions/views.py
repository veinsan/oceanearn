from rest_framework             import status
from rest_framework.response    import Response
from rest_framework.views       import APIView
from rest_framework.parsers     import MultiPartParser, FormParser

from features.users.permissions import IsNelayan
from .models       import WasteSubmission
from .serializers  import (
    AnalyzeRequestSerializer,
    SubmissionConfirmSerializer,
    WasteSubmissionSerializer,
    NearestTPSSerializer,
)
from .services import (
    generate_image_hash,
    is_duplicate_submission,
    predict_waste_with_yolo,
    find_nearest_tps,
)


class AnalyzeSubmissionView(APIView):
    """
    POST /api/v1/submissions/analyze/

    Tahap PREVIEW — tidak menyimpan data ke DB.
    Flow:
      1. Validasi input (foto + koordinat)
      2. Generate pHash → cek duplikat
      3. Jalankan YOLO estimator
      4. Cari TPS terdekat via Haversine
      5. Return hasil tanpa save
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

        # ── Step 1: Anti-fraud hash check ────────────────────────────────────
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

        # ── Step 2: YOLO Estimation ───────────────────────────────────────────
        foto.seek(0)   # Reset pointer setelah dibaca hash
        ai_result = predict_waste_with_yolo(foto)

        # ── Step 3: Nearest TPS ───────────────────────────────────────────────
        nearest_tps  = find_nearest_tps(lat, lon, limit=5)
        tps_serialized = NearestTPSSerializer(nearest_tps, many=True).data

        return Response(
            {
                "image_hash":   image_hash,     # Dikirim balik ke frontend
                "ai_estimation": ai_result,      # untuk di-pass ke /confirm/
                "nearest_tps":  tps_serialized,
            },
            status=status.HTTP_200_OK,
        )


class ConfirmSubmissionView(APIView):
    """
    POST /api/v1/submissions/confirm/

    Tahap SIMPAN — nelayan sudah lihat estimasi dan memilih TPS.
    Flow:
      1. Validasi input
      2. Re-generate hash dari foto yang diupload ulang
      3. Re-check duplikat (cegah manipulasi antara analyze dan confirm)
      4. Simpan WasteSubmission ke DB dengan status pending
    """
    permission_classes = [IsNelayan]
    parser_classes     = [MultiPartParser, FormParser]

    def post(self, request):
        serializer = SubmissionConfirmSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        foto = serializer.validated_data["foto_sampah"]

        # Re-check hash — cegah foto berbeda di-submit saat confirm
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
    Riwayat submission milik nelayan yang sedang login.
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