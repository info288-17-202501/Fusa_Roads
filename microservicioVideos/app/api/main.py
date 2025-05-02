from fastapi import FastAPI
from app.api.routes import minio

app = FastAPI()

app.include_router(minio.router, prefix="/minio", tags=["MinIO"])
