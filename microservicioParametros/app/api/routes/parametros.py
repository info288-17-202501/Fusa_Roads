from fastapi import APIRouter, HTTPException, Depends, Body
from typing import List, Union
from pydantic import BaseModel
from api.models.parametros import Config, Params, ConfigResponse, ParamsResponse
from bson import ObjectId, errors as bson_errors
from config.db import conn

router = APIRouter(prefix="/parametros", tags=["parametros"])


print (conn)


@router.get("/")
def get_todos_parametros_raw():
    documentos = conn.fusa_roads.parametrosFront.find()
    result = []
    for doc in documentos:
        doc["_id"] = str(doc["_id"])
        result.append(doc)
    return result




@router.post("/")
def crear_parametro(parametro: dict = Body(...)):


    result = conn.fusa_roads.parametrosFront.insert_one(parametro)
    nuevo_doc = conn.fusa_roads.parametrosFront.find_one({"_id": result.inserted_id})
    
    nuevo_doc["_id"] = str(nuevo_doc["_id"])
    return nuevo_doc



## get en formato del documento
# @router.get("/", response_model=List[Union[Config,Params]])
# def get_todos_parametros():
#     documentos = conn.fusa_roads.parametrosPia.find()



    
#     return [(Config.from_mongo(doc) if doc["tipo"]== 1 else Params.from_mongo(doc) ) for doc in documentos]




# parametros por id
@router.get("/{parametro_id}", response_model=Union[ConfigResponse, ParamsResponse])
def get_parametro(parametro_id: str):
    try:
        oid = ObjectId(parametro_id)
    except bson_errors.InvalidId:
        raise HTTPException(status_code=400, detail="ID no válido")
    
    if (parametro := conn.fusa_roads.parametrosPia.find_one(
        {"_id": oid}, 
        {"nombre": 0}  
    )) is not None:
        return ConfigResponse.from_mongo(parametro) if parametro["tipo"] == 1 else ParamsResponse.from_mongo(parametro)
    
    raise HTTPException(status_code=404, detail=f"Parametro {parametro_id} no encontrado")




# @router.post("/", response_model=Union[Config,Params])
# def crear_parametro(parametro: Union[Config,Params] = Body(...) ):

    
#     data = parametro.dict(by_alias=True, exclude_unset=True)

#     if isinstance(parametro, Config):
#         data["tipo"] = 1
#     else:
#         data["tipo"] = 2


       

#     result = conn.fusa_roads.parametrosPia.insert_one(data)
#     nuevo_doc = conn.fusa_roads.parametrosPia.find_one({"_id": result.inserted_id})
    


#     return Config.from_mongo(nuevo_doc) if isinstance(parametro, Config) else Params.from_mongo(nuevo_doc)
