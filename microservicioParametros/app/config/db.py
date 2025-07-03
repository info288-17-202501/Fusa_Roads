from pymongo import MongoClient
from config.settings import settings


mongoURI = settings.MONGOURI

# conn = MongoClient(mongoURI)
conn = MongoClient("mongodb://host.docker.internal:27017")
db = conn["fusa"]