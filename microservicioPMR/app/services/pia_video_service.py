from sqlalchemy.orm import Session
from app.models.pia_videos import PiaVideo
from app.models.videos import Videos
from app.models.tipo_via import TipoVia

class PiaVideoService:
    def __init__(self, db: Session):
        self.db = db

    def get_all_pia_videos(self):
        results = (
            self.db.query(
                PiaVideo.id,
                PiaVideo.id_pia,
                PiaVideo.id_video,
                PiaVideo.nombre_json,
                PiaVideo.duracion,
                PiaVideo.timestamp_inicio,
                Videos.codigo_video,
                Videos.fecha_grabacion,
                TipoVia.nombre.label("tipo_via_nombre")
            )
            .join(Videos, PiaVideo.id_video == Videos.id)
            .join(TipoVia, Videos.id_tipo_via == TipoVia.id)
            .order_by(Videos.fecha_grabacion.desc())
            .all()
        )

        return [
            {
                "id": r.id,
                "id_pia": r.id_pia,
                "id_video": r.id_video,
                "nombre_json": r.nombre_json,
                "duracion": r.duracion,
                "timestamp_inicio": r.timestamp_inicio,
                "codigo_video": r.codigo_video,
                "fecha_grabacion": r.fecha_grabacion,
                "tipo_via_nombre": r.tipo_via_nombre,
            }
            for r in results
        ]
