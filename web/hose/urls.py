from django.urls import path

from .views import pages, api

# page end points
urlpatterns = [
    path("", pages.list, name="list-index"),
    path("link", pages.link, name="link-index"),
    path("check", pages.check, name="check-index"),
    path("download", pages.download, name="download-index"),
]

# api end points
urlpatterns += [
    path("api/link/list", api.link_list),
]