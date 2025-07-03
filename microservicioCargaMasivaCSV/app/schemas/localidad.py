# schemas/localidad.py
from pydantic import BaseModel

class LocalidadBase(BaseModel):
    nombre: str
    id_ciudad: int
    flg_vigencia: str

class LocalidadCreate(LocalidadBase):
    pass

class Localidad(LocalidadBase):
    id: int
    
    class Config:
        from_attributes = True