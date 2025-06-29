from sqlalchemy.orm import Session
from app.models.pais import Pais
from app.models.ciudad import Ciudad
from app.models.localidad import Localidad
from fastapi import HTTPException

class UbicacionService:
    def __init__(self, db: Session):
        self.db = db

    def get_paises(self):
        return self.db.query(Pais).all()

    def get_ciudades_por_pais(self, id_pais: int):
        return self.db.query(Ciudad).filter(Ciudad.id_pais == id_pais).all()

    def get_localidades_por_ciudad(self, id_ciudad: int):
        return self.db.query(Localidad).filter(Localidad.id_ciudad == id_ciudad).all()

    def get_detalles_localidad(self, id_localidad: int):
        localidad = self.db.query(Localidad).filter(Localidad.id == id_localidad).first()
        if not localidad:
            raise HTTPException(status_code=404, detail="Localidad no encontrada")

        ciudad = self.db.query(Ciudad).filter(Ciudad.id == localidad.id_ciudad).first()
        if not ciudad:
            raise HTTPException(status_code=404, detail="Ciudad no encontrada")

        pais = self.db.query(Pais).filter(Pais.id == ciudad.id_pais).first()
        if not pais:
            raise HTTPException(status_code=404, detail="País no encontrado")

        return {
            "id_localidad": localidad.id,
            "id_ciudad": ciudad.id,
            "id_pais": pais.id
        }