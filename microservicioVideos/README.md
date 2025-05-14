Estructura del microservicio de videos
microservicioVideos/
│
├── app/                         # Lógica principal de la app
│   ├── api/                     # Endpoints (FastAPI, Flask, etc.)
│   │   ├── routes/
│   │   │   ├── minio.py         # Tiene los metodos del CRUD
│   │   │   └── ...
│   │   └── main.py              # Arranque del servidor, incluye app y routers
│   │
│   ├── services/                # Lógica de negocio
│   │   ├── minio_service.py     # Funciones para MinIO 
│   │   ├── mongo_service.py     # Funciones para MongoDB
│   │   └── postgres_service.py  # Funciones para PostgreSQL
│   │
│   ├── models/                  # Esquemas (pydantic, ORMs, etc.)
│   │   └── ...
│   │
│   └── utils/                   # Utilidades generales (logs, helpers)
│   │   └── logger.py
│   │
│   └── config/                  # Configuración del microservicio
│       └── settings.py          # Variables de entorno, conexión a BD, etc.
│
├── tests/                       # Pruebas unitarias o de integración
│   ├── test_minio.py
│   ├── test_mongo.py
│   └── test_postgres.py
│
├── .env
├── .gitignore
├── Dockerfile
├── docker-compose.ylm           # Permite crear el contenedor de minio
└── README.md

Comandos a usar:
    > docker-compose up -d      # Compando para el docker-compose, se puede ver el contenedor en docker desktop
    > Ir a la UI de minio (http://localhost:9001/login) y crear el bucket 'videos', el usuario y contraseña es minioadmin
    > python main.py            # Esto en /microservicioVideos, corre el microservicio

crear .env (en /microservicioVideos):
    HOST=localhost
    PORT=8002
    MINIO_ENDPOINT=localhost:9000
    MINIO_ACCESS_KEY=minioadmin
    MINIO_SECRET_KEY=minioadmin
    MINIO_BUCKET=fusaroads
