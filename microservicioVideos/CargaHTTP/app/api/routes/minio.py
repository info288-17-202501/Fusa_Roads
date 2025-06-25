from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import List, Annotated
from minio import Minio
from app.config.settings import settings
from app.utils.logger import logger
from datetime import timedelta
from app.fusa_minio_service.uploader import upload_file_to_minio
from app.fusa_minio_service.deleter import delete_file_from_minio
from app.fusa_minio_service.visualizer import visualize_file_from_minio
# from app.fusa_minio_service.updater import update_file_from_minio
from app.fusa_minio_service.client import client
import os

router = APIRouter(prefix="/minio", tags=["MinIO"])

@router.get("/")
async def get_visualize_video(
    bucket: Annotated[str, Form(...)],
    folder: Annotated[str, Form(...)],
    file_name: Annotated[str, Form(...)]
):
    
    url = visualize_file_from_minio(file_name, folder, bucket)["URL"]

    return {
        "message" : url
    }

@router.get("/video")
async def get_download_video(
    bucket: Annotated[str, Form(...)],
    folder: Annotated[str, Form(...)],
    file_name: Annotated[str, Form(...)]
    # download_path: Annotated[str, Form(...)] | None
):
    
    local_path = os.path.join("/app/descargas", file_name)
    object_name = f"{folder.strip('/')}/{file_name}"
    video = client.fget_object(bucket, object_name, local_path)
    return{
        "data": video 
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

# @router.put("/")
# async def update_video(
#     new_file: Annotated[UploadFile, Form(...)],
#     file_name: Annotated[str, Form(...)],
#     folder: Annotated[str, Form(...)],
#     bucket: Annotated[str, Form(...)]
# ):
#     update_file_from_minio(new_file, file_name, folder, bucket)

#     return {
#         "message" : "Video actualizado con exito"
#     }
