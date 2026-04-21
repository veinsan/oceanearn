# features/users/serializers.py
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.password_validation import validate_password
from .models import User, TPSProfile, VerificationDocument


# ─── Register (Email) ────────────────────────────────────────────────────────

class UserRegistrationSerializer(serializers.ModelSerializer):
    password  = serializers.CharField(
        write_only=True, required=True, validators=[validate_password]
    )
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model  = User
        fields = ["username", "email", "password", "password2", "no_hp"]
        extra_kwargs = {"email": {"required": True}}

    def validate(self, attrs):
        if attrs["password"] != attrs["password2"]:
            raise serializers.ValidationError({"password": "Password tidak cocok."})
        return attrs

    def create(self, validated_data):
        validated_data.pop("password2")
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


# ─── Profile ─────────────────────────────────────────────────────────────────

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model  = User
        fields = [
            "id", "username", "email", "no_hp",
            "role", "is_verified", "is_new_oauth_user",
            "poin_terkumpul", "date_joined",
        ]
        read_only_fields = fields


# ─── Role Selection (post-OAuth) ─────────────────────────────────────────────

class RoleSelectionSerializer(serializers.Serializer):
    ALLOWED_ROLES = [
        User.Role.UMUM,
        User.Role.NELAYAN,
        User.Role.TPS,
    ]

    role = serializers.ChoiceField(choices=ALLOWED_ROLES)

    def validate_role(self, value):
        if value == User.Role.ADMIN:
            raise serializers.ValidationError(
                "Role admin tidak bisa dipilih melalui form ini."
            )
        return value

    def save(self, user: User):
        role = self.validated_data["role"]
        user.role              = role
        user.is_new_oauth_user = False

        if role == User.Role.UMUM:
            user.is_verified = True

        user.save(update_fields=["role", "is_new_oauth_user", "is_verified"])
        return user


# ─── Custom JWT Payload ───────────────────────────────────────────────────────

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["username"]          = user.username
        token["role"]              = user.role
        token["is_verified"]       = user.is_verified
        token["is_new_oauth_user"] = user.is_new_oauth_user
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data["user"] = UserProfileSerializer(self.user).data
        return data


# ─── TPS Profile ─────────────────────────────────────────────────────────────

class TPSProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model  = TPSProfile
        fields = [
            "id", "nama_tps", "alamat", "kecamatan", "kota",
            "latitude", "longitude", "kapasitas_kg_hari",
            "harga_per_kg", "is_active",
        ]

    def validate_harga_per_kg(self, value):
        allowed_keys = {"plastik", "logam", "kaca", "organik"}
        invalid = set(value.keys()) - allowed_keys
        if invalid:
            raise serializers.ValidationError(
                f"Key tidak valid: {invalid}. Gunakan: {allowed_keys}"
            )
        for key, price in value.items():
            if not isinstance(price, (int, float)) or price < 0:
                raise serializers.ValidationError(
                    f"Harga untuk '{key}' harus berupa angka positif."
                )
        return value


# ─── Verification Document ────────────────────────────────────────────────────

class VerificationDocumentUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model  = VerificationDocument
        fields = ["id", "role_requested", "doc_type", "file"]

    def validate(self, attrs):
        role_doc_map = {
            User.Role.NELAYAN: {
                VerificationDocument.DocType.KTP,
                VerificationDocument.DocType.KARTU_NELAYAN,
            },
            User.Role.TPS: {
                VerificationDocument.DocType.KTP,
                VerificationDocument.DocType.NIB,
                VerificationDocument.DocType.FOTO_LOKASI_TPS,
            },
        }
        allowed_docs = role_doc_map.get(attrs["role_requested"], set())
        if attrs["doc_type"] not in allowed_docs:
            raise serializers.ValidationError({
                "doc_type": (
                    f"Dokumen '{attrs['doc_type']}' tidak valid "
                    f"untuk role '{attrs['role_requested']}'."
                )
            })
        return attrs


class VerificationDocumentListSerializer(serializers.ModelSerializer):
    username             = serializers.CharField(source="user.username",     read_only=True)
    email                = serializers.CharField(source="user.email",        read_only=True)
    reviewed_by_username = serializers.CharField(
        source="reviewed_by.username", read_only=True, default=None
    )

    class Meta:
        model  = VerificationDocument
        fields = [
            "id", "username", "email", "role_requested",
            "doc_type", "file", "status",
            "rejection_note", "reviewed_by_username",
            "reviewed_at", "created_at",
        ]
        read_only_fields = fields


class AdminReviewSerializer(serializers.Serializer):
    action         = serializers.ChoiceField(choices=["approve", "reject"])
    rejection_note = serializers.CharField(required=False, allow_blank=True)

    def validate(self, attrs):
        if attrs["action"] == "reject" and not attrs.get("rejection_note"):
            raise serializers.ValidationError({
                "rejection_note": "Wajib diisi jika dokumen ditolak."
            })
        return attrs