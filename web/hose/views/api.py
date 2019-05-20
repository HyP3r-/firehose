from django.http import JsonResponse
from rest_framework.decorators import api_view

from hose.models import Hose, HoseManufacturer, HoseType


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


@api_view(["POST"])
def list_hoses(request):
    """
    Return a list of hoses
    """

    number = request.data["number"]
    barcode = request.data["barcode"]

    hoses = Hose.objects.all()
    if number:
        hoses = hoses.filter(number=number)
    if barcode:
        hoses = hoses.filter(barcode=barcode)
    hoses = hoses.order_by("number")

    response = [{
        "buildYear": hose.build_year,
        "description": hose.description,
        "hoseType": hose.hose_type_id,
        "id": hose.id,
        "length": hose.length,
        "manufacturer": hose.manufacturer_id,
        "number": hose.number,
    } for hose in hoses]

    return JsonResponse({"hoses": response})
