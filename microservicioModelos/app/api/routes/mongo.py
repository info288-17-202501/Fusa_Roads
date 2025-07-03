from fastapi import APIRouter, HTTPException
from pymongo import MongoClient
from bson.objectid import ObjectId
import os

router = APIRouter(prefix="/mongo", tags=["mongo"])

MONGO_HOST = os.getenv("MONGO_HOST", "mongo")
MONGO_PORT = int(os.getenv("MONGO_PORT", "27017"))
MONGO_DB = os.getenv("MONGO_DB", "testdb")
MONGO_COLLECTION = os.getenv("MONGO_COLLECTION", "testcollection")
MONGO_USER = os.getenv("MONGO_USER", "root")
MONGO_PASS = os.getenv("MONGO_PASS", "example")
mongo_uri = f"mongodb://{MONGO_USER}:{MONGO_PASS}@{MONGO_HOST}:{MONGO_PORT}/"

client = MongoClient(mongo_uri)

db = client[MONGO_DB]
collection = db[MONGO_COLLECTION]

def serialize_doc(doc):
    doc["_id"] = str(doc["_id"])
    return doc

@router.get("/datos")
def get_all_docs():
    try:
        docs = collection.find()
        return [serialize_doc(doc) for doc in docs]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/datos/{id}")
def get_doc_by_id(id: str):
    try:
        doc = collection.find_one({"_id": ObjectId(id)})
        if not doc:
            raise HTTPException(status_code=404, detail="Documento no encontrado")
        return serialize_doc(doc)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
