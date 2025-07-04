from sqlalchemy import Column, Integer, String
from app.database import Base

class Pia(Base):
    __tablename__ = "pia"
    __table_args__ = {"schema": "pia"}

    id = Column(Integer, primary_key=True, index=True)
    codigo_pia = Column(String(50), nullable=False)
