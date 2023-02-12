from django.conf import settings
from bs4 import BeautifulSoup
from Config import redis
from Config.task import Loop, Task
import os
import random
import requests
import json



loop = Loop()

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

    def createConnection(self, address):
        raise NotImplementedError

    def add_music_to_list(self, category):
        addrs = f"LIST_MUSIC_{category}"

        def target(category):
            music = self.get_handler_category(category)()
            redis.add_to_list(addrs, music)

        
        # Add musics with ever request
        #loop.add(Task(target, args=(category,)))
        loop.add(Task(target, args=(category,)))

        loop.start_thread()

        len_list_music = redis.get_len_list(addrs)
        if len_list_music > 1:  
            """
                The music list starts to refresh
            """
            # Removes music
            #redis.remove_first_element_list(addrs)
            redis.remove_first_element_list(addrs)
            # redis.remove_first_element_list(addrs)
            # redis.remove_first_element_list(addrs)

    def get_music(self, category):
        addrs = f"LIST_MUSIC_{category}"
        list_music = redis.get_list(addrs)
        if list_music:
            random_num = random.randint(0, len(list_music) - 1)
            music_packed = list_music[random_num]
            music = redis.unpack_data(music_packed)
        else:
            music = self.get_handler_category(category)()


        return music

    def close(self):
        del self


class MusicFarsi(MusicSiteBase):
    """
        www.musicsfarsi.com
    """
    LIST_CATEGORIES = [
        # method get music - category music - category music name
        ('get_at_all', 'All', 'همه'),
        ('get_at_sad', 'Sad', 'غمگین'),
        ('get_at_happy', 'Happy', 'شاد'),
        ('get_at_remix', 'Remix', 'ریمیکس'),
    ]

    def createConnection(self, address):
        page = requests.get(address)
        soup = BeautifulSoup(page.content, "html.parser")
        return soup


    def get_pages_count(self, soup):
        return int(
            soup.select_one('#wp_page_numbers .first_last_page a').text) - 1

    def get_musics_in_page(self, soup):
        return soup.select('.post')

    # Get Music
    def _get_music(self, address):
        soup = self.createConnection(address)

        # Find random page in pages
        pages_count = self.get_pages_count(soup)
        page_random = random.randrange(1, pages_count)
        soup = self.createConnection(f"{address}page/{page_random}/")

        # Find random Music in page
        musics_in_page = self.get_musics_in_page(soup)
        music_random = random.randrange(1, len(musics_in_page) - 1)
        address_music = musics_in_page[music_random].select_one('.post-more-link a').get(
            'href')
        soup = self.createConnection(address_music)
        cover = soup.select_one('.post .post-content img').get('src')
        name = soup.select_one('.post .entry-title a').text
        # Remove word "دانلود" at title
        name = name.replace('دانلود', '')
        music = soup.select_one('.post .download .button a').get('href')
        return {
            'cover': cover,
            'name': name,
            'music': music
        }

    def get_at_all(self):
        """
            Get music at this address
        """
        return self._get_music('https://musicsfarsi.com/')

    def get_at_sad(self):
        """
            Get music at this address
        """
        return self._get_music('https://musicsfarsi.com/sad-song/')

    def get_at_happy(self):
        """
            Get music at this address
        """
        return self._get_music('https://musicsfarsi.com/love-song/')

    def get_at_remix(self):
        """
            Get music at this address
        """
        # return self.get_music('https://musicsfarsi.com/remix-song/')

        address = 'https://musicsfarsi.com/remix-song/'
        soup = self.createConnection(address)

        # Find random page in pages
        pages_count = self.get_pages_count(soup)
        page_random = random.randrange(1, pages_count)
        soup = self.createConnection(f"{address}page/{page_random}/")

        # Find random Music in page
        musics_in_page = self.get_musics_in_page(soup)
        music_random = random.randrange(1, len(musics_in_page) - 1)
        address_music = musics_in_page[music_random].select_one('.post-more-link a').get(
            'href')
        soup = self.createConnection(address_music)
        cover = soup.select_one('.post .post-content img').get('src')
        name = soup.select_one('.post .entry-title a').text
        # Remove word "دانلود" at title
        name = name.replace('دانلود', '')
        music = ''
        # Runs until get music
        try:
            music = soup.select_one('.post audio').get('src')
        except:
            self.get_at_remix()

        return {
            'cover': cover,
            'name': name,
            'music': music
        }
