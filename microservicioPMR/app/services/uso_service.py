# services/uso_service.py
from app.models.uso import Uso
from sqlalchemy.orm import Session

class UsoService:
    def __init__(self, db: Session):
        self.db = db

    def crear_uso(self, id_pmr: int, id_pia_video: int):
        uso = Uso(id_pmr=id_pmr, id_pia_video=id_pia_video)
        self.db.add(uso)
        self.db.commit()
        return uso

    def crear_uso_batch(self, id_pmr: int, id_pia_videos: list[int]):
        usos = [Uso(id_pmr=id_pmr, id_pia_video=vid) for vid in id_pia_videos]
        self.db.add_all(usos)
        self.db.commit()
        return usos
    
    def get_videos_asociados(self, id_pmr: int) -> list[int]:
        usos = self.db.query(Uso).filter(Uso.id_pmr == id_pmr).all()
        return [uso.id_pia_video for uso in usos]

    def eliminar_uso(self, id_pmr: int, id_pia_video: int) -> bool:
        uso = self.db.query(Uso).filter(Uso.id_pmr == id_pmr, Uso.id_pia_video == id_pia_video).first()
        if not uso:
            return False
        self.db.delete(uso)
        self.db.commit()
        return True
