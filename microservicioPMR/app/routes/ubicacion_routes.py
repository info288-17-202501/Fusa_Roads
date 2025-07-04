from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database.database import get_db
from app.services.ubicacion_service import UbicacionService
from app.schemas.pais import PaisResponse
from app.schemas.ciudad import CiudadResponse
from app.schemas.localidad import LocalidadResponse
from app.models import Localidad, Ciudad, Pais

router = APIRouter(prefix="/ubicacion", tags=["Ubicación"])

# Obtiene todos los países
@router.get("/paises", response_model=List[PaisResponse])
def get_paises(db: Session = Depends(get_db)):
    return UbicacionService(db).get_paises()

# Obtiene todas las ciudades de un país específico
@router.get("/ciudades/{id_pais}", response_model=List[CiudadResponse])
def get_ciudades_por_pais(id_pais: int, db: Session = Depends(get_db)):
    return UbicacionService(db).get_ciudades_por_pais(id_pais)

# Obtiene todas las localidades de una ciudad específica
@router.get("/localidades/{id_ciudad}", response_model=List[LocalidadResponse])
def get_localidades_por_ciudad(id_ciudad: int, db: Session = Depends(get_db)):
    return UbicacionService(db).get_localidades_por_ciudad(id_ciudad)

@router.get("/detalles_localidad/{id_localidad}")
def get_detalles_localidad(id_localidad: int, db: Session = Depends(get_db)):
    return UbicacionService(db).get_detalles_localidad(id_localidad)
