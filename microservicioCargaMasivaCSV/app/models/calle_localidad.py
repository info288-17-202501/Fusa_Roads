# models/calle_localidad.py
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class CalleLocalidad(Base):
    __tablename__ = "calle_localidad"
    __table_args__ = {"schema": "calles"}
    
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(50), nullable=False)
    id_localidad = Column(Integer, ForeignKey("calles.localidad.id"), nullable=False)
    
    localidad = relationship("Localidad")
