from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routes import csv_upload

# Crear las tablas en la base de datos
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="API de Calles",
    description="API para gestión de calles, secciones y tipos de vía",
    version="1.0.0"
)

# Configurar CORS para permitir requests desde el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, especifica los dominios permitidos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir rutas
app.include_router(csv_upload.router)

@app.get("/")
def read_root():
    return {
        "message": "API de Calles - Sistema de gestión de calles y secciones",
        "version": "1.0.0",
        "endpoints": {
            "upload_csv": "/csv/upload",
            "get_tipos_via": "/csv/tipos-via",
            "get_calles_localidad": "/csv/calles-localidad",
            "get_secciones_calle": "/csv/secciones-calle"
        }
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}