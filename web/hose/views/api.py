from django.http import JsonResponse, HttpResponseBadRequest
from django.http.response import HttpResponseBase, HttpResponse
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
        "hoseManufacturerId": hose.hose_manufacturer_id,
        "hoseTypeId": hose.hose_type_id,
        "id": hose.id,
        "length": hose.length,
        "number": hose.number,
    } for hose in hoses]

    return JsonResponse({"hoses": response})


@api_view(["POST"])
def list_field_update(request):
    """
    Return a list of hoses
    """

    # get fields
    field = request.data.get("field")
    id = request.data.get("id")
    value = request.data.get("value")

    # mapping from web fields to database fields
    mapping = {
        "barcode": "barcode",
        "buildYear": "build_year",
        "description": "description",
        "hoseManufacturerId": "hose_manufacturer_id",
        "hoseTypeId": "hose_type_id",
        "length": "length",
    }

    # update field
    try:
        hose = Hose.objects.filter(id=id).first()
        setattr(hose, mapping[field], value)
        hose.save()
    except:
        return HttpResponseBadRequest()
    return HttpResponse(status=200)
