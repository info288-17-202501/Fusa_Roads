from minio import Minio
from app.config.settings import settings
from fastapi import UploadFile
from app.utils.logger import logger
from fastapi import HTTPException
import uuid

client = Minio(
    settings.minio_endpoint,
    access_key=settings.minio_access_key,
    secret_key=settings.minio_secret_key,
    secure=False 
)

logger.info(f"Conectado a MinIO en {settings.minio_endpoint}")

def lookup_bucket(bucket: str):
    if not client.bucket_exists(bucket):
        logger.warning(f"Bucket '{bucket}' no existe.")
        return (False)
    return(True)

def lookup_folder(bucket: str, folder: str) -> bool:
    prefix = folder.strip('/') + '/'
    objects = client.list_objects(bucket, prefix=prefix, recursive=False)
    return any(True for _ in objects)  # Retorna True si al menos un objeto existe con ese prefijo

# Subida de archivo a una carpeta específica en MinIO
def upload_file_to_minio(file: UploadFile, folder: str, bucket: str) -> str:

    if not lookup_bucket(bucket):
        logger.warning(f"Bucket no existe, no se pudo subir el archivo")
        raise HTTPException(status_code=400, detail=f"Bucket '{bucket}' no existe")
    
    if not lookup_folder(bucket, folder):
        logger.warning(f"Folder '{folder}' no existe en el bucket '{bucket}'")
        raise HTTPException(status_code=400, detail=f"Carpeta '{folder}' no existe en el bucket '{bucket}'")

    file_id = str(uuid.uuid4())
    object_name = f"{folder.strip('/')}/{file_id}_{file.filename}"

    client.put_object(
        bucket_name = bucket,
        object_name = object_name,
        data = file.file,
        length = -1,    # Quizas cambio para calcular el largo del archivo.
        part_size = 10 * 1024 * 1024,
        content_type = file.content_type
    )

    return object_name

















