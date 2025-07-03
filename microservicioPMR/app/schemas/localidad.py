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

# Para GET /localidades/{id_ciudad}
class LocalidadResponse(Localidad):
    pass