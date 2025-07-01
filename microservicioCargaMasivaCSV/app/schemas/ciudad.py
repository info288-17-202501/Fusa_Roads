# schemas/ciudad.py
from pydantic import BaseModel

class CiudadBase(BaseModel):
    nombre: str
    id_pais: int

class CiudadCreate(CiudadBase):
    pass

class Ciudad(CiudadBase):
    id: int
    
    class Config:
        from_attributes = True
