# schemas/seccion_calle.py
from pydantic import BaseModel

class SeccionCalleBase(BaseModel):
    nombre: str
    id_calle_localidad: int
    id_tipo_via: int

class SeccionCalleCreate(SeccionCalleBase):
    pass

class SeccionCalle(SeccionCalleBase):
    id: int
    
    class Config:
        from_attributes = True