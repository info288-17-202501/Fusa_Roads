# routes/uso_routes.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.uso import UsoCreate, UsoCreateBatch
from app.services.uso_service import UsoService
from app.database.database import get_db
from app.models import Uso

router = APIRouter(prefix="/uso", tags=["uso"])

@router.post("/")
def crear_uso(uso: UsoCreate, db: Session = Depends(get_db)):
    return UsoService(db).crear_uso(uso.id_pmr, uso.id_pia_video)

@router.post("/batch")
def crear_usos(uso_batch: UsoCreateBatch, db: Session = Depends(get_db)):
    return UsoService(db).crear_uso_batch(uso_batch.id_pmr, uso_batch.id_pia_videos)

@router.get("/{id_pmr}")
def get_videos_asociados(id_pmr: int, db: Session = Depends(get_db)):
    return UsoService(db).get_videos_asociados(id_pmr)

@router.delete("/{id_pmr}/{id_pia_video}", status_code=204)
def eliminar_uso(id_pmr: int, id_pia_video: int, db: Session = Depends(get_db)):
    success = UsoService(db).eliminar_uso(id_pmr, id_pia_video)
    if not success:
        raise HTTPException(status_code=404, detail="Uso no encontrado")

