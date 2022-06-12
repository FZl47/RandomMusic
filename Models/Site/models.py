from django.conf import settings
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.options import Options
from selenium import webdriver
from Config.redis import add_to_list, get_list, unpack_data, get_len_list, remove_first_element_list
from Config import redis
from Config.task import Loop, Task
import os
import random

OPERATING_SYSTEM = 'window'
DRIVER = None
loop = Loop()


def create_driver():
    path = os.path.join(settings.BASE_DIR, f'Driver/{OPERATING_SYSTEM}/chromedriver.exe')
    chrome_options = Options()
    chrome_options.add_argument('--headless')
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-dev-shm-usage')
    return webdriver.Chrome(executable_path=path, chrome_options=chrome_options)


def get_driver():
    global DRIVER
    # Selenium
    # Use Chrome Driver
    if DRIVER == None:
        DRIVER = create_driver()
    return DRIVER



class MusicSiteBase:

    def __init__(self):
        self.DRIVER = None

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

    def createConnection(self, driver):
        raise NotImplementedError

    def add_music_to_list(self, category):
        addrs = f"LIST_MUSIC_{category}"


        def target(category, driver):
            music = self.get_handler_category(category)(driver)
            redis.add_to_list(addrs, music)
        # Add two music with ever request
        loop.add(Task(target, args=(category, get_driver())))
        loop.add(Task(target, args=(category, get_driver())))
        loop.add(Task(target, args=(category, get_driver())))
        loop.add(Task(target, args=(category, get_driver())))
        loop.start_thread()

        len_list_music = redis.get_len_list(addrs)
        if len_list_music > 30:
            """
                The music list starts to refresh
            """
            # Removes music
            redis.remove_first_element_list(addrs)
            redis.remove_first_element_list(addrs)
            redis.remove_first_element_list(addrs)
            redis.remove_first_element_list(addrs)

    def get_music(self, category):
        addrs = f"LIST_MUSIC_{category}"
        list_music = redis.get_list(addrs)
        if list_music:
            random_num = random.randint(0, len(list_music) - 1)
            music_packed = list_music[random_num]
            music = redis.unpack_data(music_packed)
        else:
            driver = create_driver()
            music = self.get_handler_category(category)(driver)
            driver.close()

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

    def createConnection(self, driver, address):
        driver.get(address)
        return driver

    def get_pages_count(self, driver):
        return int(
            driver.find_element_by_css_selector('#wp_page_numbers .first_last_page a').get_attribute('innerHTML')) - 1

    def get_musics_in_page(self, driver):
        return driver.find_elements_by_css_selector('.post')

    # Get Music
    def _get_music(self, address, driver):
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
        music = driver.find_element_by_css_selector('.post .download .button a').get_attribute('href')
        # Close Driver
        # driver.close()

        return {
            'cover': cover,
            'name': name,
            'music': music
        }

    def get_at_all(self, driver):
        """
            Get music at this address
        """
        return self._get_music('https://musicsfarsi.com/', driver)

    def get_at_sad(self, driver):
        """
            Get music at this address
        """
        return self._get_music('https://musicsfarsi.com/sad-song/', driver)

    def get_at_happy(self, driver):
        """
            Get music at this address
        """
        return self._get_music('https://musicsfarsi.com/love-song/', driver)

    def get_at_remix(self, driver):
        """
            Get music at this address
        """
        # return self.get_music('https://musicsfarsi.com/remix-song/')

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
        # driver.close()
        return {
            'cover': cover,
            'name': name,
            'music': music
        }
