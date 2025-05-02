from fastapi import APIRouter, UploadFile, File
from app.services.minio_service import upload_file_to_minio

router = APIRouter()

@router.post("/upload")
async def upload_video(file: UploadFile = File(...)):
    object_name = upload_file_to_minio(file)
    return {"message": "Archivo subido con éxito", "object_name": object_name}
