# models/seccion_calle.py
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class SeccionCalle(Base):
    __tablename__ = "seccion_calle"
    __table_args__ = {"schema": "calles"}
    
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(50), nullable=False)
    id_calle_localidad = Column(Integer, ForeignKey("calles.calle_localidad.id"), nullable=False)
    id_tipo_via = Column(Integer, ForeignKey("calles.tipo_via.id"), nullable=False)
    app = Column(String(50), nullable=False)
    
    calle_localidad = relationship("CalleLocalidad")
    tipo_via = relationship("TipoVia")