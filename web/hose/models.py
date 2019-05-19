from django.contrib.auth.models import User
from django.db import models


class HoseType(models.Model):
    """
    Different Hose Types like A, B or C
    """

    name = models.CharField(unique=True, max_length=250)


class HoseManufacturer(models.Model):
    """
    Manufacturer of Hoses
    """

    name = models.CharField(unique=True, max_length=250)


class HoseEvent(models.Model):
    """
    Events of Hoses
    """

    name = models.CharField(unique=True, max_length=250)


class Hose(models.Model):
    """
    List of Hoses
    """

    barcode = models.CharField(unique=True, null=True, max_length=250)
    build_year = models.IntegerField(null=True)
    description = models.CharField(blank=True, max_length=250)
    hose_type = models.ForeignKey(HoseType, on_delete=models.CASCADE)
    length = models.IntegerField()
    manufacturer = models.ForeignKey(HoseManufacturer, on_delete=models.CASCADE)
    number = models.IntegerField(unique=True)


class HoseHistory(models.Model):
    """
    History of a Hose
    """

    date = models.DateTimeField()
    description = models.CharField(blank=True, max_length=250)
    event = models.ForeignKey(HoseEvent, on_delete=models.CASCADE)
    hose = models.ForeignKey(Hose, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
