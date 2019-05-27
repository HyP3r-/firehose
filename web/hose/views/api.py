from django.db.models import OuterRef, Subquery
from django.http import JsonResponse, HttpResponseBadRequest
from django.http.response import HttpResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from hose.models import Hose, HoseManufacturer, HoseType, HoseEvent, HoseHistory


@api_view(["GET"])
@permission_classes((IsAuthenticated,))
def list_hoses_manufacturers(request):
    hose_manufacturers = HoseManufacturer.objects.all()
    response = [{
        "id": hose_manufacturer.id,
        "name": hose_manufacturer.name,
    } for hose_manufacturer in hose_manufacturers]
    return JsonResponse({"hoseManufacturers": response})


@api_view(["GET"])
@permission_classes((IsAuthenticated,))
def list_hoses_types(request):
    hose_types = HoseType.objects.all()
    response = [{
        "id": hose_type.id,
        "name": hose_type.name,
    } for hose_type in hose_types]
    return JsonResponse({"hoseTypes": response})


@api_view(["GET"])
@permission_classes((IsAuthenticated,))
def list_hoses_events(request):
    hose_events = HoseEvent.objects.all()
    response = [{
        "id": hose_event.id,
        "name": hose_event.name,
        "status": hose_event.status,
    } for hose_event in hose_events]
    return JsonResponse({"hoseEvents": response})


@api_view(["GET"])
@permission_classes((IsAuthenticated,))
def list_hoses(request):
    """
    Return a list of hoses
    """

    hose_history = HoseHistory.objects.filter(hose_id=OuterRef("pk")).order_by("-date")
    hoses = Hose.objects \
        .annotate(last_action_date=Subquery(hose_history.values("date")[:1])) \
        .annotate(last_actionhose_event_id=Subquery(hose_history.values("hose_event_id")[:1])) \
        .order_by("number")

    def hose_last_action(hose: Hose):
        if hose.last_action_date:
            return {"date": hose.last_action_date, "hoseEventId": hose.last_actionhose_event_id}

    response = [{
        "barcode": hose.barcode,
        "buildYear": hose.build_year,
        "description": hose.description,
        "hoseManufacturerId": hose.hose_manufacturer_id,
        "hoseTypeId": hose.hose_type_id,
        "id": hose.id,
        "lastAction": hose_last_action(hose),
        "length": hose.length,
        "number": hose.number,
    } for hose in hoses]

    return JsonResponse({"hoses": response})


@api_view(["POST"])
@permission_classes((IsAuthenticated,))
def list_history(request):
    """
    Return a list of hoses
    """

    # get fields
    hose_id = request.data.get("hoseId")

    hose_history = HoseHistory.objects.filter(hose_id=hose_id).order_by("date").select_related()

    response = [{
        "date": hose_history_entry.date,
        "description": hose_history_entry.description,
        "hoseEvent": hose_history_entry.hose_event_id,
        "user": hose_history_entry.user.first_name + " " + hose_history_entry.user.last_name,
    } for hose_history_entry in hose_history]

    return JsonResponse({"hoseHistory": response})


class ListHose(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request, format=None):
        """
        Create Hose
        """

        pass

    def put(self, request, format=None):
        """
        Update Hose
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

    def delete(self, request, format=None):
        """
        Remove Hose
        """

        hose_id = request.data.get("hoseId")
        Hose.objects.filter(id=hose_id).delete()
        return HttpResponse(status=200)
