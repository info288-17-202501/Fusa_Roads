# schemas/pais.py
from pydantic import BaseModel

class PaisBase(BaseModel):
    nombre: str

class PaisCreate(PaisBase):
    pass

class Pais(PaisBase):
    id: int
    
    class Config:
        from_attributes = True