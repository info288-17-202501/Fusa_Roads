from pydantic import BaseModel, Field
from typing import List, Optional
from bson import ObjectId

class TrackerParams(BaseModel):
    max_age: int
    n_init: int
    max_cosine_distance: float

class ModelYoloParams(BaseModel):
    version: str
    conf_min: float
    tracker: TrackerParams

class PannParams(BaseModel):
    ruta: str
    umbral: float
    margen_frames: int

class Params(BaseModel):
    server: bool
    model_yolo: ModelYoloParams = Field(..., alias="model-yolo")
    pann: PannParams
    contexto: str
    video: str
    regiones: str
    dispositivo: str

class VideoItem(BaseModel):
    ruta: str
    regiones: str

class Config(BaseModel):
    id: str = Field(..., exclude=True)  # No lo esperamos en input
    params: Params
    videos: List[VideoItem]
    
    @classmethod
    def from_mongo(cls, data: dict):
        data["id"] = str(data["_id"])
        return cls(**data)
    
    class Config:
        #allow_population_by_field_name = True
        populate_by_name = True

