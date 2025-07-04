from fastapi import APIRouter, HTTPException, Request, Query
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from config.db import conn, db
from bson import ObjectId

#from api.models.estadopia import Config
from pydantic import Field
router = APIRouter(prefix="/estadopia", tags=["estadopia"])

print(db)

class Avance(BaseModel):
    actual: int
    total: int

class Config(BaseModel):
    #id: str = Field(..., alias="_id")
    pia_id: Optional[str] = None  # Opcional, para el ID del PIA
    estado: Optional[str] = None
    orden: Optional[int] = None
    fecha_hora_ini: Optional[str] = None  # Opcional
    fecha_hora_fin: Optional[str] = None  # Opcional
    flag: Optional[str] = None  # Opcional
    descrip: Optional[str] = None  # Opciona
    avance: Optional[Avance] = None  # Opcional, para el avance del estado




def fix_mongo_ids(doc):
    doc["_id"] = str(doc["_id"])
    return doc



@router.get("/")
def get_estados():
    documentos = list(db.estados.find())  
    documentos = [fix_mongo_ids(doc) for doc in documentos]
    return documentos



@router.post("/{p_id}", response_model=Config)
def crear_estado(p_id: str,estado_mandado: Config ,request: Request):
     
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

        doc =  db.estados.find_one({"_id": ObjectId(p_id)})

        if doc:
            result =  db.estados.update_one(
                {"_id": ObjectId(p_id)},
                {"$push": {"estados": nuevo_estado}}
            )

        return {"status": "ok", "estado_creado": nuevo_estado}
        
    except Exception as e:
        raise HTTPException(status_code=422, detail=str(e))



## CAMBIAR

class Inicio(BaseModel):
    id: str

class ProcesoCreado(BaseModel):
    fecha_hora_ini: str 


@router.post("/ini/{pia_id}", response_model=Inicio)
def crear_proceso(pia_id: str, estado_mandado: ProcesoCreado):
     
    result =  db.estados.insert_one({
        "pia_id": pia_id,
        "fecha_inicio": estado_mandado.fecha_hora_ini
    })

    return Inicio(
        id= str(result.inserted_id))



# Modelo para finalizar proceso
class FinalizarProceso(BaseModel):
    fecha_fin: str

# Endpoint para finalizar proceso completo
@router.put("/finalizar/{p_id}", response_model=dict)
def finalizar_proceso(p_id: str, finalizacion: FinalizarProceso):
    try:
        # Actualizar el documento agregando fecha_fin
        result = db.estados.update_one(
            {"_id": ObjectId(p_id)},
            {"$set": {"fecha_fin": finalizacion.fecha_fin}}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Proceso no encontrado")
        
        if result.modified_count == 0:
            raise HTTPException(status_code=400, detail="El proceso ya estaba finalizado")
        
        # Obtener el documento actualizado
        doc = db.estados.find_one({"_id": ObjectId(p_id)})
        doc = fix_mongo_ids(doc)
        
        return {"status": "ok", "proceso_finalizado": doc}
        
    except Exception as e:
        raise HTTPException(status_code=422, detail=str(e))

@router.put("/{p_id}/{estado}", response_model=dict)
def crear_estado(estado_mandado: Config , p_id : str, estado: str):


    try:
        update_data = {
            f"estados.$[element].{k}": v
            for k, v in estado_mandado.model_dump(by_alias=True, exclude_unset=True).items()
            }
        
        result =  db.estados.find_one_and_update(
            {"_id": ObjectId(p_id)},
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

