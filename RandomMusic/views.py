from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.core.exceptions import PermissionDenied
from .models import RandomMusic
from Models.Site.models import MusicFarsi
import time
import os
import json


SITE_SOURCE = MusicFarsi





def home(request):
    context = {}
    context['Categories'] = SITE_SOURCE.get_dict_categories()
    return render(request, 'home.html', context)



def get_music_handle():
    pass

@csrf_exempt
@require_POST
def getMusic(request):
    if request.is_ajax():
        random_music = RandomMusic.objects.first()
        if random_music:
            context = {}
            STATUS = 0
            site = SITE_SOURCE()
            random_music.count_play_music = int(random_music.count_play_music) + 1
            random_music.save()

            data = json.loads(request.body)
            category = data.get('category') or None
            music = site.get_music(category)
            site.add_music_to_list(category)

            if music:
                STATUS = '200'
            else:
                STATUS = '404'
            context['Music'] = music
            context['Status'] = STATUS

            return JsonResponse(context)
        return JsonResponse({'Status': '404'})
    raise PermissionDenied
