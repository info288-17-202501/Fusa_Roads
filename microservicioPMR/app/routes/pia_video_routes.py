from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database.database import get_db
from app.schemas.pia_video import PiaVideoResponse
from app.services.pia_video_service import PiaVideoService

router = APIRouter(prefix="/pia_videos", tags=["Pia Videos"])

@router.get("/", response_model=List[PiaVideoResponse])
def get_pia_videos(id_ciudad: int, db: Session = Depends(get_db)):
    service = PiaVideoService(db)
    return service.get_pia_videos_por_ciudad(id_ciudad)
