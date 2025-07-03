# models/pais.py
from sqlalchemy import Column, Integer, String
from app.database import Base

class Pais(Base):
    __tablename__ = "pais"
    __table_args__ = {"schema": "calles"}
    
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(50), nullable=False)
