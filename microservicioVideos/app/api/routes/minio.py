from fastapi import APIRouter, UploadFile, File, Form
from typing import List, Annotated
from fusa_minio_service.uploader import upload_file_to_minio
from fusa_minio_service.deleter import delete_file_from_minio
from fusa_minio_service.updater import update_file_from_minio
from fusa_minio_service.visualizer import visualize_file_from_minio

router = APIRouter()

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
