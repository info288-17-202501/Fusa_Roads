from sqlalchemy import Column, Integer, String, ForeignKey, TIMESTAMP, Double
from app.database.database import Base

class PiaVideo(Base):
    __tablename__ = "pia_videos"
    __table_args__ = {"schema": "pia"}

    id = Column(Integer, primary_key=True, index=True)
    id_pia = Column(Integer, ForeignKey("pia.pia.id"), nullable=False)
    id_video = Column(Integer, ForeignKey("pia.videos.id"), nullable=False)
    nombre_json = Column(String(50), nullable=False)
    duracion = Column(Double, nullable=False)
    timestamp_inicio = Column(TIMESTAMP, nullable=False)
