from fastapi import APIRouter, HTTPException, Request, Query
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import json
import os
import sys
from pathlib import Path

router = APIRouter(prefix="/estadopia", tags=["estadopia"])


BASE_DIR = Path(__file__).resolve().parent.parent.parent 
ESTADOS_FILE = BASE_DIR / "database" / "json" / "data.json"

print(ESTADOS_FILE)


if not os.path.exists(ESTADOS_FILE):
    with open(ESTADOS_FILE, "w") as f:
        json.dump({}, f)

class Estado(BaseModel):
    estado: str
    orden: int
    fecha_hora_ini: str
    fecha_hora_fin: Optional[str] = ""
    flag: Optional[str] = ""
    descrip: Optional[str] = ""






def cargar_estados():
    with open(ESTADOS_FILE, "r") as f:
        return json.load(f)

def guardar_estados(data):
    with open(ESTADOS_FILE, "w") as f:
        json.dump(data, f, indent=2)



@router.post("/estadopia/{pia_id}")
async def crear_estado(pia_id: int, estado: Estado): ## aqui toma como parametro el id del URL y el body del request como Estado
    data = cargar_estados()
    pia_id_str = str(pia_id)

    if pia_id_str not in data:
        data[pia_id_str] = [] # si no existe el proyecto, lo crea como una lista vacia


    data[pia_id_str].append(estado.dict()) # agrega el nuevo estado a la lista de estados del proyecto

    guardar_estados(data)

    return {"mensaje": "Estado creado", "estado": estado}



@router.put("/estadopia/{pia_id}")
async def actualizar_estado(pia_id: int, estado_query: str = Query(...), request: Request = None): # aqui se recibe el id del proyecto y el estado a actualizar
    data = cargar_estados()
    pia_id_str = str(pia_id)

    if pia_id_str not in data:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")

    estados = data[pia_id_str] # pia_id_str es el id del proyecto, y estados es la lista de estados del proyecto

    encontrado = False

    body = await request.json()

    for est in estados:
        if est["estado"] == estado_query:
            est["fecha_hora_fin"] = body.get("fecha-hora-fin", est["fecha_hora_fin"])
            est["flag"] = body.get("flag", est["flag"])
            est["descrip"] = body.get("descrip", est["descrip"])
            encontrado = True
            break

    if not encontrado:
        raise HTTPException(status_code=404, detail="Estado no encontrado")

    guardar_estados(data)
    return {"mensaje": "Estado actualizado", "estado": estado_query}



@router.get("/estadopia/{pia_id}")
async def obtener_estados(pia_id: int):
    data = cargar_estados()
    pia_id_str = str(pia_id)

    if pia_id_str not in data:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")

    return {"estados": data[pia_id_str]}
