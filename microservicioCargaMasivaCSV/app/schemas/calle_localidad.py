# schemas/calle_localidad.py
from pydantic import BaseModel

class CalleLocalidadBase(BaseModel):
    nombre: str
    id_localidad: int

class CalleLocalidadCreate(CalleLocalidadBase):
    pass

class CalleLocalidad(CalleLocalidadBase):
    id: int
    
    class Config:
        from_attributes = True