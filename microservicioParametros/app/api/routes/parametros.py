from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any
from pydantic import BaseModel
from api.models.parametros import Config
from bson import ObjectId, errors as bson_errors
from config.db import conn

router = APIRouter(prefix="/parametros", tags=["parametros"])





# parametros por id
@router.get("/{parametro_id}", response_model=Config)
def get_parametro(parametro_id: str):
    try:
        oid = ObjectId(parametro_id)
    except bson_errors.InvalidId:
        raise HTTPException(status_code=400, detail="ID no válido")

    if (parametro := conn.fusa.parametrosPia.find_one({"_id": oid})) is not None:
        return Config.from_mongo(parametro)

    raise HTTPException(status_code=404, detail=f"Parametro {parametro_id} no encontrado")