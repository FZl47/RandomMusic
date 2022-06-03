from django.db import models

class RandomMusic(models.Model):
    count_play_music = models.CharField(max_length=150,default="0",verbose_name='تعداد موزیک های پخش شده')

    def __str__(self):
        return 'Random Music'