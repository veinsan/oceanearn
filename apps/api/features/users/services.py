# features/users/services.py
from django.utils import timezone
from .models import User, VerificationDocument


def approve_verification(doc: VerificationDocument, reviewed_by: User) -> VerificationDocument:
    """
    Approve dokumen verifikasi.
    Side effect krusial: set is_verified = True pada User pengaju.
    """
    doc.status      = VerificationDocument.Status.APPROVED
    doc.reviewed_by = reviewed_by
    doc.reviewed_at = timezone.now()
    doc.save(update_fields=["status", "reviewed_by", "reviewed_at"])

    # CRITICAL: Update user setelah dokumen di-approve
    doc.user.is_verified = True
    doc.user.save(update_fields=["is_verified"])

    return doc


def reject_verification(
    doc: VerificationDocument,
    reviewed_by: User,
    rejection_note: str,
) -> VerificationDocument:
    """
    Reject dokumen verifikasi.
    User tetap bisa upload ulang dokumen baru.
    """
    doc.status         = VerificationDocument.Status.REJECTED
    doc.reviewed_by    = reviewed_by
    doc.reviewed_at    = timezone.now()
    doc.rejection_note = rejection_note
    doc.save(update_fields=["status", "reviewed_by", "reviewed_at", "rejection_note"])

    return doc


def user_has_pending_or_approved_doc(user: User) -> bool:
    """
    Guard: cegah user spam upload dokumen berkali-kali.
    Return True jika sudah ada dokumen pending atau approved.
    """
    return user.verification_documents.filter(
        status__in=[
            VerificationDocument.Status.PENDING,
            VerificationDocument.Status.APPROVED,
        ]
    ).exists()