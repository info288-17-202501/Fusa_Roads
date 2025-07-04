#!/bin/sh

# Esperar a que MinIO esté listo (con mc en vez de curl)
until mc alias set myminio http://minio:9000 minioadmin minioadmin; do
    echo "Esperando a MinIO..."
    sleep 1
done

# Crear bucket
mc mb myminio/fusaroads || true

# Crear carpetas simuladas (copiar archivos vacíos para forzar la estructura)
mc cp --recursive /empty-dir/ myminio/fusaroads/videos_original/
mc cp --recursive /empty-dir/ myminio/fusaroads/modelos/
mc cp --recursive /empty-dir/ myminio/fusaroads/modelos/yolo
mc cp --recursive /empty-dir/ myminio/fusaroads/modelos/pann
mc cp --recursive /empty-dir/ myminio/fusaroads/proyectos/