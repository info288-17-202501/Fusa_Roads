# schemas/csv_upload.py
from pydantic import BaseModel
from typing import List

class CSVRowData(BaseModel):
    nombre_calle: str
    seccion_calle: str
    tipo_via: str

class CSVUploadResponse(BaseModel):
    message: str
    processed_rows: int
    errors: List[str] = []
    calles_sin_nombre_creadas: int = 0