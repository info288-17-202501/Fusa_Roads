import json
from fastapi import APIRouter, HTTPException, Depends
from pathlib import Path
from typing import List, Dict, Any
from pydantic import BaseModel
from app.utils.json_utils import read_json, write_json

router = APIRouter(prefix="/parametros", tags=["parametros"])

BASE_DIR = Path(__file__).resolve().parent.parent.parent 
JSON_PATH = BASE_DIR / "database" / "json" / "data.json"

# estos irian en models

class Parametro(BaseModel):
    id: int
    nombre: str
    videoSalida: Dict[str, Any]
    ventanasTiempo: Dict[str, Any]
    modelos: Dict[str, Dict[str, Any]]
    videos: List[Dict[str, Any]]





# parametros por id
@router.get("/{parametro_id}", response_model=Parametro)
def get_parametro(parametro_id: int):
    parametros = read_json(JSON_PATH)

    parametro = next((p for p in parametros if p["id"] == parametro_id), None)
    
    if not parametro:
        raise HTTPException(status_code=404, detail=f"Parámetro de PIA no encontrado ")
    return parametro


#crear nuevo parametro PIA
@router.post("/", response_model=Parametro, status_code=201)
def create_parametro(parametro: Parametro):
    parametros = read_json(JSON_PATH)
    
    if any(p["id"] == parametro.id for p in parametros):
        raise HTTPException(status_code=400, detail="ID ya existe")
    
    parametros.append(parametro.dict())
    write_json(parametros, JSON_PATH)
    return parametro

#actualizar parametro existente PIA
@router.put("/{parametro_id}", response_model=Parametro)
def update_parametro(parametro_id: int, parametro: Parametro):
    parametros = read_json( JSON_PATH)
    index = next((i for i, p in enumerate(parametros) if p["id"] == parametro_id), None)
    
    if index is None:
        raise HTTPException(status_code=404, detail="Parámetro no encontrado")
    
    if parametro_id != parametro.id:
        raise HTTPException(status_code=400, detail="ID no coincide con el cuerpo")
    
    parametros[index] = parametro.dict()
    write_json(parametros, JSON_PATH)
    return parametro


## eliminar por id parametro PIA
@router.delete("/{parametro_id}", status_code=204)
def delete_parametro(parametro_id: int):
    parametros = read_json( JSON_PATH)
    index = next((i for i, p in enumerate(parametros) if p["id"] == parametro_id), None)
    
    if index is None:
        raise HTTPException(status_code=404, detail="Parámetro no encontrado")
    
    parametros.pop(index)
    write_json(parametros, JSON_PATH)
    return None