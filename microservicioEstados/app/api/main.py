from fastapi import FastAPI

from fastapi.middleware.cors import CORSMiddleware

import json
import os
from .routes.estadopia import router as estadopia_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],  # URLs del frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(estadopia_router)

@app.get("/health")
async def health_check():
    return {"status": "ok"}


