# services/seccion_calle_service.py

from sqlalchemy.orm import Session
from typing import List
from app.models.calle_localidad import CalleLocalidad
from app.models.tipo_via import TipoVia
from app.models.seccion_calle import SeccionCalle
from app.models.pais import Pais
from app.models.ciudad import Ciudad
from app.models.localidad import Localidad
from app.schemas.seccion_calle import SeccionCalleCreate
from sqlalchemy import asc

class SeccionCalleService:
    def __init__(self, db: Session):
        self.db = db
    
    def crear_seccion_calle(self, seccion_data: SeccionCalleCreate) -> SeccionCalle:
        nueva_seccion = SeccionCalle(**seccion_data.dict())
        self.db.add(nueva_seccion)
        self.db.commit()
        self.db.refresh(nueva_seccion)
        return nueva_seccion

    def get_tipos_via(self) -> List[TipoVia]:
        return self.db.query(TipoVia).order_by(TipoVia.nombre.asc()).all()

    def get_calles_localidad(self) -> List[CalleLocalidad]:
        return (
            self.db.query(CalleLocalidad)
            .join(Localidad, CalleLocalidad.id_localidad == Localidad.id)
            .filter(Localidad.flg_vigencia == 'S')
            .order_by(CalleLocalidad.nombre.asc())
            .all()
        )

    def get_all_secciones_calle(self, app: str) -> List[dict]:
        results = (
            self.db.query(
                SeccionCalle.id,
                SeccionCalle.nombre.label("nombre_seccion_calle"),
                CalleLocalidad.nombre.label("nombre_calle_localidad"),
                Localidad.nombre.label("nombre_localidad"),
                Ciudad.nombre.label("nombre_ciudad"),
                Pais.nombre.label("nombre_pais"),
                TipoVia.nombre.label("nombre_tipo_via"),
                SeccionCalle.app.label("app")
            )
            .join(CalleLocalidad, SeccionCalle.id_calle_localidad == CalleLocalidad.id)
            .join(Localidad, CalleLocalidad.id_localidad == Localidad.id)
            .join(Ciudad, Localidad.id_ciudad == Ciudad.id)
            .join(Pais, Ciudad.id_pais == Pais.id)
            .join(TipoVia, SeccionCalle.id_tipo_via == TipoVia.id)
            .filter(Localidad.flg_vigencia == 'S')
            .filter(SeccionCalle.app == app)
            .order_by(CalleLocalidad.nombre.asc(), SeccionCalle.nombre.asc())
            .all()
        )

        return [
            {
                "id": r.id,
                "nombre_seccion_calle": r.nombre_seccion_calle,
                "nombre_calle_localidad": r.nombre_calle_localidad,
                "nombre_localidad": r.nombre_localidad,
                "nombre_ciudad": r.nombre_ciudad,
                "nombre_pais": r.nombre_pais,
                "nombre_tipo_via": r.nombre_tipo_via,
                "app": r.app
            }
            for r in results
        ]

    def delete_seccion_calle(self, id_seccion: int):
        seccion = self.db.query(SeccionCalle).filter(SeccionCalle.id == id_seccion).first()
        if not seccion:
            return False
        self.db.delete(seccion)
        self.db.commit()
        return True

