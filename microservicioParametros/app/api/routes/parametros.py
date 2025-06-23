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
        #parametro["id"] = str(parametro.pop("_id"))  # <-- Esto quita `_id` y lo asigna a `id`
        return Config.from_mongo(parametro)

    raise HTTPException(status_code=404, detail=f"Parametro {parametro_id} no encontrado")


# #crear nuevo parametro PIA
# @router.post("/", response_model=Config, status_code=201)
# def create_parametro(parametro: Parametro):
#     parametros = read_json(JSON_PATH)
    
#     if any(p["id"] == parametro.id for p in parametros):
#         raise HTTPException(status_code=400, detail="ID ya existe")
    
#     parametros.append(parametro.dict())
#     write_json(parametros, JSON_PATH)
#     return parametro

# #actualizar parametro existente PIA
# @router.put("/{parametro_id}", response_model=Parametro)
# def update_parametro(parametro_id: int, parametro: Parametro):
#     parametros = read_json( JSON_PATH)
#     index = next((i for i, p in enumerate(parametros) if p["id"] == parametro_id), None)
    
#     if index is None:
#         raise HTTPException(status_code=404, detail="Parámetro no encontrado")
    
#     if parametro_id != parametro.id:
#         raise HTTPException(status_code=400, detail="ID no coincide con el cuerpo")
    
#     parametros[index] = parametro.dict()
#     write_json(parametros, JSON_PATH)
#     return parametro


# ## eliminar por id parametro PIA
# @router.delete("/{parametro_id}", status_code=204)
# def delete_parametro(parametro_id: int):
#     parametros = read_json( JSON_PATH)
#     index = next((i for i, p in enumerate(parametros) if p["id"] == parametro_id), None)
    
#     if index is None:
#         raise HTTPException(status_code=404, detail="Parámetro no encontrado")
    
#     parametros.pop(index)
#     write_json(parametros, JSON_PATH)
#     return None