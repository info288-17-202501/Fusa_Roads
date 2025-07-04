# models/localidad.py
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Localidad(Base):
    __tablename__ = "localidad"
    __table_args__ = {"schema": "calles"}
    
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(50), nullable=False)
    id_ciudad = Column(Integer, ForeignKey("calles.ciudad.id"), nullable=False)
    flg_vigencia = Column(String(1), nullable=False)
    
    ciudad = relationship("Ciudad")