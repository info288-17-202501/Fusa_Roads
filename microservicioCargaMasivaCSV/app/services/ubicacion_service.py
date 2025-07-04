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