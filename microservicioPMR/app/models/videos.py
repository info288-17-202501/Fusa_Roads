from sqlalchemy import Column, Integer, String, ForeignKey, TIMESTAMP
from app.database.database import Base

class Videos(Base):
    __tablename__ = "videos"
    __table_args__ = {"schema": "pia"}

    id = Column(Integer, primary_key=True, index=True)
    codigo_video = Column(String(50), nullable=False)
    id_ciudad = Column(Integer, ForeignKey("calles.ciudad.id"), nullable=False)
    id_tipo_via = Column(Integer, ForeignKey("calles.tipo_via.id"), nullable=False)
    fecha_grabacion = Column(TIMESTAMP, nullable=False)
