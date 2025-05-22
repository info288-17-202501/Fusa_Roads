#!/bin/sh

# Esperar a que MinIO esté listo (con mc en vez de curl)
until mc alias set myminio http://minio:9000 minioadmin minioadmin; do
    echo "Esperando a MinIO..."
    sleep 1
done

# Crear bucket
mc mb myminio/fusaroads || true

# Crear carpetas simuladas (copiar archivos vacíos para forzar la estructura)
mc cp --recursive /empty-dir/ myminio/fusaroads/login/
mc cp --recursive /empty-dir/ myminio/fusaroads/menu_central/
mc cp --recursive /empty-dir/ myminio/fusaroads/secciones_de_calle/cadna_a/
mc cp --recursive /empty-dir/ myminio/fusaroads/secciones_de_calle/noise_modeling/
mc cp --recursive /empty-dir/ myminio/fusaroads/videos/
mc cp --recursive /empty-dir/ myminio/fusaroads/modelos_de_ia/
mc cp --recursive /empty-dir/ myminio/fusaroads/proyecto_ia_de_analisis/
mc cp --recursive /empty-dir/ myminio/fusaroads/monitor_de_proceso/
mc cp --recursive /empty-dir/ myminio/fusaroads/proyecto_mapas_de_ruido/
mc cp --recursive /empty-dir/ myminio/fusaroads/datos_oms_geolocalizados/
mc cp --recursive /empty-dir/ myminio/fusaroads/visor_de_mapas/
mc cp --recursive /empty-dir/ myminio/fusaroads/integrador/cadna_a/
mc cp --recursive /empty-dir/ myminio/fusaroads/integrador/noise_modeling/