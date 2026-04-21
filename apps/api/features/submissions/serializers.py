from rest_framework import serializers
from features.users.models import TPSProfile
from .models import WasteSubmission

VALID_JENIS = ["plastik", "logam", "kaca", "organik"]

# ─── TPS Nearest (untuk response analyze) ────────────────────────────────────

class NearestTPSSerializer(serializers.Serializer):
    """
    Serializer untuk response find_nearest_tps().
    Bukan ModelSerializer karena datanya campuran
    (TPSProfile + distance yang dihitung runtime).
    """
    id            = serializers.IntegerField(source="tps.id")
    nama_tps      = serializers.CharField(source="tps.nama_tps")
    alamat        = serializers.CharField(source="tps.alamat")
    kecamatan     = serializers.CharField(source="tps.kecamatan")
    kota          = serializers.CharField(source="tps.kota")
    latitude      = serializers.FloatField(source="tps.latitude")
    longitude     = serializers.FloatField(source="tps.longitude")
    harga_per_kg  = serializers.JSONField(source="tps.harga_per_kg")
    distance_km   = serializers.FloatField()


# ─── Analyze (Preview — tidak save ke DB) ────────────────────────────────────

class AnalyzeRequestSerializer(serializers.Serializer):
    foto_sampah = serializers.ImageField()
    lat         = serializers.FloatField()
    lon         = serializers.FloatField()

    def validate_lat(self, value):
        if not (-90 <= value <= 90):
            raise serializers.ValidationError("Latitude tidak valid.")
        return value

    def validate_lon(self, value):
        if not (-180 <= value <= 180):
            raise serializers.ValidationError("Longitude tidak valid.")
        return value


# ─── Confirm (Save ke DB) ─────────────────────────────────────────────────────

class SubmissionConfirmSerializer(serializers.ModelSerializer):
    # ai_estimation dikirim dari frontend (hasil dari /analyze/)
    # Nelayan sudah lihat estimasi, lalu confirm → kita simpan
    ai_estimation = serializers.JSONField()

    class Meta:
        model  = WasteSubmission
        fields = ["tps", "foto_sampah", "ai_estimation"]

    def validate_tps(self, value):
        if not value.is_active:
            raise serializers.ValidationError("TPS yang dipilih sedang tidak aktif.")
        return value


# ─── Submission Detail (Response) ────────────────────────────────────────────

class WasteSubmissionSerializer(serializers.ModelSerializer):
    username  = serializers.CharField(source="user.username", read_only=True)
    tps_nama  = serializers.CharField(source="tps.nama_tps",  read_only=True)

    class Meta:
        model  = WasteSubmission
        fields = [
            "id", "username", "tps", "tps_nama",
            "foto_sampah", "ai_estimation", "final_weight",
            "status", "created_at", "updated_at",
        ]
        read_only_fields = fields
class TPSValidationSerializer(serializers.Serializer):
    berat_aktual_kg = serializers.FloatField(min_value=0.01)
    jenis_aktual    = serializers.ChoiceField(choices=VALID_JENIS)