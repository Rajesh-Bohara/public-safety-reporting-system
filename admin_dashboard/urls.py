from django.urls import path
from . import views


urlpatterns = [

    # ==========================
    # Admin Dashboard
    # ==========================

    path(
        "",
        views.admin_dashboard,
        name="admin_dashboard"
    ),

    path(
    "analytics/",
    views.analytics,
    name="analytics"
   ),

    # ==========================
    # Incident Reports
    # ==========================

    path(
        "reports/",
        views.reports,
        name="admin_reports"
    ),

    path(
        "reports/<int:report_id>/",
        views.report_detail,
        name="admin_report_detail"
    ),


    # ==========================
    # SOS
    # ==========================

    path(
        "sos/",
        views.sos_list,
        name="admin_sos"
    ),

    path(
        "sos/<int:sos_id>/",
        views.sos_detail,
        name="admin_sos_detail"
    ),


    # ==========================
    # Admin Management
    # ==========================

    path(
        "admins/",
        views.admin_list,
        name="admin_list"
    ),

    path(
        "admins/add/",
        views.add_admin,
        name="add_admin"
    ),
    path(
    "admins/<int:admin_id>/edit/",
    views.edit_admin,
    name="edit_admin"
    ),
       # ==========================
      # Admin Profile
        # ==========================

     path(
    "profile/",
    views.admin_profile,
    name="admin_profile"
     ),
     path(
    "settings/",
    views.settings,
    name="admin_settings"
    ),

    path(
    "settings/change-password/",
    views.change_password,
    name="change_password"
    ),
]