from django.contrib import admin

from .models import HoseType, HoseManufacturer, HoseEvent, Hose, HoseHistory

# Register your models here.
admin.site.register([HoseType, HoseManufacturer, HoseEvent, Hose, HoseHistory])
