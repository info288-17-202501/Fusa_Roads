from typing import List, Optional
from pydantic import BaseModel, Field
from datetime import datetime

class Avance(BaseModel):
    actual: str
    total: str

# class Estado(BaseModel):
#     estado: str
#     orden: int
#     fecha_hora_ini: datetime
#     fecha_hora_fin: datetime
#     flag: str
#     descrip: str
#     avance: Optional[Avance] = None

# class Config(BaseModel):
#     id: str = Field(..., alias="_id")
#     pia_id: str
#     ejecucion: int
#     fecha_inicio: datetime
#     estados: List[Estado]

class Config(BaseModel):
    id: str = Field(..., alias="_id")  
    pia_id: Optional[str] = None 
    estado: Optional[str] = None
    orden: Optional[int] = None
    fecha_hora_ini: Optional[str] = None  # Opcional
