from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import List, Annotated
from minio import Minio
from app.config.settings import settings
from app.utils.logger import logger
from datetime import timedelta

router = APIRouter(prefix="/minio", tags=["MinIO"])

client = Minio(
    settings.MINIO_ENDPOINT,
    access_key=settings.MINIO_ACCESS_KEY,
    secret_key=settings.MINIO_SECRET_KEY,
    secure=False  # Cambia a True si usas HTTPS
)

def lookup_bucket(bucket: str) -> bool:
    exists = client.bucket_exists(bucket)
    if not exists:
        logger.warning(f"Bucket '{bucket}' no existe.")
    return exists

def lookup_folder(bucket: str, folder: str) -> bool:
    prefix = folder.strip('/') + '/'
    objects = client.list_objects(bucket, prefix=prefix, recursive=False)
    return any(True for _ in objects)

def lookup_file(bucket, folder, filename) -> bool:
    prefix = folder.strip('/') + '/' + filename
    objects = client.list_objects(bucket, prefix=prefix, recursive=False)
    return any(True for _ in objects)

def delete_file_from_minio(file_name: str, folder: str, bucket: str) -> str:
    if not lookup_bucket(bucket):
        logger.warning(f"Bucket: '{bucket}' no existe")
        raise HTTPException(status_code=400, detail=f"Bucket '{bucket}' no existe")

    elif not lookup_folder(bucket, folder):
        logger.warning(f"Carpeta: '{folder}' no existe en el bucket '{bucket}'")
        raise HTTPException(status_code=400, detail=f"Carpeta '{folder}' no existe")
    
    elif not lookup_file(bucket, folder, file_name):
        logger.warning(f"file: '{file_name}' no existe en carpeta: '{folder}' ")

    else:
        object_name = f"{folder.strip('/')}/{file_name}"

        client.remove_object(
            bucket_name=bucket,
            object_name=object_name,
        )

        return {
            "status" : True,
            "message" : f"File: {file_name} deleted from MinIO"
        }
    

    return {
        "status" : False,
        "message" : f"File: {file_name} not found"
    }

def update_file_from_minio(new_file: UploadFile, file_name: str, folder:str, bucket: str) -> str:

    delete_resp = delete_file_from_minio(file_name, folder, bucket)

    if not delete_resp["status"]:
        logger.warning(delete_resp["message"])
        raise HTTPException(status_code=400, detail=f"Archivo '{file_name}' no existe")

    else: 
        object_name = f"{folder.strip('/')}/{file_name}"

        client.put_object(
            bucket_name=bucket,
            object_name=object_name,
            data=new_file.file,
            length=-1,  # Usa -1 si no conoces el tamaño y usas part_size
            part_size=10 * 1024 * 1024,
            content_type=new_file.content_type
        )

        return (f"File: '{file_name}' actualizada con el nuevo contenido")

def upload_file_to_minio(file: UploadFile, folder: str, bucket: str) -> str:
    if not lookup_bucket(bucket):
        logger.warning(f"Bucket '{bucket}' no existe")
        raise HTTPException(status_code=400, detail=f"Bucket '{bucket}' no existe")

    if not lookup_folder(bucket, folder):
        logger.warning(f"Carpeta '{folder}' no existe en el bucket '{bucket}'")
        raise HTTPException(status_code=400, detail=f"Carpeta '{folder}' no existe")

    object_name = f"{folder.strip('/')}/{file.filename}"

    print(object_name)

    client.put_object(
        bucket_name=bucket,
        object_name=object_name,
        data=file.file,
        length=-1,  # Usa -1 si no conoces el tamaño y usas part_size
        part_size=10 * 1024 * 1024,
        content_type=file.content_type
    )

    return object_name

def visualize_file_from_minio(file_name: str, folder:str, bucket: str) -> dict:
    if not lookup_bucket(bucket):
        logger.warning(f"Bucket: '{bucket}' no existe")
        raise HTTPException(status_code=400, detail=f"Bucket '{bucket}' no existe")
    
    elif not lookup_file(bucket, folder, file_name):
        logger.warning(f"file: '{file_name}' no existe en carpeta: '{folder}' ")

    else: 
        object_name = f"{folder.strip('/')}/{file_name}"
        url = client.presigned_get_object(
            bucket_name=bucket,
            object_name=object_name,
            expires=timedelta(days=1)
        )

        return {"URL" : url}

@router.get("/")
async def get_videos(
    bucket: Annotated[str, Form(...)],
    folder: Annotated[str, Form(...)],
    file_name: Annotated[str, Form(...)]
):
    
    url = visualize_file_from_minio(file_name, folder, bucket)["URL"]

    return {
        "message" : url
    }

@router.post("/")
async def upload_videos(
    files: Annotated[List[UploadFile], File(...)],
    folder: Annotated[str, Form(...)],
    bucket: Annotated[str, Form(...)]
):
    object_names = []

    for file in files:
        object_name = upload_file_to_minio(file, folder, bucket)
        object_names.append(object_name)

    return {
        "message": "Archivos subidos con éxito",
        "bucket": bucket,
        "folder": folder,
        "objects": object_names
    }

@router.delete("/")
async def delete_videos(
    file_names: Annotated[List[str], Form(...)],
    folder: Annotated[str, Form(...)],
    bucket: Annotated[str, Form(...)]
):
    object_names = []

    for file_name in file_names:
        object_name = delete_file_from_minio(file_name, folder, bucket)
        object_names.append(object_name)

    return {
        "message": "Archivos borrados con exito",
        "bucket": bucket,
        "folder": folder,
        "objects": object_names
    }

@router.put("/")
async def update_video(
    new_file: Annotated[UploadFile, Form(...)],
    file_name: Annotated[str, Form(...)],
    folder: Annotated[str, Form(...)],
    bucket: Annotated[str, Form(...)]
):
    update_file_from_minio(new_file, file_name, folder, bucket)

    return {
        "message" : "Video actualizado con exito"
    }
