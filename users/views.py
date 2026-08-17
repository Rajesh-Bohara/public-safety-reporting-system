from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import PasswordChangeForm
from django.contrib.auth import update_session_auth_hash

from .models import Profile
from .forms import ProfileForm

from sos.models import SOSAlert
from reports.models import IncidentReport


@login_required(login_url="/login/")
def profile(request):

    print("================================")
    print("PROFILE USER:", request.user)
    print("PROFILE AUTHENTICATED:", request.user.is_authenticated)
    print("PROFILE SESSION:", request.session.session_key)
    print("================================")

    profile, created = Profile.objects.get_or_create(
        user=request.user
    )

    report_count = IncidentReport.objects.filter(
        user=request.user
    ).count()

    sos_count = SOSAlert.objects.filter(
        user=request.user
    ).count()

    resolved_count = IncidentReport.objects.filter(
        user=request.user,
        status="Resolved"
    ).count()

    return render(
        request,
        "users/profile.html",
        {
            "profile": profile,
            "user": request.user,
            "report_count": report_count,
            "sos_count": sos_count,
            "resolved_count": resolved_count,
        }
    )


@login_required(login_url="/login/")
def edit_profile(request):

    profile, created = Profile.objects.get_or_create(
        user=request.user
    )

    if request.method == "POST":

        form = ProfileForm(
            request.POST,
            request.FILES,
            instance=profile
        )

        if form.is_valid():
            form.save()
            return redirect("profile")

    else:

        form = ProfileForm(
            instance=profile
        )

    return render(
        request,
        "users/edit_profile.html",
        {
            "form": form
        }
    )


@login_required(login_url="/login/login/")
def change_password(request):

    if request.method == "POST":

        form = PasswordChangeForm(
            request.user,
            request.POST
        )

        if form.is_valid():

            user = form.save()

            update_session_auth_hash(
                request,
                user
            )

            return redirect("profile")

    else:

        form = PasswordChangeForm(
            request.user
        )

    return render(
        request,
        "users/change_password.html",
        {
            "form": form
        }
    )