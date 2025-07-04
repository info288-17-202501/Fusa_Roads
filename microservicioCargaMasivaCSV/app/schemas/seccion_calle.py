# schemas/seccion_calle.py
from pydantic import BaseModel

class SeccionCalleBase(BaseModel):
    nombre: str
    id_calle_localidad: int
    id_tipo_via: int
    app: str

class SeccionCalleCreate(SeccionCalleBase):
    pass

class SeccionCalle(SeccionCalleBase):
    id: int
    
    class Config:
        from_attributes = True

# Para mostrar información en la tabla (versión extendida)
class SeccionCalleExpandida(BaseModel):
    id: int
    nombre_seccion_calle: str
    nombre_calle_localidad: str
    nombre_localidad: str
    nombre_ciudad: str
    nombre_pais: str
    nombre_tipo_via: str
    app: str

    class Config:
        from_attributes = True