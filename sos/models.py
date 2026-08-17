from django.db import models
from django.contrib.auth.models import User


class SOSAlert(models.Model):

    STATUS_CHOICES = [
        ("Pending", "Pending"),
        ("Responding", "Responding"),
        ("Resolved", "Resolved"),
    ]

    EMERGENCY_CHOICES = [
        ("Medical Emergency", "Medical Emergency"),
        ("Crime", "Crime"),
        ("Fire", "Fire"),
        ("Road Accident", "Road Accident"),
        ("Violence", "Violence"),
        ("Natural Disaster", "Natural Disaster"),
        ("Suspicious Activity", "Suspicious Activity"),
        ("Others", "Others"),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="sos_alerts"
    )

    emergency_type = models.CharField(
        max_length=50,
        choices=EMERGENCY_CHOICES
    )

    location = models.CharField(
        max_length=255,
         blank=True,
         null=True
         ) 

    latitude = models.DecimalField(
        max_digits=10,
        decimal_places=7,
        null=True,
        blank=True
    )

    longitude = models.DecimalField(
        max_digits=10,
        decimal_places=7,
        null=True,
        blank=True
    )

    message = models.TextField(
        blank=True,
        null=True
    )

    # ==========================================
    # PHOTO
    # ==========================================

    photo = models.ImageField(
        upload_to="sos/photos/",
        blank=True,
        null=True
    )

    # ==========================================
    # VIDEO
    # ==========================================

    video = models.FileField(
        upload_to="sos/videos/",
        blank=True,
        null=True
    )

    # ==========================================
    # AUDIO
    # ==========================================

    audio = models.FileField(
        upload_to="sos/audio/",
        blank=True,
        null=True
    )

    # ==========================================
    # STATUS
    # ==========================================

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="Pending"
    )

    admin_remark = models.TextField(
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):

        if self.user:
            username = self.user.username
        else:
            username = "Anonymous"

        return (
            f"{username} - "
            f"{self.emergency_type} "
            f"({self.created_at:%Y-%m-%d %H:%M})"
        )