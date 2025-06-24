from fastapi import UploadFile, HTTPException
from fusa_minio_service.client import client
from fusa_minio_service.deleter import delete_file_from_minio
from fusa_minio_service.utils.logger import logger  # Si tienes un logger compartido

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



