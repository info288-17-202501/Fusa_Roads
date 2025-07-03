from fastapi import HTTPException
from app.fusa_minio_service.client import client
from app.fusa_minio_service.utils.utils import lookup_bucket, lookup_folder, lookup_file
from app.fusa_minio_service.utils.logger import logger  # Si tienes un logger compartido

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
