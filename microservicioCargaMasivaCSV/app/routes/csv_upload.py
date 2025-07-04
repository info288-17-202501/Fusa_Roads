#routes/csv_upload
#endpoints para comunicar con el backend
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.services.csv_service import CSVService
from app.schemas.csv_upload import CSVUploadResponse 

router = APIRouter(prefix="/csv", tags=["CSV Upload"])

@router.post("/upload", response_model=CSVUploadResponse)
async def upload_csv(
    file: UploadFile = File(...),
    id_pais: int = Form(...),
    id_ciudad: int = Form(...),
    localidad: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    """
    Endpoint para cargar un CSV con datos de calles
    Ahora recibe IDs de país y ciudad en lugar de nombres
    """
    # Validar que sea un archivo CSV
    if not file.filename.endswith('.csv'):
        raise HTTPException(
            status_code=400,
            detail="El archivo debe ser un CSV"
        )

    # Validar parámetros requeridos
    if not id_pais or not id_ciudad:
        raise HTTPException(
            status_code=400,
            detail="ID de país y ciudad son requeridos"
        )

    try:
        # Leer contenido del archivo
        content = await file.read()
        csv_content = content.decode('utf-8')

        # Procesar CSV con los IDs de ubicación
        csv_service = CSVService(db)
        result = csv_service.process_csv_content(
            csv_content=csv_content,
            id_pais=id_pais,
            id_ciudad=id_ciudad,
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