from minio import Minio
from fusa_minio_service.settings.config import minio_settings

client = Minio(
    minio_settings.minio_endpoint,
    access_key=minio_settings.minio_access_key,
    secret_key=minio_settings.minio_secret_key,
    secure=False  # Cambia a True si usas HTTPS
)
