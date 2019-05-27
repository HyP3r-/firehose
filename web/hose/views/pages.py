from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from django.shortcuts import render


@login_required
def list(request):
    return render(request, "hose/list.html")


@login_required
def link(request):
    return render(request, "hose/link.html")


@login_required
def check(request):
    return render(request, "hose/check.html")


@login_required
def download(request):
    return HttpResponse()
