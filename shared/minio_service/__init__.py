# minio_service/__init__.py

# Importar y exponer las funciones principales
from .src.fusa_minio_service.uploader import upload_file_to_minio
from .src.fusa_minio_service.deleter import delete_file_from_minio
from .src.fusa_minio_service.updater import update_file_from_minio
from .src.fusa_minio_service.visualizer import visualize_file_from_minio

# Definir qué se puede importar cuando se hace "from shared import *"
__all__ = [
    'upload_file_to_minio',
    'delete_file_from_minio',
    'update_file_from_minio',
    'visualize_file_from_minio'
]

# Información del paquete
__version__ = "1.0.0"
__author__ = "Renato Atencio Aedo"
__email__ = "renatoatencioaedo@gmail.com"