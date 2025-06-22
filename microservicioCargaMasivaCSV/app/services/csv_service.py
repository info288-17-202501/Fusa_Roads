
import pandas as pd
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional
from io import StringIO

from app.models.calle_localidad import CalleLocalidad
from app.models.tipo_via import TipoVia
from app.models.seccion_calle import SeccionCalle
from app.models.pais import Pais
from app.models.ciudad import Ciudad
from app.models.localidad import Localidad
from app.schemas.csv_upload import CSVRowData

class CSVService:
    def __init__(self, db: Session):
        self.db = db
        self.contador_calles_sin_nombre = 0
        self.pais_creado = False
        self.ciudad_creada = False
        self.localidad_creada = False
    
    def process_csv_content(self, csv_content: str, pais_nombre: str, ciudad_nombre: str, localidad_nombre: Optional[str] = None) -> Dict[str, Any]:
        #Procesa el contenido del CSV y carga los datos en la base de datosincluyendo la creación/búsqueda de país, ciudad y localidad
        try:
            # Normalizar datos de entrada a minúsculas
            pais_nombre = pais_nombre.strip().lower()
            ciudad_nombre = ciudad_nombre.strip().lower()
            localidad_nombre = localidad_nombre.strip().lower() if localidad_nombre else None
            
            # Verificar si la localidad ya existe ANTES de procesar
            if not self._can_create_localidad(pais_nombre, ciudad_nombre, localidad_nombre):
                return {
                    "success": False,
                    "message": "No se puede procesar el CSV: La localidad ya existe en la base de datos. Para cargar datos en una localidad existente, primero debe eliminar los datos previos.",
                    "processed_rows": 0,
                    "errors": ["Localidad ya existe"],
                    "pais_creado": False,
                    "ciudad_creada": False,
                    "localidad_creada": False
                }
            
            # Procesar los datos de ubicación
            localidad_id = self._process_location_data(pais_nombre, ciudad_nombre, localidad_nombre)
            
            # Leer CSV
            df = pd.read_csv(StringIO(csv_content))
            
            # Validar columnas requeridas
            required_columns = ['nombre_calle', 'seccion_calle', 'tipo_via']
            if not all(col in df.columns for col in required_columns):
                return {
                    "success": False,
                    "message": f"El CSV debe contener las columnas: {', '.join(required_columns)}",
                    "processed_rows": 0,
                    "errors": [f"Columnas faltantes. Columnas encontradas: {list(df.columns)}"],
                    "pais_creado": self.pais_creado,
                    "ciudad_creada": self.ciudad_creada,
                    "localidad_creada": self.localidad_creada
                }
            
            # Reiniciar contador para este procesamiento
            self.contador_calles_sin_nombre = 0
            
            # Verificar que existe el tipo de vía "no definido" en la BD
            tipo_via_no_definido = self.db.query(TipoVia).filter(TipoVia.nombre == "no definido").first()
            if not tipo_via_no_definido:
                return {
                    "success": False,
                    "message": "Error de configuración: No existe el tipo de vía 'no definido' en la base de datos. Este tipo de vía debe existir para manejar casos con tipo de vía vacío.",
                    "processed_rows": 0,
                    "errors": ["Tipo de vía 'no definido' no existe en la base de datos"],
                    "pais_creado": self.pais_creado,
                    "ciudad_creada": self.ciudad_creada,
                    "localidad_creada": self.localidad_creada
                }
            
            # Validar tipos de vía ANTES de procesar cualquier fila
            validation_result = self._validate_tipos_via_in_csv(df)
            if not validation_result["valid"]:
                return {
                    "success": False,
                    "message": validation_result["message"],
                    "processed_rows": 0,
                    "errors": validation_result["errors"],
                    "tipos_via_no_encontrados": validation_result["tipos_via_no_encontrados"],
                    "pais_creado": False,
                    "ciudad_creada": False,
                    "localidad_creada": False
                }
            
            processed_rows = 0
            errors = []
            
            # Procesar cada fila
            for index, row in df.iterrows():
                try:
                    # Limpiar y normalizar datos (convertir a minúsculas)
                    nombre_calle = str(row['nombre_calle']).strip().lower() if pd.notna(row['nombre_calle']) else ""
                    seccion_calle = str(row['seccion_calle']).strip().lower() if pd.notna(row['seccion_calle']) else ""
                    tipo_via_original = str(row['tipo_via']).strip() if pd.notna(row['tipo_via']) else ""
                    
                    # Manejar nombre_calle vacío
                    if not nombre_calle or nombre_calle.lower() in ['nan', 'null', '']:
                        self.contador_calles_sin_nombre += 1
                        nombre_calle = f"calle sin nombre {self.contador_calles_sin_nombre}"
                    
                    # Validar que seccion_calle no esté vacía
                    if not seccion_calle:
                        errors.append(f"Fila {index + 2}: seccion_calle no puede estar vacía")
                        continue
                    
                    # Manejar tipo de vía vacío o no válido
                    if not tipo_via_original or tipo_via_original.lower() in ['nan', 'null', '']:
                        # Caso: tipo de vía vacío -> usar "no definido"
                        tipo_via_id = tipo_via_no_definido.id
                    else:
                        # Caso: tipo de vía con valor -> debe existir en BD
                        tipo_via_nombre = tipo_via_original.lower()
                        tipo_via = self.db.query(TipoVia).filter(TipoVia.nombre == tipo_via_nombre).first()
                        if not tipo_via:
                            # Este caso ya fue validado anteriormente, pero por seguridad
                            errors.append(f"Fila {index + 2}: Tipo de vía '{tipo_via_original}' no existe en la base de datos")
                            continue
                        tipo_via_id = tipo_via.id
                    
                    # Procesar la fila usando la localidad_id obtenida
                    self._process_row(nombre_calle, seccion_calle, tipo_via_id, localidad_id)
                    processed_rows += 1
                    
                except Exception as e:
                    errors.append(f"Fila {index + 2}: Error al procesar - {str(e)}")
                    continue
            
            # Confirmar transacción
            self.db.commit()
            
            message = f"CSV procesado exitosamente. {processed_rows} filas procesadas."
            if self.contador_calles_sin_nombre > 0:
                message += f" Se crearon {self.contador_calles_sin_nombre} calles sin nombre."
            
            # Agregar información de ubicación creada
            location_info = []
            if self.pais_creado:
                location_info.append(f"País '{pais_nombre}' creado")
            if self.ciudad_creada:
                location_info.append(f"Ciudad '{ciudad_nombre}' creada")
            if self.localidad_creada and localidad_nombre:
                location_info.append(f"Localidad '{localidad_nombre}' creada")
            
            if location_info:
                message += f" {', '.join(location_info)}."
            
            return {
                "success": True,
                "message": message,
                "processed_rows": processed_rows,
                "errors": errors,
                "calles_sin_nombre_creadas": self.contador_calles_sin_nombre,
                "pais_creado": self.pais_creado,
                "ciudad_creada": self.ciudad_creada,
                "localidad_creada": self.localidad_creada
            }
            
        except Exception as e:
            self.db.rollback()
            return {
                "success": False,
                "message": f"Error al procesar CSV: {str(e)}",
                "processed_rows": 0,
                "errors": [str(e)],
                "calles_sin_nombre_creadas": 0,
                "pais_creado": False,
                "ciudad_creada": False,
                "localidad_creada": False
            }
    
    def _can_create_localidad(self, pais_nombre: str, ciudad_nombre: str, localidad_nombre: Optional[str] = None) -> bool:
        #Verifica si se puede crear la localidad (no debe existir previamente)
        # Si no se proporciona localidad, usar el nombre de la ciudad
        if not localidad_nombre or localidad_nombre.strip() == "":
            localidad_nombre = ciudad_nombre
        
        # Buscar país
        pais = self.db.query(Pais).filter(Pais.nombre == pais_nombre).first()
        if not pais:
            # Si el país no existe, se puede crear todo
            return True
        
        # Buscar ciudad
        ciudad = self.db.query(Ciudad).filter(
            Ciudad.nombre == ciudad_nombre,
            Ciudad.id_pais == pais.id
        ).first()
        if not ciudad:
            # Si la ciudad no existe, se puede crear todo
            return True
        
        # Buscar localidad
        localidad = self.db.query(Localidad).filter(
            Localidad.nombre == localidad_nombre,
            Localidad.id_ciudad == ciudad.id
        ).first()
        
        # Si la localidad ya existe, NO se puede procesar el CSV
        return localidad is None
    
    def _process_location_data(self, pais_nombre: str, ciudad_nombre: str, localidad_nombre: Optional[str] = None) -> int:
        #Procesa los datos de ubicación (país, ciudad, localidad) y retorna el ID de la localidad
        #Todos los datos se guardan en minúsculas

        # 1. Buscar o crear país
        pais = self.db.query(Pais).filter(Pais.nombre == pais_nombre).first()
        if not pais:
            pais = Pais(nombre=pais_nombre)  # Ya viene en minúsculas
            self.db.add(pais)
            self.db.flush()
            self.pais_creado = True
        
        # 2. Buscar o crear ciudad
        ciudad = self.db.query(Ciudad).filter(
            Ciudad.nombre == ciudad_nombre,
            Ciudad.id_pais == pais.id
        ).first()
        
        if not ciudad:
            ciudad = Ciudad(
                nombre=ciudad_nombre,  # Ya viene en minúsculas
                id_pais=pais.id
            )
            self.db.add(ciudad)
            self.db.flush()
            self.ciudad_creada = True
        
        # 3. Buscar o crear localidad
        # Si no se proporciona localidad, usar el nombre de la ciudad
        if not localidad_nombre or localidad_nombre.strip() == "":
            localidad_nombre = ciudad_nombre
        
        localidad = self.db.query(Localidad).filter(
            Localidad.nombre == localidad_nombre,
            Localidad.id_ciudad == ciudad.id
        ).first()
        
        if not localidad:
            localidad = Localidad(
                nombre=localidad_nombre,  # Ya viene en minúsculas
                id_ciudad=ciudad.id,
                flg_vigencia='S'  # Por defecto vigente
            )
            self.db.add(localidad)
            self.db.flush()
            self.localidad_creada = True
        
        return localidad.id
    
    def _process_row(self, nombre_calle: str, seccion_calle: str, tipo_via_id: int, localidad_id: int):
        #Procesa una fila individual del CSV
        #Ahora recibe el ID del tipo de vía en lugar del nombre
        # 1. Buscar o crear calle_localidad (ahora usando la localidad_id dinámica)
        calle_localidad = self.db.query(CalleLocalidad).filter(
            CalleLocalidad.nombre == nombre_calle,
            CalleLocalidad.id_localidad == localidad_id
        ).first()
        
        if not calle_localidad:
            calle_localidad = CalleLocalidad(
                nombre=nombre_calle,  # Ya viene en minúsculas
                id_localidad=localidad_id
            )
            self.db.add(calle_localidad)
            self.db.flush()  # Para obtener el ID sin hacer commit
        
        # 2. Crear seccion_calle usando el tipo_via_id
        # Verificar si ya existe esta combinación
        existing_seccion = self.db.query(SeccionCalle).filter(
            SeccionCalle.nombre == seccion_calle,
            SeccionCalle.id_calle_localidad == calle_localidad.id,
            SeccionCalle.id_tipo_via == tipo_via_id
        ).first()
        
        if not existing_seccion:
            seccion_calle_obj = SeccionCalle(
                nombre=seccion_calle,  # Ya viene en minúsculas
                id_calle_localidad=calle_localidad.id,
                id_tipo_via=tipo_via_id
            )
            self.db.add(seccion_calle_obj)
    
    def get_tipo_vias(self) -> List[TipoVia]:
        #Obtiene todos los tipos de vía
        return self.db.query(TipoVia).all()
    
    def get_calles_localidad(self) -> List[CalleLocalidad]:
        #Obtiene todas las calles por localidad
        return self.db.query(CalleLocalidad).all()
    
    def get_secciones_calle(self) -> List[SeccionCalle]:
        #Obtiene todas las secciones de calle
        return self.db.query(SeccionCalle).all()
    
    # Métodos adicionales para consultar los nuevos datos
    def get_paises(self) -> List[Pais]:
        #Obtiene todos los países
        return self.db.query(Pais).all()
    
    def get_ciudades(self, pais_id: Optional[int] = None) -> List[Ciudad]:
        #Obtiene todas las ciudades, opcionalmente filtradas por país
        query = self.db.query(Ciudad)
        if pais_id:
            query = query.filter(Ciudad.id_pais == pais_id)
        return query.all()
    
    def get_localidades(self, ciudad_id: Optional[int] = None) -> List[Localidad]:
        #Obtiene todas las localidades, opcionalmente filtradas por ciudad
        query = self.db.query(Localidad).filter(Localidad.flg_vigencia == 'S')
        if ciudad_id:
            query = query.filter(Localidad.id_ciudad == ciudad_id)
        return query.all()
    
    def check_localidad_exists(self, pais_nombre: str, ciudad_nombre: str, localidad_nombre: Optional[str] = None) -> bool:
        #Método público para verificar si una localidad ya existe
        #Útil para validaciones desde el frontend
        pais_nombre = pais_nombre.strip().lower()
        ciudad_nombre = ciudad_nombre.strip().lower()
        localidad_nombre = localidad_nombre.strip().lower() if localidad_nombre else ciudad_nombre
        
        return not self._can_create_localidad(pais_nombre, ciudad_nombre, localidad_nombre)
    
    def _validate_tipos_via_in_csv(self, df: pd.DataFrame) -> Dict[str, Any]:
        #Valida que todos los tipos de vía no vacíos del CSV existan en la BD
        #Detiene la carga si encuentra tipos de vía inválidos
        try:
            # Obtener tipos de vía únicos del CSV que NO estén vacíos
            tipos_via_csv = set()
            for tipo_via in df['tipo_via'].dropna():
                tipo_via_str = str(tipo_via).strip()
                if tipo_via_str and tipo_via_str.lower() not in ['nan', 'null', '']:
                    tipos_via_csv.add(tipo_via_str.lower())
            
            # Si no hay tipos de vía no vacíos, la validación es exitosa
            if not tipos_via_csv:
                return {
                    "valid": True,
                    "message": "Validación exitosa: Solo tipos de vía vacíos (se usará 'no definido')",
                    "errors": [],
                    "tipos_via_no_encontrados": []
                }
            
            # Obtener tipos de vía de la BD
            tipos_via_bd = self.db.query(TipoVia).all()
            tipos_via_bd_nombres = set(tipo.nombre.lower() for tipo in tipos_via_bd)
            
            # Encontrar tipos de vía que no existen en la BD
            tipos_via_no_encontrados = tipos_via_csv - tipos_via_bd_nombres
            
            if tipos_via_no_encontrados:
                return {
                    "valid": False,
                    "message": f"Error: Se encontraron tipos de vía que no existen en la base de datos: {', '.join(sorted(tipos_via_no_encontrados))}. La carga se ha detenido.",
                    "errors": [f"Tipos de vía no válidos: {', '.join(sorted(tipos_via_no_encontrados))}"],
                    "tipos_via_no_encontrados": list(tipos_via_no_encontrados)
                }
            
            return {
                "valid": True,
                "message": "Validación exitosa: Todos los tipos de vía existen en la base de datos",
                "errors": [],
                "tipos_via_no_encontrados": []
            }
            
        except Exception as e:
            return {
                "valid": False,
                "message": f"Error al validar tipos de vía: {str(e)}",
                "errors": [str(e)],
                "tipos_via_no_encontrados": []
            }


