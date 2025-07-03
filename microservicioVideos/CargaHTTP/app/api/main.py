from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes.minio import router as videos_router
from .routes.mongo import router as mongo_router

app = FastAPI()

# Rutas que pueden interactuar
origins = [
    "http://localhost:3000",  # frontend local
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,            # dominios permitidos
    allow_credentials=True,
    allow_methods=["*"],              # permite todos los métodos (GET, POST, etc.)
    allow_headers=["*"],              # permite todos los headers (como Authorization)
)

app.include_router(videos_router)
app.include_router(mongo_router)

@app.get("/health")
async def health_check():
    return {"status": "ok"}
