from django.http import JsonResponse
from rest_framework.decorators import api_view

from hose.models import Hose


@api_view(["POST"])
def link_list(request):
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
        "length": hose.length,
        "manufacturer": hose.manufacturer_id,
        "number": hose.number,
    } for hose in hoses]

    return JsonResponse({"list": response})
