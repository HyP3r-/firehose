from django.http import JsonResponse
from rest_framework.decorators import api_view

from hose.models import Hose, HoseManufacturer, HoseType, HoseEvent


@api_view(["GET"])
def list_hoses_manufacturers(request):
    hose_manufacturers = HoseManufacturer.objects.all()
    response = [{
        "id": hose_manufacturer.id,
        "name": hose_manufacturer.name,
    } for hose_manufacturer in hose_manufacturers]
    return JsonResponse({"hoseManufacturers": response})


@api_view(["GET"])
def list_hoses_types(request):
    hose_types = HoseType.objects.all()
    response = [{
        "id": hose_type.id,
        "name": hose_type.name,
    } for hose_type in hose_types]
    return JsonResponse({"hoseTypes": response})


@api_view(["GET"])
def list_hoses_events(request):
    hose_events = HoseEvent.objects.all()
    response = [{
        "id": hose_event.id,
        "name": hose_event.name,
    } for hose_event in hose_events]
    return JsonResponse({"hoseEvents": response})


@api_view(["GET"])
def list_hoses(request):
    """
    Return a list of hoses
    """

    hoses = Hose.objects.order_by("number")

    response = [{
        "barcode": hose.barcode,
        "buildYear": hose.build_year,
        "description": hose.description,
        "hoseType": hose.hose_type_id,
        "id": hose.id,
        "length": hose.length,
        "manufacturer": hose.manufacturer_id,
        "number": hose.number,
    } for hose in hoses]

    return JsonResponse({"hoses": response})
