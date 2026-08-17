from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.contrib.auth.models import User

from .models import SOSAlert
from notifications.models import Notification
from notifications.sms_service import send_sms
from users.models import Profile


# ============================================================
# SOS PAGE + SEND SOS
# ============================================================

def sos_page(request):

    # ========================================================
    # SHOW SOS PAGE
    # Works for both logged-in users and guests
    # ========================================================

    if request.method == "GET":

        return render(
            request,
            "sos/sos.html"
        )

    # ========================================================
    # SUBMIT SOS
    # ========================================================

    if request.method == "POST":

        emergency_type = request.POST.get(
            "emergency_type",
            ""
        ).strip()

        message = request.POST.get(
            "message",
            ""
        ).strip()

        location = request.POST.get(
            "location",
            ""
        ).strip()

        latitude = request.POST.get(
            "latitude"
        )

        longitude = request.POST.get(
            "longitude"
        )

        photo = request.FILES.get(
            "photo"
        )

        video = request.FILES.get(
            "video"
        )

        audio = request.FILES.get(
            "audio"
        )

        # ====================================================
        # VALIDATION
        # ====================================================

        if not emergency_type:

            messages.error(
                request,
                "Please select an emergency type."
            )

            return redirect("sos")

        # ====================================================
        # USER
        # ====================================================

        report_user = (
            request.user
            if request.user.is_authenticated
            else None
        )

        # ====================================================
        # CREATE SOS
        # ====================================================

        sos = SOSAlert.objects.create(

            user=report_user,

            emergency_type=emergency_type,

            message=message,

            location=location,

            latitude=latitude if latitude else None,

            longitude=longitude if longitude else None,

            photo=photo,

            video=video,

            audio=audio,

            status="Pending",

            admin_remark=None
        )

        # ====================================================
        # DETERMINE REPORTER
        # ====================================================

        if report_user:

            reporter_name = (
                report_user.first_name
                or report_user.username
            )

            # Get phone number from Profile
            try:

                profile = Profile.objects.get(
                    user=report_user
                )

                reporter_phone = (
                    profile.mobile_number
                    or "Not provided"
                )

            except Profile.DoesNotExist:

                reporter_phone = "Not provided"

        else:

            reporter_name = "Anonymous user"
            reporter_phone = "Hidden"

        # ====================================================
        # NOTIFY ALL ADMINS
        # ====================================================

        admins = User.objects.filter(
            is_staff=True,
            is_active=True
        )

        for admin in admins:

            Notification.objects.create(

                user=admin,

                title="New SOS Alert",

                message=(
                    f"{reporter_name} sent a "
                    f"{sos.emergency_type} SOS alert."
                ),

                notification_type="sos",

                sos=sos
            )

        # ====================================================
        # CREATE GOOGLE MAPS LINK
        # ====================================================

        if sos.latitude and sos.longitude:

            map_link = (
                "https://www.google.com/maps?q="
                f"{sos.latitude},{sos.longitude}"
            )

        else:

            map_link = sos.location

        # ====================================================
        # CREATE SOS SMS MESSAGE
        # ====================================================

        sms_message = (
            "SAFE SPACE | EMERGENCY SOS\n\n"

            f"Emergency: {sos.emergency_type}\n"
            "Priority: EMERGENCY\n\n"

            f"Reporter: {reporter_name}\n"
            f"Phone: {reporter_phone}\n\n"

            f"Location: {sos.location}\n\n"

            f"Map:\n{map_link}\n\n"

            f"Message:\n{sos.message}\n\n"

            f"Time: {sos.created_at}\n\n"

            "IMMEDIATE ASSISTANCE MAY BE REQUIRED."
        )

        # ====================================================
        # SEND SMS TO ALL AUTHORITIES
        # ====================================================

        send_sms(
            None,
            sms_message
        )

        # ====================================================
        # SUCCESS MESSAGE
        # ====================================================

        messages.success(
            request,
            "SOS alert sent successfully."
        )

        # ====================================================
        # REDIRECT
        # ====================================================

        return redirect("dashboard")

    # ========================================================
    # FALLBACK
    # ========================================================

    return redirect("sos")


# ============================================================
# SOS HISTORY
# ============================================================

@login_required
def sos_history(request):

    alerts = SOSAlert.objects.filter(
        user=request.user
    ).order_by(
        "-created_at"
    )

    return render(
        request,
        "sos/history.html",
        {
            "alerts": alerts
        }
    )


# ============================================================
# SOS DETAIL / VIEW
# ============================================================

@login_required
def sos_detail(request, pk):

    alert = get_object_or_404(
        SOSAlert,
        pk=pk,
        user=request.user
    )

    return render(
        request,
        "sos/sos_detail.html",
        {
            "alert": alert
        }
    )