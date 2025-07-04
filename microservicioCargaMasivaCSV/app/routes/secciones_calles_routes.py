from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.services.secciones_calle_service import SeccionCalleService
from app.schemas.seccion_calle import SeccionCalleExpandida
from app.schemas.tipo_via import TipoVia
from app.schemas.calle_localidad import CalleLocalidad
from app.schemas.seccion_calle import SeccionCalleCreate
from app.schemas.seccion_calle import SeccionCalle
# from app.models.seccion_calle import SeccionCalle

router = APIRouter(prefix="/secciones", tags=["Secciones de Calle"])

@router.post("/", response_model=SeccionCalle)
def crear_seccion_calle(seccion: SeccionCalleCreate, db: Session = Depends(get_db)):
    try:
        nueva = SeccionCalleService(db).crear_seccion_calle(seccion)
        return nueva
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.get("/tipos-via", response_model=List[TipoVia])
def get_tipos_via(db: Session = Depends(get_db)):
    return SeccionCalleService(db).get_tipos_via()

@router.get("/calles-localidad", response_model=List[CalleLocalidad])
def get_calles_localidad(db: Session = Depends(get_db)):
    return SeccionCalleService(db).get_calles_localidad()

@router.get("/{app}", response_model=List[SeccionCalleExpandida])
def get_secciones_calle(app: str , db: Session = Depends(get_db)):
    return SeccionCalleService(db).get_all_secciones_calle(app)
    
@router.delete("/{id_seccion}")
def delete_seccion_calle(id_seccion: int, db: Session = Depends(get_db)):
    service = SeccionCalleService(db)
    success = service.delete_seccion_calle(id_seccion)
    if not success:
        raise HTTPException(status_code=404, detail="Seccion de Calle no encontrada")
