# features/submissions/urls.py
from django.urls import path
from .views import (
    AnalyzeSubmissionView,
    ConfirmSubmissionView,
    SubmissionHistoryView,
    ValidateSubmissionView,
)

urlpatterns = [
    path("analyze/",                    AnalyzeSubmissionView.as_view(),  name="submission-analyze"),
    path("confirm/",                    ConfirmSubmissionView.as_view(),  name="submission-confirm"),
    path("history/",                    SubmissionHistoryView.as_view(),  name="submission-history"),
    path("<int:submission_id>/validate/", ValidateSubmissionView.as_view(), name="submission-validate"),
]