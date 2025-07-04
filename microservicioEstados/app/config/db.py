from pymongo import MongoClient
from config.settings import settings

mongoURI = settings.MONGOURI

# conn = MongoClient(mongoURI)
conn = MongoClient(settings.MONGOURI)
#db = conn[settings.MONGO_DB] 

db = conn["fusa_roads"] 
