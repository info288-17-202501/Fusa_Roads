# Microservicio HTTP para Videos

para la carga de videos desde la pagina web de fusa, permite realizar el CR_D de videos en MinIO y el CRUD de contextos de MongoDB

Para ejecutar usar
    docker-compose up --build
    (Necesita que el contenedor MinIO este activo (ir a shared/minio_service/container))
    (Necesita que el contenedor Mongo este activo (ir a shared/mongo_service/container))

La descarga de videos crea actualmente una carpeta en la app que guarda los videos.
