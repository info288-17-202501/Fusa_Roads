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




@router.post("/execpia/{parametro_front_id}")
def crear_parametrospia(parametro_front_id: str):
    try:
        oid = ObjectId(parametro_front_id)
    except bson_errors.InvalidId:
        raise HTTPException(status_code=400, detail="ID no válido")
    
    parametro_front = conn.fusa_roads.parametrosFront.find_one({"_id": oid})
    if parametro_front is None:
        raise HTTPException(status_code=404, detail=f"Parametro {parametro_front_id} no encontrado en parametrosFront")
    
    existing_pia = conn.fusa_roads.parametrosPia.find_one({"parametro_front_id": oid})
    if existing_pia:
        raise HTTPException(status_code=400, detail="Ya existe una relación para este parámetro")
    
    # Crear la estructura base del documento parametrosPia
    parametro_pia = {
        "nombre": parametro_front.get("nombre_proyecto", "proceso1"),
        "params": {
            "server": True,
            "model-yolo": {
                "version": parametro_front.get("modelo_video", "yolo12s.pt"),
                "conf_min": 0.6,
                "tracker": {
                    "max_age": 30,
                    "n_init": 1,
                    "max_cosine_distance": 0.3
                }
            },
            "pann": {
                "ruta": parametro_front.get("modelo_audio", "Cnn14_DecisionLevelMax.pth"),
                "umbral": 0.1,
                "margen_frames": 20
            },
            "contexto": parametro_front.get("nombre_proyecto", "prueba"),
            "video": "",
            "regiones": "",
            "dispositivo": "cuda"
        },
        "videos": [],
        "parametro_front_id": oid  
    }
    
    lista_videos = parametro_front.get("lista_videos", [])
    
    for video in lista_videos:
        if video.get("activo", False):
            regiones_obj = {}
            
            if "linea" in video and video["linea"]:
                regiones_obj["line"] = [
                    [punto["x"], punto["y"]] for punto in video["linea"]
                ]
            
            if "poligono" in video and video["poligono"]:
                regiones_obj["polygon"] = [
                    [punto["x"], punto["y"]] for punto in video["poligono"]
                ]
            
            video_data = {
                "ruta": video.get("name", ""),
                "gps_manual": video.get("gps_manual", ""),
                "ruta_video_minio": video.get("ruta_video_minio", ""),
                "ruta_miniatura_minio": video.get("ruta_miniatura_minio", ""),
                "minio_bucket": video.get("minio_bucket", ""),
                "regiones": regiones_obj
            }
            
            parametro_pia["videos"].append(video_data)
    
    result = conn.fusa_roads.parametrosPia.insert_one(parametro_pia)
    nuevo_doc = conn.fusa_roads.parametrosPia.find_one({"_id": result.inserted_id})
    
    nuevo_doc["_id"] = str(nuevo_doc["_id"])
    nuevo_doc["parametro_front_id"] = str(nuevo_doc["parametro_front_id"])
    
    return nuevo_doc
