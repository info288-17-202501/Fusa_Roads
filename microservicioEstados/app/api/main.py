from fastapi import FastAPI, HTTPException, Request, Query
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import json
import os
from .routes.estadopia import router as estadopia_router

app = FastAPI()


app.include_router(estadopia_router)

@app.get("/health")
async def health_check():
    return {"status": "ok"}


