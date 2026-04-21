# features/users/serializers.py
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.password_validation import validate_password
from .models import User


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
        # Admin tidak bisa dipilih sendiri — hanya bisa di-assign manual
        if value == User.Role.ADMIN:
            raise serializers.ValidationError(
                "Role admin tidak bisa dipilih melalui form ini."
            )
        return value

    def save(self, user: User):
        role = self.validated_data["role"]
        user.role             = role
        user.is_new_oauth_user = False   # Flag di-clear setelah role dipilih

        # Umum langsung verified, Nelayan/TPS tunggu dokumen
        if role == User.Role.UMUM:
            user.is_verified = True

        user.save(update_fields=["role", "is_new_oauth_user", "is_verified"])
        return user


# ─── Custom JWT Payload ───────────────────────────────────────────────────────

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["username"]         = user.username
        token["role"]             = user.role
        token["is_verified"]      = user.is_verified
        token["is_new_oauth_user"] = user.is_new_oauth_user
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data["user"] = UserProfileSerializer(self.user).data
        return data