from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required

from .models import Notification


@login_required
def notification_list(request):

    notifications = Notification.objects.filter(
        user=request.user
    ).order_by("-created_at")

    return render(
        request,
        "notifications/notification_list.html",
        {
            "notifications": notifications
        }
    )


@login_required
def notification_detail(request, pk):

    notification = get_object_or_404(
        Notification,
        pk=pk,
        user=request.user
    )

    # Mark notification as read
    notification.is_read = True
    notification.save()


    # ======================================================
    # INCIDENT REPORT NOTIFICATION
    # ======================================================

    if (
        notification.notification_type == "incident"
        and notification.report
    ):

        return redirect(
            "admin_report_detail",
            report_id=notification.report.id
        )


    # ======================================================
    # SOS NOTIFICATION
    # ======================================================

    if (
        notification.notification_type == "sos"
        and notification.sos
    ):

        return redirect(
            "admin_sos_detail",
            sos_id=notification.sos.id
        )


    # ======================================================
    # FALLBACK
    # ======================================================

    return redirect("admin_dashboard")


@login_required
def mark_all_read(request):

    Notification.objects.filter(
        user=request.user,
        is_read=False
    ).update(is_read=True)

    return redirect("notification_list")