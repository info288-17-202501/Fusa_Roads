from fastapi import APIRouter, HTTPException, Request, Query
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from config.db import conn
#from api.models.estadopia import Config
from pydantic import Field
router = APIRouter(prefix="/estadopia", tags=["estadopia"])

class Avance(BaseModel):
    actual: int
    total: int

class Config(BaseModel):
    #id: str = Field(..., alias="_id")  
    pia_id: Optional[str] = None 
    estado: Optional[str] = None
    orden: Optional[int] = None
    fecha_hora_ini: Optional[str] = None  # Opcional
    fecha_hora_fin: Optional[str] = None  # Opcional
    flag: Optional[str] = None  # Opcional
    descrip: Optional[str] = None  # Opciona
    avance: Optional[Avance] = None  # Opcional, para el avance del estado



@router.post("/{pia_id}", response_model=Config)
def crear_estado(pia_id: str,estado_mandado: Config ,request: Request):
     
    try:
        nuevo_estado = {
            "estado": estado_mandado.estado,
            "orden": estado_mandado.orden,
            "fecha_hora_ini": estado_mandado.fecha_hora_ini,
            "fecha_hora_fin": "",
            "flag": "",
            "descrip": "",
        }
        
        if estado_mandado.avance:
            nuevo_estado["avance"] = {
                "actual": estado_mandado.avance.actual,
                "total": estado_mandado.avance.total,
            }

        doc =  conn.fusa.estados.find_one({"pia_id": pia_id})

        if doc:
            result =  conn.fusa.estados.update_one(
                {"pia_id": pia_id},
                {"$push": {"estados": nuevo_estado}}
            )
        else:
            result =  conn.fusa.estados.insert_one({
                "pia_id": pia_id,
                "fecha_inicio": datetime.utcnow(),
                "estados": [nuevo_estado]
            })

        return {"status": "ok", "estado_creado": nuevo_estado}
        
    except Exception as e:
        raise HTTPException(status_code=422, detail=str(e))




@router.put("/{pia_id}/{estado}", response_model=dict)
def crear_estado(estado_mandado: Config , pia_id : str, estado: str ,request: Request):


    try:
        update_data = {
            f"estados.$[element].{k}": v
            for k, v in estado_mandado.model_dump(by_alias=True, exclude_unset=True).items()
            }
        
        result =  conn.fusa.estados.find_one_and_update(
            {"pia_id": pia_id},
            {"$set": update_data},
            array_filters=[{"element.estado": estado}],  # Aquí filtramos por estado
            return_document=True,
    )



        
        if result is None:
            raise HTTPException(status_code=404, detail="Documento no encontrado.")
        
        result["_id"] = str(result["_id"])
        return {"status": "ok", "estado_actualizado": result}
        
    except Exception as e:
        raise HTTPException(status_code=422, detail=str(e))

