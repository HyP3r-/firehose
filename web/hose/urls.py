from django.contrib.auth import views as auth_views
from django.urls import path

from .views import pages, api

# session end point
urlpatterns = [
    path(r"accounts/login/", auth_views.LoginView.as_view(template_name="hose/accounts/login.html"),
         name="accounts_login"),
    path(r"accounts/logout/", auth_views.LogoutView.as_view(template_name="hose/accounts/login.html"),
         name="accounts_logout"),
]

# page end points
urlpatterns += [
    path("", pages.list, name="list-index"),
    path("link", pages.link, name="link-index"),
    path("check", pages.check, name="check-index"),
    path("download", pages.download, name="download-index"),
]

# api end points
urlpatterns += [
    path("api/list/history", api.list_history),
    path("api/list/hose", api.ListHose.as_view()),
    path("api/list/hoseEvents", api.list_hoses_events),
    path("api/list/hoseManufacturers", api.list_hoses_manufacturers),
    path("api/list/hoses", api.list_hoses),
    path("api/list/hoseTypes", api.list_hoses_types),
    path("api/link/hoseNumbers", api.link_hose_numbers),
    path("api/link/bind", api.link_bind),
]
