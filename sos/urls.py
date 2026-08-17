from django.urls import path
from . import views


urlpatterns = [

    path(
        "",
        views.sos_page,
        name="sos"
    ),

    path(
        "history/",
        views.sos_history,
        name="sos_history"
    ),

    path(
        "history/<int:pk>/",
        views.sos_detail,
        name="sos_detail"
    ),

]