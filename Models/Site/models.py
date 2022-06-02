from django.conf import settings
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium import webdriver
import os
import random


class MusicSiteBase:

    @classmethod
    def get_dict_categories(cls):
        data = []
        for category in cls.LIST_CATEGORIES:
            data.append({
                'category': category[1],
                'category_name': category[2],
            })
        return data

    def get_handler_category(self, category_name):
        for category in self.LIST_CATEGORIES:
            if category[1] == category_name:
                return getattr(self, category[0])

    def get_driver(self):
        # Selenium
        # Use Chrome Driver
        path = os.path.join(settings.BASE_DIR,'Driver/chromedriver.exe')
        driver = webdriver.Chrome(executable_path=path)
        return driver

    def close(self):
        del self



class MusicFarsi(MusicSiteBase):
    LIST_CATEGORIES = [
        # method get music - category music - category music name
        ('get_at_all', 'All', 'همه'),
        ('get_at_sad', 'Sad', 'غمگین'),
        ('get_at_happy', 'Happy', 'شاد'),
        ('get_at_remix', 'Remix', 'ریمیکس'),
    ]

    def get_pages_count(self):
        pass

    def get_count_music_in_per_page(self):
        pass

    def get_at_all(self):
        pass

    def get_at_sad(self):
        pass

    def get_at_happy(self):
        pass

    def get_at_remix(self):
        pass


