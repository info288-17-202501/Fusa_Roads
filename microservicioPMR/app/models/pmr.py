from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database.database import Base
from app.models.localidad import Localidad
from app.models.uso import Uso

class PMR(Base):
    __tablename__ = "pmr"
    __table_args__ = {"schema": "pmr"}

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(50), nullable=False)
    descripcion = Column(String(50), nullable=False)
    fecha_creacion = Column(DateTime, nullable=False)
    id_localidad = Column(Integer, ForeignKey("calles.localidad.id"), nullable=False)

    usos = relationship(Uso, back_populates="pmr", cascade="all, delete")
    localidad = relationship("Localidad", back_populates="pmrs")
