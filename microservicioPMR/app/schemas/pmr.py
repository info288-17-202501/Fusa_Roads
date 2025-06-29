from pydantic import BaseModel
from datetime import datetime

# Esquema base para creación y edición (usa id_localidad)
class PMRBase(BaseModel):
    nombre: str
    descripcion: str
    id_localidad: int

class PMRCreate(PMRBase):
    pass

# Esquema estándar con id y fecha, para cuando devuelves PMRs sin relaciones expandidas
class PMR(PMRBase):
    id: int
    fecha_creacion: datetime

    class Config:
        from_attributes = True

# NUEVO: esquema para la respuesta con los nombres anidados
class PMRResponse(BaseModel):
    id: int
    nombre: str
    descripcion: str
    fecha_creacion: datetime
    id_localidad: int
    nombre_localidad: str
    nombre_ciudad: str
    nombre_pais: str

    class Config:
        from_attributes = True
