from pydantic import BaseModel

class PaisBase(BaseModel):
    nombre: str

class PaisCreate(PaisBase):
    pass

class Pais(PaisBase):
    id: int
    
    class Config:
        from_attributes = True

# Para usar en GET /paises
class PaisResponse(Pais):
    pass