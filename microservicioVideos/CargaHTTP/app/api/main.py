from fastapi import FastAPI
from .routes.minio import router as videos_router
from .routes.mongo import router as mongo_router

app = FastAPI()

app.include_router(videos_router)
app.include_router(mongo_router)

@app.get("/health")
async def health_check():
    return {"status": "ok"}
