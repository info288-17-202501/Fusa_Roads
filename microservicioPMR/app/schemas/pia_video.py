from pydantic import BaseModel
from datetime import datetime

class PiaVideoResponse(BaseModel):
    id: int
    id_pia: int
    id_video: int
    nombre_json: str
    duracion: float
    timestamp_inicio: datetime

    codigo_video: str
    fecha_grabacion: datetime
    tipo_via_nombre: str

    class Config:
        from_attributes = True
