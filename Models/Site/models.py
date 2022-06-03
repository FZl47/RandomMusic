from django.conf import settings
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium import webdriver
import os
import random

OPERATING_SYSTEM = 'window'

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

        path = os.path.join(settings.BASE_DIR,f'Driver/{OPERATING_SYSTEM}/chromedriver.exe')
        driver = webdriver.Chrome(executable_path=path)
        return driver

    def createConnection(self,driver):
        raise NotImplementedError

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

    def createConnection(self,driver,address):
        driver.get(address)
        return driver

    def get_pages_count(self,driver):
        return int(driver.find_element_by_css_selector('#wp_page_numbers .first_last_page a').get_attribute('innerHTML')) - 1

    def get_musics_in_page(self,driver):
        return driver.find_elements_by_css_selector('.post')

    # Get Music
    def get_music(self,address):
        driver = self.get_driver()
        self.createConnection(driver, address)

        # Find random page in pages
        pages_count = self.get_pages_count(driver)
        page_random = random.randrange(1,pages_count)
        self.createConnection(driver,f"{address}page/{page_random}/")

        # Find random Music in page
        musics_in_page = self.get_musics_in_page(driver)
        music_random = random.randrange(1,len(musics_in_page) - 1)
        address_music = musics_in_page[music_random].find_element_by_css_selector('.post-more-link a').get_attribute('href')
        self.createConnection(driver,address_music)
        cover = driver.find_element_by_css_selector('.post .post-content img').get_attribute('src')
        name = driver.find_element_by_css_selector('.post .entry-title a').get_attribute('innerHTML')
        # Remove word "دانلود" at title
        name = name.replace('دانلود','')
        music = driver.find_element_by_css_selector('.post .download .button a').get_attribute('href')
        # Close Driver
        driver.close()
        return {
            'cover':cover,
            'name':name,
            'music':music
        }


    def get_at_all(self):
        """
            Get music at this address
        """
        return self.get_music('https://musicsfarsi.com/')

    def get_at_sad(self):
        """
            Get music at this address
        """
        return self.get_music('https://musicsfarsi.com/sad-song/')

    def get_at_happy(self):
        """
            Get music at this address
        """
        return self.get_music('https://musicsfarsi.com/love-song/')

    def get_at_remix(self):
        """
            Get music at this address
        """
        # return self.get_music('https://musicsfarsi.com/remix-song/')

        driver = self.get_driver()
        address = 'https://musicsfarsi.com/remix-song/'
        self.createConnection(driver, address)

        # Find random page in pages
        pages_count = self.get_pages_count(driver)
        page_random = random.randrange(1, pages_count)
        self.createConnection(driver, f"{address}page/{page_random}/")

        # Find random Music in page
        musics_in_page = self.get_musics_in_page(driver)
        music_random = random.randrange(1, len(musics_in_page) - 1)
        address_music = musics_in_page[music_random].find_element_by_css_selector('.post-more-link a').get_attribute(
            'href')
        self.createConnection(driver, address_music)
        cover = driver.find_element_by_css_selector('.post .post-content img').get_attribute('src')
        name = driver.find_element_by_css_selector('.post .entry-title a').get_attribute('innerHTML')
        # Remove word "دانلود" at title
        name = name.replace('دانلود', '')
        music = ''
        try:
            music = driver.find_element_by_css_selector('.post audio.powerpress-mejs-audio').get_attribute('src')
        except:
            pass
        # Close Driver
        driver.close()
        return {
            'cover': cover,
            'name': name,
            'music': music
        }



