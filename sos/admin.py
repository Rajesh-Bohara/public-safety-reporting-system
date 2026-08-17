from django.contrib import admin
from .models import SOSAlert


@admin.register(SOSAlert)
class SOSAlertAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "user",
        "emergency_type",
        "status",
        "created_at",
    )

    list_filter = (
        "status",
        "emergency_type",
    )

    search_fields = (
        "user__username",
        "location",
    )

    ordering = (
        "-created_at",
    )