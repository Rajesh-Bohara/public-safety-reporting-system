from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib import messages

from .forms import RegisterForm


# ==========================================================
# LOGIN
# ==========================================================

def login_page(request):

    if request.method == "POST":

        email = request.POST.get("email", "").strip()
        password = request.POST.get("password", "")

        # --------------------------------------------------
        # Find the Django User using email
        # --------------------------------------------------

        try:

            user_obj = User.objects.get(
                email__iexact=email
            )

        except User.DoesNotExist:

            messages.error(
                request,
                "Invalid email or password."
            )

            return render(
                request,
                "login/login.html"
            )

        # --------------------------------------------------
        # Authenticate using the actual username
        # --------------------------------------------------

        user = authenticate(
            request,
            username=user_obj.username,
            password=password
        )

        # --------------------------------------------------
        # Successful Login
        # --------------------------------------------------

        if user is not None:

            # Explicitly use Django's normal ModelBackend
            login(
                request,
                user,
                backend="django.contrib.auth.backends.ModelBackend"
            )

            # ==================================================
            # SUPER ADMIN / ADMIN
            # ==================================================

            if user.is_staff:

                return redirect(
                    "admin_dashboard"
                )

            # ==================================================
            # NORMAL USER
            # ==================================================

            return redirect(
                "dashboard"
            )

        # --------------------------------------------------
        # Wrong Password
        # --------------------------------------------------

        messages.error(
            request,
            "Invalid email or password."
        )

    return render(
        request,
        "login/login.html"
    )


# ==========================================================
# REGISTER
# ==========================================================

def register(request):

    if request.method == "POST":

        print("POST request received")

        form = RegisterForm(request.POST)

        if form.is_valid():

            print("Form is VALID")

            fullname = form.cleaned_data["fullname"]
            email = form.cleaned_data["email"]
            password = form.cleaned_data["password"]

            print("Creating user:", email)

            user = User.objects.create_user(
                username=email,
                email=email,
                password=password
            )

            user.first_name = fullname

            user.save()

            print(
                "User created successfully"
            )

            return redirect("login")

        else:

            print("Form is INVALID")

            print(form.errors)

    else:

        form = RegisterForm()

    return render(
        request,
        "login/register.html",
        {
            "form": form
        }
    )


# ==========================================================
# LOGOUT
# ==========================================================

def logout_page(request):

    logout(request)

    return redirect("home")