# models/tipo_via.py
from sqlalchemy import Column, Integer, String
from app.database import Base

class TipoVia(Base):
    __tablename__ = "tipo_via"
    __table_args__ = {"schema": "calles"}
    
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(50), nullable=False)
