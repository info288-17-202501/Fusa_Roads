from fastapi import FastAPI, HTTPException
from pymongo import MongoClient
from minio import Minio
from minio.error import S3Error
import os
import subprocess
import json
from bson import ObjectId


app = FastAPI()

# Configuración MongoDB y MinIO
mongo_client = MongoClient("mongodb://root:example@localhost:27017")
db = mongo_client["fusa_roads"]

minio_client = Minio(
    "localhost:9000", 
    access_key="minioadmin", 
    secret_key="minioadmin", 
    secure=False
)

@app.post("/procesar/{doc_id}")
def procesar(doc_id: str):
    # 1. Obtener parámetros de Mongo
    parametrosPia = db["parametrosPia"]

    try:
        doc = parametrosPia.find_one({"_id": ObjectId(doc_id)})
    except:
        raise HTTPException(status_code=400, detail="ID inválido, no es un ObjectId válido")

    if not doc:
        raise HTTPException(status_code=404, detail="Documento no encontrado")


    contexto = doc.get("params", {}).get("contexto", "")
    lista_videos = doc.get("videos", [])

    for video in lista_videos:
        video_path_minio = video.get("ruta_video_minio", "")
        bucket = video.get("minio_bucket", "")
        nombre_archivo_local = video.get("ruta", "")

        local_file = os.path.join("videos", contexto, nombre_archivo_local)

        # Crear directorio si no existe
        os.makedirs(os.path.dirname(local_file), exist_ok=True)

        try:
            minio_client.fget_object(bucket, video_path_minio, f"videos/{contexto}/{nombre_archivo_local}")
            print(f"Archivo descargado exitosamente a {local_file}")
        except S3Error as e:
            raise HTTPException(status_code=500, detail=f"Error al descargar desde MinIO: {e}")

        # Generar regions.json
        regiones = video.get("regiones", [])

        regions_path = os.path.join("regions", contexto)
        os.makedirs(regions_path, exist_ok=True)

        regions_file = os.path.join(regions_path, "regions.json")
        try:
            with open(regions_file, "w") as f:
                json.dump(regiones, f, indent=4)
            print(f"Archivo regions.json creado en {regions_file}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error al escribir regions.json: {e}")

        json_config = {
            "server": True,
            "model-yolo": {
                "version": "yolo12s.pt",
                "conf_min": 0.6,
                "tracker": {
                    "max_age": 30,
                    "n_init": 1,
                    "max_cosine_distance": 0.3
                }
            },
            "pann": {
                "ruta": "Cnn14_DecisionLevelMax.pth",
                "umbral": 0.1,
                "margen_frames": 20
            },
            "contexto": contexto,
            "video": nombre_archivo_local,
            "regiones": "regions.json",
            "dispositivo": "cuda"
        }

        config_path = os.path.join("configs", contexto)
        os.makedirs(config_path, exist_ok=True)

        config_file = os.path.join(config_path, f"{os.path.splitext(nombre_archivo_local)[0]}_config.json")

        try:
            with open(config_file, "w") as f:
                json.dump(json_config, f, indent=4)
            print(f"Archivo de configuración guardado en {config_file}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error al escribir archivo de configuración: {e}")
        
        try:
            subprocess.run(["python", "modularized/integrador.py", config_file], check=True)
            print("Script ejecutado correctamente.")
        except subprocess.CalledProcessError as e:
            raise HTTPException(status_code=500, detail=f"Error al ejecutar script integrador: {e}")

    return {"message": "Procesamiento completado correctamente"}