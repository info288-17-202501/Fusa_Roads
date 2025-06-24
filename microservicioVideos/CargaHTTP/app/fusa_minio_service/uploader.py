from fastapi import UploadFile, HTTPException
from app.fusa_minio_service.client import client
from app.fusa_minio_service.utils.utils import lookup_bucket, lookup_folder
from app.fusa_minio_service.utils.logger import logger  # Si tienes un logger compartido

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





