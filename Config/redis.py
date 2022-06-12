from .settings import REDIS_CONFIG
import redis
import pickle

REDIS = redis.Redis(**REDIS_CONFIG)

def pack_data(data):
    return pickle.dumps(data)

def unpack_data(data):
    return pickle.loads(data)

def add_to_list(key,data):
    data = pack_data(data)
    REDIS.lpush(key,data)
    return True

def get_list(key):
    data = REDIS.lrange(key,0,-1)
    return data

def get_len_list(key):
    return REDIS.llen(key)

def remove_first_element_list(key):
    REDIS.lpop(key)
    return True

def remove_key(key):
    REDIS.delete(key)
    return True

def clear_db():
    REDIS.flushdb()
    return True
