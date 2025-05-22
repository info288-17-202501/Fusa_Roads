#!/bin/sh

# Esperar a que MinIO esté listo
until mc alias set myminio http://minio:9000 minioadmin minioadmin; do
    echo "Esperando a MinIO..."
    sleep 1
done

# Subir tus videos
mc cp --recursive /data-to-upload/ myminio/fusaroads/videos/
