from pymongo import MongoClient
from config.settings import settings


mongoURI = settings.MONGOURI

# conn = MongoClient(mongoURI)
conn = MongoClient(settings.MONGOURI )