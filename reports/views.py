from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User

from .models import IncidentReport
from notifications.models import Notification
from notifications.sms_service import send_sms
from users.models import Profile


# ==========================
# Submit Incident Report
# ==========================

def report(request):

    if request.method == "POST":

        is_anonymous = True if request.POST.get("anonymous") else False

        # Guest is automatically anonymous
        if not request.user.is_authenticated:
            report_user = None
            is_anonymous = True
        else:
            report_user = request.user

        # ==========================
        # CREATE INCIDENT REPORT
        # ==========================

        report = IncidentReport.objects.create(

            user=report_user,

            incident_type=request.POST["incident_type"],

            description=request.POST["description"],

            location=request.POST["location"],

            latitude=request.POST.get("latitude") or None,

            longitude=request.POST.get("longitude") or None,

            incident_datetime=request.POST["datetime"],

            priority=request.POST["priority"],

            photo=request.FILES.get("photo_gallery"),

            video=request.FILES.get("video_gallery"),

            audio=request.FILES.get("audio_gallery"),

            anonymous=is_anonymous
        )

        # ==========================
        # DETERMINE REPORTER
        # ==========================

        if is_anonymous:

            reporter_name = "Anonymous user"
            reporter_phone = "Hidden"

        else:

            reporter_name = (
                request.user.first_name
                or request.user.username
            )

            # Get phone number from Profile
            try:

                profile = Profile.objects.get(
                    user=request.user
                )

                reporter_phone = (
                    profile.mobile_number
                    or "Not provided"
                )

            except Profile.DoesNotExist:

                reporter_phone = "Not provided"

        # ==========================
        # NOTIFY ALL ADMINS
        # ==========================

        admins = User.objects.filter(
            is_staff=True,
            is_active=True
        )

        for admin in admins:

            Notification.objects.create(

                user=admin,

                title="New Incident Report",

                message=(
                    f"{reporter_name} submitted a "
                    f"{report.incident_type} report."
                ),

                notification_type="incident",

                report=report
            )

        # ==========================
        # CREATE GOOGLE MAPS LINK
        # ==========================

        if report.latitude and report.longitude:

            map_link = (
                "https://www.google.com/maps?q="
                f"{report.latitude},{report.longitude}"
            )

        else:

            map_link = report.location

        # ==========================
        # CREATE SMS MESSAGE
        # ==========================

        sms_message = (
            "SAFE SPACE | NEW INCIDENT\n\n"

            f"Incident: {report.incident_type}\n"
            f"Priority: {report.priority.upper()}\n\n"

            f"Reporter: {reporter_name}\n"
            f"Phone: {reporter_phone}\n\n"

            f"Location: {report.location}\n\n"

            f"Map:\n{map_link}\n\n"

            f"Description:\n{report.description}\n\n"

            f"Time: {report.incident_datetime}\n\n"

            "Please respond promptly."
        )

        # ==========================
        # SEND SMS TO ALL AUTHORITIES
        # ==========================

        send_sms(
            None,
            sms_message
        )

        # ==========================
        # REDIRECT AFTER EVERYTHING
        # ==========================

        return redirect("dashboard")

    # ==========================
    # SHOW REPORT PAGE
    # ==========================

    return render(
        request,
        "reports/report.html"
    )


# ==========================
# Report History
# ==========================

@login_required
def history(request):

    reports = IncidentReport.objects.filter(
        user=request.user
    ).order_by("-submitted_at")

    return render(
        request,
        "reports/history.html",
        {
            "reports": reports
        }
    )


# ==========================
# Report Detail
# ==========================

@login_required
def report_detail(request, pk):

    report = get_object_or_404(
        IncidentReport,
        pk=pk
    )

    return render(
        request,
        "reports/report_detail.html",
        {
            "report": report
        }
    )