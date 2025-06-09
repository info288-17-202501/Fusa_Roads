from fastapi import  Depends, HTTPException, FastAPI
from .routes.minio import router as parametros_router 

app = FastAPI()
app.include_router(parametros_router)

@app.get("/health")
async def health_check():
    return {"status": "ok"}

