# models/ciudad.py
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Ciudad(Base):
    __tablename__ = "ciudad"
    __table_args__ = {"schema": "calles"}
    
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(50), nullable=False)
    id_pais = Column(Integer, ForeignKey("calles.pais.id"), nullable=False)
    
    pais = relationship("Pais")
