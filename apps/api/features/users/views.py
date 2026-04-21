# features/users/views.py
from rest_framework              import status
from rest_framework.response     import Response
from rest_framework.views        import APIView
from rest_framework.permissions  import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView

from .models      import User
from .permissions import IsNewOAuthUser
from .serializers import (
    UserRegistrationSerializer,
    UserProfileSerializer,
    RoleSelectionSerializer,
    CustomTokenObtainPairSerializer,
)


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