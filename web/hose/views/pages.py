from django.http import HttpResponse
from django.shortcuts import render


def list(request):
    return render(request, "hose/list.html")


def link(request):
    return render(request, "hose/link.html")


def check(request):
    return render(request, "hose/check.html")

def download(request):
    return HttpResponse()
