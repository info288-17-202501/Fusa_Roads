#routes/csv_upload
#endpoints para comunicar con el backend
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app.services.csv_service import CSVService
from app.schemas.csv_upload import CSVUploadResponse
from app.schemas.tipo_via import TipoVia
from app.schemas.calle_localidad import CalleLocalidad
from app.schemas.seccion_calle import SeccionCalle

router = APIRouter(prefix="/csv", tags=["CSV Upload"])

@router.post("/upload", response_model=CSVUploadResponse)
async def upload_csv(
    file: UploadFile = File(...),
    pais: str = Form(...),
    ciudad: str = Form(...),
    localidad: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    """
    Endpoint para cargar un CSV con datos de calles
    """
    # Validar que sea un archivo CSV
    if not file.filename.endswith('.csv'):
        raise HTTPException(
            status_code=400,
            detail="El archivo debe ser un CSV"
        )
    
    # Validar parámetros requeridos
    if not pais or not ciudad:
        raise HTTPException(
            status_code=400,
            detail="País y ciudad son requeridos"
        )
    
    try:
        # Leer contenido del archivo
        content = await file.read()
        csv_content = content.decode('utf-8')
        
        # Procesar CSV con los parámetros de ubicación
        csv_service = CSVService(db)
        result = csv_service.process_csv_content(
            csv_content=csv_content,
            pais_nombre=pais,
            ciudad_nombre=ciudad,
            localidad_nombre=localidad
        )
        
        if not result["success"]:
            raise HTTPException(
                status_code=400,
                detail=result["message"]
            )
        
        return CSVUploadResponse(
            message=result["message"],
            processed_rows=result["processed_rows"],
            errors=result["errors"],
            calles_sin_nombre_creadas=result.get("calles_sin_nombre_creadas", 0)
        )
        
    except UnicodeDecodeError:
        raise HTTPException(
            status_code=400,
            detail="Error al decodificar el archivo. Asegúrate de que esté en formato UTF-8"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error interno del servidor: {str(e)}"
        )

@router.get("/tipos-via", response_model=List[TipoVia])
def get_tipos_via(db: Session = Depends(get_db)):
    """
    Obtiene todos los tipos de vía cargados
    """
    csv_service = CSVService(db)
    return csv_service.get_tipo_vias()

@router.get("/calles-localidad", response_model=List[CalleLocalidad])
def get_calles_localidad(db: Session = Depends(get_db)):
    """
    Obtiene todas las calles por localidad cargadas
    """
    csv_service = CSVService(db)
    return csv_service.get_calles_localidad()

@router.get("/secciones-calle", response_model=List[SeccionCalle])
def get_secciones_calle(db: Session = Depends(get_db)):
    """
    Obtiene todas las secciones de calle cargadas
    """
    csv_service = CSVService(db)
    return csv_service.get_secciones_calle()