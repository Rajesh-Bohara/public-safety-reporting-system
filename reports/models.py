from django.db import models
from django.contrib.auth.models import User


class IncidentReport(models.Model):

    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="reports"
    )

    INCIDENT_TYPES = [
        ("Theft", "Theft"),
        ("Fire", "Fire"),
        ("Road Accident", "Road Accident"),
        ("Medical Emergency", "Medical Emergency"),
        ("Violence", "Violence"),
        ("Natural Disaster", "Natural Disaster"),
        ("Others", "Others"),
    ]

    PRIORITY = [
        ("Low", "Low"),
        ("Medium", "Medium"),
        ("High", "High"),
    ]

    incident_type = models.CharField(
        max_length=50,
        choices=INCIDENT_TYPES
    )

    description = models.TextField()

    location = models.CharField(max_length=250)

    latitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        null=True,
        blank=True
    )

    longitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        null=True,
        blank=True
    )

    incident_datetime = models.DateTimeField()

    priority = models.CharField(
        max_length=10,
        choices=PRIORITY
    )

    photo = models.ImageField(
        upload_to="incident_photos/",
        blank=True,
        null=True
    )

    video = models.FileField(
        upload_to="incident_videos/",
        blank=True,
        null=True
    )

    audio = models.FileField(
        upload_to="incident_audio/",
        blank=True,
        null=True
    )

    anonymous = models.BooleanField(default=False)

    submitted_at = models.DateTimeField(auto_now_add=True)

    STATUS_CHOICES = [
        ("Pending", "Pending"),
        ("Under Review", "Under Review"),
        ("Resolved", "Resolved"),
        ("Rejected", "Rejected"),
    ]

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="Pending"
    )

    admin_remark = models.TextField(
        blank=True,
        null=True
    )

    def __str__(self):
        return f"{self.incident_type} - {self.location}"