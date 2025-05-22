from fusa_minio_service.client import client
from fusa_minio_service.utils.logger import logger

def lookup_bucket(bucket: str) -> bool:
    exists = client.bucket_exists(bucket)
    if not exists:
        logger.warning(f"Bucket '{bucket}' no existe.")
    return exists

def lookup_folder(bucket: str, folder: str) -> bool:
    prefix = folder.strip('/') + '/'
    objects = client.list_objects(bucket, prefix=prefix, recursive=False)
    return any(True for _ in objects)

def lookup_file(bucket, folder, filename) -> bool:
    prefix = folder.strip('/') + '/' + filename
    objects = client.list_objects(bucket, prefix=prefix, recursive=False)
    return any(True for _ in objects)