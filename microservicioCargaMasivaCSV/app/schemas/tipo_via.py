# schemas/tipo_via.py
from pydantic import BaseModel

class TipoViaBase(BaseModel):
    nombre: str

class TipoViaCreate(TipoViaBase):
    pass

class TipoVia(TipoViaBase):
    id: int
    
    class Config:
        from_attributes = True