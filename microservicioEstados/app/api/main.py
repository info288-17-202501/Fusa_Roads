from fastapi import FastAPI, HTTPException, Request, Query
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import json
import os

app = FastAPI()



@app.get("/health")
async def health_check():
    return {"status": "ok"}


