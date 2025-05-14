from fastapi import APIRouter, UploadFile, File, Form
from app.services.minio_service import upload_file_to_minio
from typing import List, Annotated

router = APIRouter()

@router.post("/upload")
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
        "objects": object_names
    }