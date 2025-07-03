from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from app.database.database import Base

class Uso(Base):
    __tablename__ = "uso"
    __table_args__ = {"schema": "pmr"}

    id_pmr = Column(Integer, ForeignKey("pmr.pmr.id"), primary_key=True)
    id_pia_video = Column(Integer, ForeignKey("pia.pia_videos.id"), primary_key=True)

    pmr = relationship("PMR", back_populates="usos")