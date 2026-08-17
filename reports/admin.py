from django.contrib import admin
from .models import IncidentReport


@admin.register(IncidentReport)
class IncidentReportAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "reporter_display",
        "incident_type",
        "priority",
        "status",
        "submitted_at",
    )

    list_filter = (
        "status",
        "priority",
        "incident_type",
        "anonymous",
    )

    search_fields = (
        "location",
        "description",
        "user__username",
        "user__email",
    )

    list_editable = (
        "status",
    )

    readonly_fields = (
        "submitted_at",
    )

    ordering = (
        "-submitted_at",
    )

    # ==========================================
    # Reporter Display
    # ==========================================

    @admin.display(
        description="Reporter",
        ordering="user"
    )
    def reporter_display(self, obj):

        # Guest report
        if obj.user is None:
            return "Anonymous"

        # Logged-in user submitted anonymously
        if obj.anonymous:
            return "Anonymous"

        # Normal logged-in report
        return (
            obj.user.get_full_name()
            or obj.user.username
        )