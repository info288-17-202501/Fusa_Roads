from typing import Optional
from sqlalchemy.orm import Session
from app.models.pmr import PMR as PMRModel
from app.schemas.pmr import PMRCreate
from datetime import datetime

from app.models.localidad import Localidad
from app.models.ciudad import Ciudad
from app.models.pais import Pais

class PMRService:
    def __init__(self, db: Session):
        self.db = db

    def create_pmr(self, pmr_in: PMRCreate):
        db_pmr = PMRModel(
            nombre=pmr_in.nombre,
            descripcion=pmr_in.descripcion,
            fecha_creacion=datetime.utcnow(),
            id_localidad=pmr_in.id_localidad
        )
        self.db.add(db_pmr)
        self.db.commit()
        self.db.refresh(db_pmr)
        return db_pmr

    # def get_all_pmrs(self):
    #     return self.db.query(PMRModel).all()
    def get_all_pmrs(self):
        results = (
            self.db.query(
                PMRModel.id,
                PMRModel.nombre,
                PMRModel.descripcion,
                PMRModel.fecha_creacion,
                PMRModel.id_localidad,
                Localidad.nombre.label("nombre_localidad"),
                Ciudad.nombre.label("nombre_ciudad"),
                Pais.nombre.label("nombre_pais")
            )
            .join(Localidad, PMRModel.id_localidad == Localidad.id)
            .join(Ciudad, Localidad.id_ciudad == Ciudad.id)
            .join(Pais, Ciudad.id_pais == Pais.id)
            .order_by(PMRModel.fecha_creacion.desc())
            .all()
        )
        
        return [
            {
                "id": r.id,
                "nombre": r.nombre,
                "descripcion": r.descripcion,
                "fecha_creacion": r.fecha_creacion,
                "id_localidad": r.id_localidad,
                "nombre_localidad": r.nombre_localidad,
                "nombre_ciudad": r.nombre_ciudad,
                "nombre_pais": r.nombre_pais,
            }
            for r in results
        ]

    def delete_pmr(self, pmr_id: int) -> bool:
        pmr = self.db.query(PMRModel).filter(PMRModel.id == pmr_id).first()
        if not pmr:
            return False
        self.db.delete(pmr)
        self.db.commit()
        return True

    def update_pmr(self, pmr_id: int, pmr_data: PMRCreate) -> Optional[PMRModel]:
        pmr = self.db.query(PMRModel).filter(PMRModel.id == pmr_id).first()
        if not pmr:
            return None

        pmr.nombre = pmr_data.nombre
        pmr.descripcion = pmr_data.descripcion
        pmr.id_localidad = pmr_data.id_localidad

        self.db.commit()
        self.db.refresh(pmr)
        return pmr
