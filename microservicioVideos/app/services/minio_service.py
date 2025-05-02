from minio import Minio
from app.config.settings import settings
from fastapi import UploadFile
from app.utils.logger import logger
import uuid

client = Minio(
    settings.minio_endpoint,
    access_key=settings.minio_access_key,
    secret_key=settings.minio_secret_key,
    secure=False  # True si usas HTTPS
)

# Log de depuración cuando se crea el cliente
logger.info(f"Conectado a MinIO en {settings.minio_endpoint}")

# Asegura que el bucket exista
def ensure_bucket():
    if not client.bucket_exists(settings.minio_bucket):
        client.make_bucket(settings.minio_bucket)
        logger.info(f"Bucket '{settings.minio_bucket}' creado.")
    else:
        logger.info(f"Bucket '{settings.minio_bucket}' ya existe.")

# Subida de archivo
def upload_file_to_minio(file: UploadFile) -> str:
    ensure_bucket()
    file_id = str(uuid.uuid4())
    object_name = f"{file_id}_{file.filename}"

    content = file.file
    file_size = file.file.__sizeof__()

    client.put_object(
        settings.minio_bucket,
        object_name,
        content,
        length=-1,  # streaming
        part_size=10 * 1024 * 1024,
        content_type=file.content_type
    )

    return object_name