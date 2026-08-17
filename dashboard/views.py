from django.shortcuts import render


def dashboard(request):

    print("================================")
    print("USER:", request.user)
    print("AUTHENTICATED:", request.user.is_authenticated)
    print("SESSION:", request.session.session_key)
    print("================================")

    return render(
        request,
        "dashboard/dashboard.html"
    )