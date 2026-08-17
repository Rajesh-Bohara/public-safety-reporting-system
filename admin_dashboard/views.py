import json
from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib.auth.models import User

from sos.models import SOSAlert
from reports.models import IncidentReport
from notifications.models import Notification
from django.contrib.auth import update_session_auth_hash
from django.contrib import messages
from django.db.models import Count


# ==========================================================
# ADMIN PERMISSION CHECK
# ==========================================================

def is_admin(user):
    return user.is_authenticated and (
        user.is_staff or user.is_superuser
    )


# ==========================================================
# ADMIN DASHBOARD
# ==========================================================

# ==========================================================
# ADMIN DASHBOARD
# ==========================================================

@login_required
@user_passes_test(is_admin)
def admin_dashboard(request):

    # ------------------------------------------------------
    # DASHBOARD COUNTS
    # ------------------------------------------------------

    # Total registered public users
    # Staff and Super Admin accounts are excluded
    total_users = User.objects.filter(
        is_staff=False,
        is_superuser=False
    ).count()

    # Total incident reports
    total_reports = IncidentReport.objects.count()

    # Active SOS alerts
    # Pending + Responding are considered active
    active_sos = SOSAlert.objects.filter(
        status__in=["Pending", "Responding"]
    ).count()

    # Total resolved incident reports
    resolved_reports = IncidentReport.objects.filter(
        status="Resolved"
    ).count()

     

    # ------------------------------------------------------
    # RECENT INCIDENT REPORTS
    # ------------------------------------------------------

    recent_reports = IncidentReport.objects.order_by(
        "-submitted_at"
    )[:2]


    # ------------------------------------------------------
    # RECENT SOS ALERTS
    # ------------------------------------------------------

    recent_sos_alerts = SOSAlert.objects.order_by(
        "-created_at"
    )[:2]


    # ------------------------------------------------------
    # NOTIFICATIONS
    # ------------------------------------------------------

    unread_count = Notification.objects.filter(
        user=request.user,
        is_read=False
    ).count()

    recent_notifications = Notification.objects.filter(
        user=request.user
    ).order_by(
        "-created_at"
    )[:5]


    # ------------------------------------------------------
    # SEND DATA TO DASHBOARD TEMPLATE
    # ------------------------------------------------------

    return render(
        request,
        "admin_dashboard/dashboard.html",
        {
            "total_users": total_users,
            "total_reports": total_reports,
            "active_sos": active_sos,
            "resolved_reports": resolved_reports,

            "recent_reports": recent_reports,
            "recent_sos_alerts": recent_sos_alerts,

            "unread_count": unread_count,
            "recent_notifications": recent_notifications,
        }
    )

# ==========================================================
# ANALYTICS
# ==========================================================

@login_required
@user_passes_test(is_admin)
def analytics(request):

    # ------------------------------------------------------
    # INCIDENT REPORTS BY TYPE
    # ------------------------------------------------------

    incident_data = (
        IncidentReport.objects
        .values("incident_type")
        .annotate(total=Count("id"))
        .order_by("-total")
    )

    labels = [
        item["incident_type"]
        for item in incident_data
    ]

    values = [
        item["total"]
        for item in incident_data
    ]


    # ------------------------------------------------------
    # TOTAL INCIDENT REPORTS
    # ------------------------------------------------------

    total_reports = IncidentReport.objects.count()


    # ------------------------------------------------------
    # RESOLVED REPORTS
    # ------------------------------------------------------

    resolved_reports = IncidentReport.objects.filter(
        status="Resolved"
    ).count()


    # ------------------------------------------------------
    # PENDING REPORTS
    # ------------------------------------------------------

    pending_reports = IncidentReport.objects.filter(
        status="Pending"
    ).count()


    # ------------------------------------------------------
    # ACTIVE SOS ALERTS
    # Pending + Responding
    # ------------------------------------------------------

    active_sos = SOSAlert.objects.filter(
        status__in=["Pending", "Responding"]
    ).count()


    # ------------------------------------------------------
    # TOTAL SOS ALERTS
    # ------------------------------------------------------

    total_sos = SOSAlert.objects.count()


    # ------------------------------------------------------
    # SOS BY STATUS
    # ------------------------------------------------------

    sos_data = (
        SOSAlert.objects
        .values("status")
        .annotate(total=Count("id"))
        .order_by("-total")
    )

    sos_labels = [
        item["status"]
        for item in sos_data
    ]

    sos_values = [
        item["total"]
        for item in sos_data
    ]


    # ------------------------------------------------------
    # REPORTS BY PRIORITY
    # ------------------------------------------------------

    priority_data = (
        IncidentReport.objects
        .values("priority")
        .annotate(total=Count("id"))
        .order_by("-total")
    )

    priority_labels = [
        item["priority"]
        for item in priority_data
    ]

    priority_values = [
        item["total"]
        for item in priority_data
    ]


    # ------------------------------------------------------
    # SEND DATA TO ANALYTICS TEMPLATE
    # ------------------------------------------------------

    return render(
        request,
        "admin_dashboard/analytics.html",
        {
            # Incident type chart
          
    "labels": json.dumps(labels),
    "values": json.dumps(values),

    "total_reports": total_reports,
    "resolved_reports": resolved_reports,
    "pending_reports": pending_reports,
    "active_sos": active_sos,
    "total_sos": total_sos,

    "sos_labels": json.dumps(sos_labels),
    "sos_values": json.dumps(sos_values),

    "priority_labels": json.dumps(priority_labels),
    "priority_values": json.dumps(priority_values),
     
        }
    )
# ==========================================================
# ALL INCIDENT REPORTS
# ==========================================================

@login_required
@user_passes_test(is_admin)
def reports(request):

    reports = IncidentReport.objects.all().order_by(
        "-submitted_at"
    )

    return render(
        request,
        "admin_dashboard/reports.html",
        {
            "reports": reports
        }
    )


# ==========================================================
# SOS LIST
# ==========================================================

@login_required
@user_passes_test(is_admin)
def sos_list(request):

    sos_alerts = SOSAlert.objects.all().order_by(
        "-created_at"
    )

    return render(
        request,
        "admin_dashboard/sos_list.html",
        {
            "sos_alerts": sos_alerts
        }
    )


# ==========================================================
# SOS DETAIL
# ==========================================================

@login_required
@user_passes_test(is_admin)
def sos_detail(request, sos_id):

    sos = get_object_or_404(
        SOSAlert,
        id=sos_id
    )

    if request.method == "POST":

        sos.status = request.POST.get("status")

        sos.admin_remark = request.POST.get(
            "admin_remark"
        )

        sos.save()

        return redirect(
            "admin_sos_detail",
            sos_id=sos.id
        )

    return render(
        request,
        "admin_dashboard/sos_detail.html",
        {
            "sos": sos
        }
    )


# ==========================================================
# INCIDENT REPORT DETAIL
# ==========================================================

@login_required
@user_passes_test(is_admin)
def report_detail(request, report_id):

    report = get_object_or_404(
        IncidentReport,
        id=report_id
    )

    if request.method == "POST":

        report.status = request.POST.get(
            "status"
        )

        report.admin_remark = request.POST.get(
            "admin_remark"
        )

        report.save()

        return redirect(
            "admin_report_detail",
            report_id=report.id
        )

    return render(
        request,
        "admin_dashboard/report_detail.html",
        {
            "report": report
        }
    )


# ==========================================================
# ADMIN MANAGEMENT
# ==========================================================

@login_required
@user_passes_test(lambda user: user.is_superuser)
def admin_list(request):

    admins = User.objects.filter(
        is_staff=True,
        is_superuser=False
    ).order_by("username")

    return render(
        request,
        "admin_dashboard/admin_list.html",
        {
            "admins": admins
        }
    )


# ==========================================================
# ADD ADMIN
# ==========================================================

# ==========================================================
# ADD ADMIN
# ==========================================================

@login_required
@user_passes_test(lambda user: user.is_superuser)
def add_admin(request):

    if request.method == "POST":

        username = request.POST.get("username", "").strip()
        email = request.POST.get("email", "").strip()
        password = request.POST.get("password", "")
        confirm_password = request.POST.get("confirm_password", "")


        # --------------------------------------------------
        # REQUIRED FIELDS
        # --------------------------------------------------

        if not username or not email or not password or not confirm_password:

            return render(
                request,
                "admin_dashboard/add_admin.html",
                {
                    "error": "All fields are required.",
                    "username": username,
                    "email": email,
                }
            )


        # --------------------------------------------------
        # PASSWORD MATCH
        # --------------------------------------------------

        if password != confirm_password:

            return render(
                request,
                "admin_dashboard/add_admin.html",
                {
                    "error": "Passwords do not match.",
                    "username": username,
                    "email": email,
                }
            )


        # --------------------------------------------------
        # USERNAME CHECK
        # --------------------------------------------------

        if User.objects.filter(
            username=username
        ).exists():

            return render(
                request,
                "admin_dashboard/add_admin.html",
                {
                    "error": "Username already exists.",
                    "email": email,
                }
            )


        # --------------------------------------------------
        # EMAIL CHECK
        # --------------------------------------------------

        if User.objects.filter(
            email=email
        ).exists():

            return render(
                request,
                "admin_dashboard/add_admin.html",
                {
                    "error": "Email already exists.",
                    "username": username,
                }
            )


        # --------------------------------------------------
        # CREATE ADMIN
        # --------------------------------------------------

        admin = User.objects.create_user(
            username=username,
            email=email,
            password=password
        )

        admin.is_staff = True
        admin.is_superuser = False

        admin.save()


        # --------------------------------------------------
        # REDIRECT TO ADMIN LIST
        # --------------------------------------------------

        return redirect("admin_list")


    return render(
        request,
        "admin_dashboard/add_admin.html"
    )
# ==========================================================
# EDIT ADMIN
# ==========================================================

@login_required
@user_passes_test(lambda user: user.is_superuser)
def edit_admin(request, admin_id):

    admin = get_object_or_404(
        User,
        id=admin_id,
        is_staff=True,
        is_superuser=False
    )

    if request.method == "POST":

        username = request.POST.get("username")
        email = request.POST.get("email")
        is_active = request.POST.get("is_active")

        if not username or not email:

            return render(
                request,
                "admin_dashboard/edit_admin.html",
                {
                    "admin": admin,
                    "error": "Username and email are required."
                }
            )

        if User.objects.filter(
            username=username
        ).exclude(
            id=admin.id
        ).exists():

            return render(
                request,
                "admin_dashboard/edit_admin.html",
                {
                    "admin": admin,
                    "error": "Username already exists."
                }
            )

        if User.objects.filter(
            email=email
        ).exclude(
            id=admin.id
        ).exists():

            return render(
                request,
                "admin_dashboard/edit_admin.html",
                {
                    "admin": admin,
                    "error": "Email already exists."
                }
            )

        admin.username = username
        admin.email = email

        if is_active == "on":
            admin.is_active = True
        else:
            admin.is_active = False

        admin.save()

        return redirect("admin_list")

    return render(
        request,
        "admin_dashboard/edit_admin.html",
        {
            "admin": admin
        }
    )

# ==========================================================
# ADMIN PROFILE
# ==========================================================

@login_required
@user_passes_test(is_admin)
def admin_profile(request):

    return render(
        request,
        "admin_dashboard/admin_profile.html"
    )

# ==========================================================
# ADMIN SETTINGS
# ==========================================================

@login_required
@user_passes_test(lambda user: user.is_staff or user.is_superuser)
def settings(request):

    return render(
        request,
        "admin_dashboard/settings.html"
    )



# ==========================================================
# CHANGE PASSWORD
# ==========================================================

@login_required
@user_passes_test(is_admin)
def change_password(request):

    if request.method == "POST":

        current_password = request.POST.get("current_password")
        new_password = request.POST.get("new_password")
        confirm_password = request.POST.get("confirm_password")

        if not current_password or not new_password or not confirm_password:

            return render(
                request,
                "admin_dashboard/settings.html",
                {
                    "password_error": "All password fields are required."
                }
            )

        if not request.user.check_password(current_password):

            return render(
                request,
                "admin_dashboard/settings.html",
                {
                    "password_error": "Current password is incorrect."
                }
            )

        if new_password != confirm_password:

            return render(
                request,
                "admin_dashboard/settings.html",
                {
                    "password_error": "New passwords do not match."
                }
            )

        if len(new_password) < 8:

            return render(
                request,
                "admin_dashboard/settings.html",
                {
                    "password_error": "Password must be at least 8 characters."
                }
            )

        request.user.set_password(new_password)
        request.user.save()

        update_session_auth_hash(
            request,
            request.user
        )

        return render(
            request,
            "admin_dashboard/settings.html",
            {
                "password_success": "Password changed successfully."
            }
        )

    return redirect("admin_settings")