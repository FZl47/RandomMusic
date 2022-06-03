from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from Models.Site.models import MusicFarsi
import time
import os
import json


SITE_SOURCE = MusicFarsi

def home(request):
    context = {}
    context['Categories'] = SITE_SOURCE.get_dict_categories()
    return render(request,'home.html',context)



@csrf_exempt
def getMusic(request):
    context = {}
    STATUS = 0

    data = json.loads(request.body)
    category = data.get('category') or None
    site = SITE_SOURCE()
    music = site.get_handler_category(category)()
    if music:
        STATUS = '200'
    else:
        STATUS = '404'
    site.close()
    context['Music'] = music
    context['Status'] = STATUS
    return JsonResponse(context)