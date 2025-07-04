from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Query
from fastapi.responses import StreamingResponse
from typing import List, Annotated
from minio import Minio
from app.config.settings import settings
from app.utils.logger import logger
from datetime import timedelta
from app.fusa_minio_service.uploader import upload_file_to_minio
from app.fusa_minio_service.deleter import delete_file_from_minio
from app.fusa_minio_service.visualizer import visualize_file_from_minio
from app.fusa_minio_service.client import client
import os

router = APIRouter(prefix="/minio", tags=["MinIO"])

@router.get("/modelo")
async def get_download_modelo(
    bucket: Annotated[str, Form(...)],
    folder: Annotated[str, Form(...)],
    file_name: Annotated[str, Form(...)]
):
    local_path = os.path.join("/app/descargas", file_name)
    object_name = f"{folder.strip('/')}/{file_name}"
    modelo = client.fget_object(bucket, object_name, local_path)
    return {
        "data": modelo 
    }

@router.post("/modelo")
async def upload_modelos(
    files: Annotated[List[UploadFile], File(...)],
    folder: Annotated[str, Form(...)],
    bucket: Annotated[str, Form(...)]
):
    object_names = []

    for file in files:
        object_name = upload_file_to_minio(file, folder, bucket)
        object_names.append(object_name)

    return {
        "message": "Modelos subidos con éxito",
        "bucket": bucket,
        "folder": folder,
        "objects": object_names
    }

@router.delete("/modelo")
async def delete_modelos(
    file_names: Annotated[List[str], Form(...)],
    folder: Annotated[str, Form(...)],
    bucket: Annotated[str, Form(...)]
):
    object_names = []

    for file_name in file_names:
        object_name = delete_file_from_minio(file_name, folder, bucket)
        object_names.append(object_name)

    return {
        "message": "Modelos borrados con éxito",
        "bucket": bucket,
        "folder": folder,
        "objects": object_names
    }


# lista de las rutas disponibles
@router.get("/rutas")
async def listar_rutas(
    bucket: str = Query(..., description="Bucket del que obtener las rutas")
):
    try:
        objetos = client.list_objects(bucket, recursive=True)  # busca recursivamente
        rutas = set()

        for obj in objetos:
            nombre = obj.object_name
            if nombre.startswith("modelos/"):
                # Extraer el primer nivel después de "modelos/"
                # Ejemplo: "modelos/audio/pann/file.ext" => ruta = "modelos/audio/pann"
                partes = nombre.split("/")
                # Reunir al menos "modelos" + 1 o 2 niveles (puedes ajustar)
                # Aquí extraigo hasta 3 niveles como ejemplo (modelos/audio/pann)
                ruta_filtrada = "/".join(partes[:2])  # cambia el número según nivel deseado
                rutas.add(ruta_filtrada)

        return {"rutas": sorted(rutas)}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
