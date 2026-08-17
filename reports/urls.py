from django.urls import path
from . import views

urlpatterns = [

    path("", views.report, name="report"),

    path("history/", views.history, name="history"),
    path(
    "history/<int:pk>/",
    views.report_detail,
    name="report_detail"
),

]