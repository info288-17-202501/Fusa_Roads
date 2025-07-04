from fastapi import HTTPException
from app.fusa_minio_service.client import client
from app.fusa_minio_service.utils.logger import logger  # Si tienes un logger compartido
from app.fusa_minio_service.utils.utils import lookup_bucket, lookup_file
from datetime import timedelta

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



