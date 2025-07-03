from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database.database import get_db
from app.schemas.pmr import PMR, PMRCreate, PMRResponse
from app.services.pmr_service import PMRService

router = APIRouter(prefix="/pmr", tags=["PMR"])

@router.post("/", response_model=PMR)
def create_pmr(pmr_in: PMRCreate, db: Session = Depends(get_db)):
    service = PMRService(db)
    pmr = service.create_pmr(pmr_in)
    return pmr

@router.get("/", response_model=List[PMRResponse])
def list_pmrs(db: Session = Depends(get_db)):
    service = PMRService(db)
    return service.get_all_pmrs()

@router.delete("/{pmr_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_pmr(pmr_id: int, db: Session = Depends(get_db)):
    service = PMRService(db)
    success = service.delete_pmr(pmr_id)
    if not success:
        raise HTTPException(status_code=404, detail="PMR no encontrado")
    
@router.put("/{pmr_id}", response_model=PMR)
def update_pmr(pmr_id: int, pmr_data: PMRCreate, db: Session = Depends(get_db)):
    """
    Actualiza un PMR por su ID
    """
    pmr_service = PMRService(db)
    updated_pmr = pmr_service.update_pmr(pmr_id, pmr_data)
    if not updated_pmr:
        raise HTTPException(status_code=404, detail="PMR no encontrado")
    return updated_pmr
