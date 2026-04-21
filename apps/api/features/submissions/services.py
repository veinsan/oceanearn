import math
import imagehash
from PIL import Image
from io import BytesIO

from features.users.models import TPSProfile
from django.db import transaction as db_transaction


# ─── Anti-Fraud: Perceptual Hashing ──────────────────────────────────────────

HASH_SIMILARITY_THRESHOLD = 10
# Hamming distance <= 10 dianggap gambar "terlalu mirip" (duplikat/fraud)
# Nilai 0 = identik, makin besar makin berbeda
# 10 adalah sweet spot: toleran terhadap kompresi/resize, tapi tangkap reupload

def generate_image_hash(image_file) -> str:
    """
    Generate perceptual hash (pHash) dari file gambar.
    pHash lebih robust dari MD5 — dua foto yang sama
    tapi beda ukuran/kompresi tetap menghasilkan hash yang mirip.

    Returns: string hex hash (misal: "f8e0c0a0b0d0e0f0")
    """
    image_file.seek(0)  # Reset pointer sebelum dibaca
    img  = Image.open(BytesIO(image_file.read()))
    hash = imagehash.phash(img)
    return str(hash)


def is_duplicate_submission(image_hash: str, user_id: int) -> bool:
    """
    Cek apakah foto terlalu mirip dengan submission sebelumnya
    dari user yang sama.

    Kenapa filter by user_id: mencegah false positive antar user
    yang kebetulan foto di lokasi yang sama.
    """
    from .models import WasteSubmission

    previous_submissions = WasteSubmission.objects.filter(
        user_id=user_id
    ).values_list("perceptual_hash", flat=True)

    incoming_hash = imagehash.hex_to_hash(image_hash)

    for existing_hash_str in previous_submissions:
        try:
            existing_hash = imagehash.hex_to_hash(existing_hash_str)
            distance = incoming_hash - existing_hash
            if distance <= HASH_SIMILARITY_THRESHOLD:
                return True
        except Exception:
            # Skip hash yang corrupt di DB, jangan crash
            continue

    return False


# ─── AI Estimator: Mock YOLO ─────────────────────────────────────────────────

# Mapping jenis sampah → CO₂ equivalent (kg CO₂e per kg sampah)
CARBON_FACTORS = {
    "plastik": 2.5,
    "logam":   1.8,
    "kaca":    0.7,
    "organik": 0.4,
}

# Mapping jenis sampah → koin per kg
KOIN_RATES = {
    "plastik": 100,   # 100 koin/kg
    "logam":   120,
    "kaca":     60,
    "organik":  40,
}


def predict_waste_with_yolo(image_file) -> dict:
    """
    Mock YOLO estimator.

    Struktur return ini adalah kontrak antara AI service dan endpoint.
    Saat integrasi model asli nanti, fungsi ini yang di-replace —
    views dan serializer tidak perlu diubah sama sekali.

    TODO: Replace mock ini dengan:
        from ultralytics import YOLO
        model = YOLO("path/to/oceanearn_best.pt")
        results = model(image_file)
        ... parse results ...
    """
    # ── MOCK OUTPUT ──────────────────────────────────────────────────────────
    # Simulasi deteksi: dominan plastik dengan sedikit logam
    breakdown = {
        "plastik": 2.5,   # kg
        "logam":   0.8,
    }
    jenis_dominan = max(breakdown, key=breakdown.get)
    confidence    = 0.87   # Mock confidence score

    # Kalkulasi estimasi koin dari breakdown
    total_koin_estimate = sum(
        berat * KOIN_RATES.get(jenis, 80)
        for jenis, berat in breakdown.items()
    )

    # Kalkulasi estimasi CO₂
    total_co2 = sum(
        berat * CARBON_FACTORS.get(jenis, 1.0)
        for jenis, berat in breakdown.items()
    )

    return {
        "jenis_dominan":  jenis_dominan,
        "confidence":     confidence,
        "breakdown":      breakdown,           # Detail per jenis
        "estimasi_koin": {
            "min": int(total_koin_estimate * 0.85),   # ±15% range
            "max": int(total_koin_estimate * 1.15),
        },
        "estimasi_co2_kg": round(total_co2, 2),
        "is_mock": True,   # Flag: frontend bisa tampilkan disclaimer
    }


# ─── Geospatial: Haversine TPS Terdekat ──────────────────────────────────────

def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Hitung jarak antara dua titik koordinat (km).
    Formula Haversine — akurat untuk jarak pendek-menengah.
    """
    R = 6371   # Radius bumi dalam km

    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)

    a = (
        math.sin(dlat / 2) ** 2
        + math.cos(math.radians(lat1))
        * math.cos(math.radians(lat2))
        * math.sin(dlon / 2) ** 2
    )

    c = 2 * math.asin(math.sqrt(a))
    return round(R * c, 2)


def find_nearest_tps(user_lat: float, user_lon: float, limit: int = 5) -> list[dict]:
    """
    Return list TPS aktif terdekat dari koordinat user,
    diurutkan ascending by distance.

    Return format:
    [
        {
            "tps": <TPSProfile instance>,
            "distance_km": 1.2
        },
        ...
    ]
    """
    active_tps_list = TPSProfile.objects.filter(is_active=True).select_related("user")

    tps_with_distance = []
    for tps in active_tps_list:
        distance = haversine_distance(user_lat, user_lon, tps.latitude, tps.longitude)
        tps_with_distance.append({
            "tps":         tps,
            "distance_km": distance,
        })

    # Sort by distance, ambil N terdekat
    tps_with_distance.sort(key=lambda x: x["distance_km"])
    return tps_with_distance[:limit]


# ─── Transaction: Credit Koin ke Nelayan ─────────────────────────────────────

KOIN_RATES = {
    "plastik": 100,
    "logam":   120,
    "kaca":     60,
    "organik":  40,
}

CARBON_FACTORS = {
    "plastik": 2.5,
    "logam":   1.8,
    "kaca":    0.7,
    "organik": 0.4,
}


def calculate_koin(jenis: str, berat_kg: float) -> int:
    rate = KOIN_RATES.get(jenis, 80)
    return int(berat_kg * rate)


def calculate_carbon(jenis: str, berat_kg: float) -> float:
    factor = CARBON_FACTORS.get(jenis, 1.0)
    return round(berat_kg * factor, 2)


def validate_and_credit(
    submission,
    berat_aktual_kg: float,
    jenis_aktual: str,
) -> dict:
    """
    Dipanggil saat TPS mengkonfirmasi penimbangan fisik.

    Urutan atomik:
      1. Hitung koin dari berat & jenis aktual
      2. Update submission: status → validated, simpan final_weight
      3. Tambah poin_terkumpul di User (nelayan)
      4. Buat entri TransactionLedger (earn)

    Returns: dict ringkasan transaksi
    """
    from features.rewards.models import TransactionLedger

    koin_earned  = calculate_koin(jenis_aktual, berat_aktual_kg)
    carbon_saved = calculate_carbon(jenis_aktual, berat_aktual_kg)

    with db_transaction.atomic():
        # ── 1. Update submission ──────────────────────────────────────────────
        submission.status = "validated"
        submission.final_weight = {
            "berat_aktual_kg": berat_aktual_kg,
            "jenis_aktual":    jenis_aktual,
            "koin_diberikan":  koin_earned,
            "carbon_saved_kg": carbon_saved,
        }
        submission.save(update_fields=["status", "final_weight"])

        # ── 2. Credit koin ke nelayan ─────────────────────────────────────────
        nelayan = submission.user
        nelayan.poin_terkumpul += koin_earned
        nelayan.save(update_fields=["poin_terkumpul"])

        # ── 3. Catat di ledger ────────────────────────────────────────────────
        ledger_entry = TransactionLedger.objects.create(
            user              = nelayan,
            amount            = koin_earned,
            transaction_type  = TransactionLedger.TransactionType.EARN,
            description       = (
                f"Setoran sampah #{submission.id} — "
                f"{berat_aktual_kg} kg {jenis_aktual}"
            ),
            ref_submission_id = submission.id,
        )

    return {
        "submission_id": submission.id,
        "koin_earned":   koin_earned,
        "carbon_saved":  carbon_saved,
        "new_balance":   nelayan.poin_terkumpul,
        "ledger_id":     ledger_entry.id,
    }