from fastapi import APIRouter, HTTPException
from pymongo import MongoClient
from bson.objectid import ObjectId
from bson.errors import InvalidId
from fastapi import Body
import os

router = APIRouter(prefix="/mongo", tags=["mongo"])

MONGO_HOST = os.getenv("MONGO_HOST", "mongo")
MONGO_PORT = int(os.getenv("MONGO_PORT", "27017"))
MONGO_DB = os.getenv("MONGO_DB", "fusa_roads")
MONGO_COLLECTION = os.getenv("MONGO_COLLECTION", "modelosIA")
MONGO_USER = os.getenv("MONGO_USER", "root")
MONGO_PASS = os.getenv("MONGO_PASS", "example")
mongo_uri = f"mongodb://{MONGO_USER}:{MONGO_PASS}@{MONGO_HOST}:{MONGO_PORT}/"

client = MongoClient(mongo_uri)
db = client[MONGO_DB]
collection = db[MONGO_COLLECTION]

def serialize_doc(doc):
    doc["_id"] = str(doc["_id"])
    return doc

# GET ALL
@router.get("/datos")
def get_all_docs():
    try:
        docs = collection.find()
        return [serialize_doc(doc) for doc in docs]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# GET BY ID
@router.get("/datos/{id}")
def get_doc_by_id(id: str):
    try:
        if not ObjectId.is_valid(id):
            raise HTTPException(status_code=400, detail="ID inválido")
        doc = collection.find_one({"_id": ObjectId(id)})
        if not doc:
            raise HTTPException(status_code=404, detail="Documento no encontrado")
        return serialize_doc(doc)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# POST
@router.post("/datos")
def create_doc(payload: dict = Body(...)):
    try:
        result = collection.insert_one(payload)
        new_doc = collection.find_one({"_id": result.inserted_id})
        return serialize_doc(new_doc)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    
# PUT
@router.put("/datos/{id}")
def update_doc(id: str, payload: dict = Body(...)):
    try:
        if not ObjectId.is_valid(id):
            raise HTTPException(status_code=400, detail="ID inválido")
        result = collection.update_one({"_id": ObjectId(id)}, {"$set": payload})
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Documento no encontrado")
        updated_doc = collection.find_one({"_id": ObjectId(id)})
        return serialize_doc(updated_doc)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# DELETE
@router.delete("/datos/{id}")
def delete_doc(id: str):
    try:
        if not ObjectId.is_valid(id):
            raise HTTPException(status_code=400, detail="ID inválido")
        result = collection.delete_one({"_id": ObjectId(id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Documento no encontrado")
        return {"message": "Documento eliminado correctamente"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
