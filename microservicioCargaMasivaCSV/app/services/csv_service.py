import pandas as pd
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional
from io import StringIO
from dataclasses import dataclass

from app.models.calle_localidad import CalleLocalidad
from app.models.tipo_via import TipoVia
from app.models.seccion_calle import SeccionCalle
from app.models.pais import Pais
from app.models.ciudad import Ciudad
from app.models.localidad import Localidad
from app.schemas.csv_upload import CSVRowData


@dataclass
class ProcessResult:
    """Resultado del procesamiento del CSV"""
    success: bool
    message: str
    processed_rows: int = 0
    errors: List[str] = None
    pais_creado: bool = False
    ciudad_creada: bool = False
    localidad_creada: bool = False
    calles_sin_nombre_creadas: int = 0
    tipos_via_no_encontrados: List[str] = None

    def __post_init__(self):
        if self.errors is None:
            self.errors = []
        if self.tipos_via_no_encontrados is None:
            self.tipos_via_no_encontrados = []

    def to_dict(self) -> Dict[str, Any]:
        return {
            "success": self.success,
            "message": self.message,
            "processed_rows": self.processed_rows,
            "errors": self.errors,
            "pais_creado": self.pais_creado,
            "ciudad_creada": self.ciudad_creada,
            "localidad_creada": self.localidad_creada,
            "calles_sin_nombre_creadas": self.calles_sin_nombre_creadas,
            "tipos_via_no_encontrados": self.tipos_via_no_encontrados
        }


class LocationManager:
    """Maneja la creación y búsqueda de ubicaciones (país, ciudad, localidad)"""
    
    def __init__(self, db: Session):
        self.db = db
        self.pais_creado = False
        self.ciudad_creada = False
        self.localidad_creada = False
    
    def get_or_create_location(self, pais_nombre: str, ciudad_nombre: str, 
                             localidad_nombre: Optional[str] = None) -> int:
        """Obtiene o crea la ubicación completa y retorna el ID de la localidad"""
        # Normalizar datos
        pais_nombre = self._normalize_text(pais_nombre)
        ciudad_nombre = self._normalize_text(ciudad_nombre)
        localidad_nombre = self._normalize_text(localidad_nombre) if localidad_nombre else ciudad_nombre
        
        # Crear jerarquía de ubicación
        pais_id = self._get_or_create_pais(pais_nombre)
        ciudad_id = self._get_or_create_ciudad(ciudad_nombre, pais_id)
        localidad_id = self._get_or_create_localidad(localidad_nombre, ciudad_id)
        
        return localidad_id
    
    def location_exists(self, pais_nombre: str, ciudad_nombre: str, 
                       localidad_nombre: Optional[str] = None) -> bool:
        """Verifica si la ubicación ya existe"""
        pais_nombre = self._normalize_text(pais_nombre)
        ciudad_nombre = self._normalize_text(ciudad_nombre)
        localidad_nombre = self._normalize_text(localidad_nombre) if localidad_nombre else ciudad_nombre
        
        # Buscar en cascada
        pais = self.db.query(Pais).filter(Pais.nombre == pais_nombre).first()
        if not pais:
            return False
        
        ciudad = self.db.query(Ciudad).filter(
            Ciudad.nombre == ciudad_nombre,
            Ciudad.id_pais == pais.id
        ).first()
        if not ciudad:
            return False
        
        localidad = self.db.query(Localidad).filter(
            Localidad.nombre == localidad_nombre,
            Localidad.id_ciudad == ciudad.id
        ).first()
        
        return localidad is not None
    
    def _get_or_create_pais(self, nombre: str) -> int:
        """Obtiene o crea un país"""
        pais = self.db.query(Pais).filter(Pais.nombre == nombre).first()
        if not pais:
            pais = Pais(nombre=nombre)
            self.db.add(pais)
            self.db.flush()
            self.pais_creado = True
        return pais.id
    
    def _get_or_create_ciudad(self, nombre: str, pais_id: int) -> int:
        """Obtiene o crea una ciudad"""
        ciudad = self.db.query(Ciudad).filter(
            Ciudad.nombre == nombre,
            Ciudad.id_pais == pais_id
        ).first()
        if not ciudad:
            ciudad = Ciudad(nombre=nombre, id_pais=pais_id)
            self.db.add(ciudad)
            self.db.flush()
            self.ciudad_creada = True
        return ciudad.id
    
    def _get_or_create_localidad(self, nombre: str, ciudad_id: int) -> int:
        """Obtiene o crea una localidad"""
        localidad = self.db.query(Localidad).filter(
            Localidad.nombre == nombre,
            Localidad.id_ciudad == ciudad_id
        ).first()
        if not localidad:
            localidad = Localidad(
                nombre=nombre,
                id_ciudad=ciudad_id,
                flg_vigencia='S'
            )
            self.db.add(localidad)
            self.db.flush()
            self.localidad_creada = True
        return localidad.id
    
    @staticmethod
    def _normalize_text(text: str) -> str:
        """Normaliza texto a minúsculas sin espacios extra"""
        return text.strip().lower() if text else ""


class TipoViaValidator:
    """Valida los tipos de vía del CSV"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def validate_csv_tipos_via(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Valida que todos los tipos de vía del CSV existan en la BD"""
        try:
            # Obtener tipos de vía únicos no vacíos del CSV
            tipos_via_csv = self._extract_tipos_via_from_csv(df)
            
            if not tipos_via_csv:
                return self._success_result("Solo tipos de vía vacíos (se usará 'no definido')")
            
            # Verificar contra la BD
            tipos_via_bd = self._get_tipos_via_bd()
            tipos_no_encontrados = tipos_via_csv - tipos_via_bd
            
            if tipos_no_encontrados:
                return self._error_result(tipos_no_encontrados)
            
            return self._success_result("Todos los tipos de vía existen en la base de datos")
            
        except Exception as e:
            return {
                "valid": False,
                "message": f"Error al validar tipos de vía: {str(e)}",
                "errors": [str(e)],
                "tipos_via_no_encontrados": []
            }
    
    def get_tipo_via_no_definido(self) -> Optional[TipoVia]:
        """Obtiene el tipo de vía 'no definido'"""
        return self.db.query(TipoVia).filter(TipoVia.nombre == "no definido").first()
    
    def get_tipo_via_by_name(self, nombre: str) -> Optional[TipoVia]:
        """Obtiene un tipo de vía por nombre"""
        return self.db.query(TipoVia).filter(TipoVia.nombre == nombre.lower()).first()
    
    def _extract_tipos_via_from_csv(self, df: pd.DataFrame) -> set:
        """Extrae tipos de vía únicos no vacíos del CSV"""
        tipos_via = set()
        for tipo_via in df['tipo_via'].dropna():
            tipo_via_str = str(tipo_via).strip()
            if tipo_via_str and tipo_via_str.lower() not in ['nan', 'null', '']:
                tipos_via.add(tipo_via_str.lower())
        return tipos_via
    
    def _get_tipos_via_bd(self) -> set:
        """Obtiene tipos de vía de la BD"""
        tipos_via_bd = self.db.query(TipoVia).all()
        return set(tipo.nombre.lower() for tipo in tipos_via_bd)
    
    def _success_result(self, message: str) -> Dict[str, Any]:
        """Resultado exitoso de validación"""
        return {
            "valid": True,
            "message": f"Validación exitosa: {message}",
            "errors": [],
            "tipos_via_no_encontrados": []
        }
    
    def _error_result(self, tipos_no_encontrados: set) -> Dict[str, Any]:
        """Resultado de error de validación"""
        tipos_str = ', '.join(sorted(tipos_no_encontrados))
        return {
            "valid": False,
            "message": f"Error: Tipos de vía no encontrados: {tipos_str}. La carga se ha detenido.",
            "errors": [f"Tipos de vía no válidos: {tipos_str}"],
            "tipos_via_no_encontrados": list(tipos_no_encontrados)
        }


class StreetProcessor:
    """Procesa las calles y secciones del CSV"""
    
    def __init__(self, db: Session, localidad_id: int):
        self.db = db
        self.localidad_id = localidad_id
        self.contador_calles_sin_nombre = 0
    
    def process_street_row(self, nombre_calle: str, seccion_calle: str, tipo_via_id: int):
        """Procesa una fila de calle individual"""
        # Manejar nombres de calle vacíos
        if not nombre_calle or nombre_calle.lower() in ['nan', 'null', '']:
            self.contador_calles_sin_nombre += 1
            nombre_calle = f"calle sin nombre {self.contador_calles_sin_nombre}"
        
        # Obtener o crear calle
        calle_localidad = self._get_or_create_calle(nombre_calle)
        
        # Crear sección si no existe
        self._create_seccion_if_not_exists(seccion_calle, calle_localidad.id, tipo_via_id)
    
    def _get_or_create_calle(self, nombre_calle: str) -> CalleLocalidad:
        """Obtiene o crea una calle en la localidad"""
        calle = self.db.query(CalleLocalidad).filter(
            CalleLocalidad.nombre == nombre_calle.lower(),
            CalleLocalidad.id_localidad == self.localidad_id
        ).first()
        
        if not calle:
            calle = CalleLocalidad(
                nombre=nombre_calle.lower(),
                id_localidad=self.localidad_id
            )
            self.db.add(calle)
            self.db.flush()
        
        return calle
    
    def _create_seccion_if_not_exists(self, seccion_nombre: str, calle_id: int, tipo_via_id: int):
        """Crea una sección de calle si no existe"""
        existing_seccion = self.db.query(SeccionCalle).filter(
            SeccionCalle.nombre == seccion_nombre.lower(),
            SeccionCalle.id_calle_localidad == calle_id,
            SeccionCalle.id_tipo_via == tipo_via_id
        ).first()
        
        if not existing_seccion:
            seccion = SeccionCalle(
                nombre=seccion_nombre.lower(),
                id_calle_localidad=calle_id,
                id_tipo_via=tipo_via_id
            )
            self.db.add(seccion)


class CSVService:
    """Servicio principal para procesar archivos CSV de calles"""
    
    REQUIRED_COLUMNS = ['nombre_calle', 'seccion_calle', 'tipo_via']
    
    def __init__(self, db: Session):
        self.db = db
        self.location_manager = LocationManager(db)
        self.tipo_via_validator = TipoViaValidator(db)
    
    def process_csv_content(self, csv_content: str, pais_nombre: str, 
                          ciudad_nombre: str, localidad_nombre: Optional[str] = None) -> Dict[str, Any]:
        """Procesa el contenido del CSV y carga los datos en la base de datos"""
        try:
            # 1. Verificar si la localidad ya existe
            if self.location_manager.location_exists(pais_nombre, ciudad_nombre, localidad_nombre):
                return ProcessResult(
                    success=False,
                    message="La localidad ya existe. Para cargar datos, primero elimine los datos previos.",
                    errors=["Localidad ya existe"]
                ).to_dict()
            
            # 2. Leer y validar CSV
            df = pd.read_csv(StringIO(csv_content))
            validation_result = self._validate_csv_structure(df)
            if not validation_result.success:
                return validation_result.to_dict()
            
            # 3. Validar tipos de vía
            tipo_via_validation = self.tipo_via_validator.validate_csv_tipos_via(df)
            if not tipo_via_validation["valid"]:
                return ProcessResult(
                    success=False,
                    message=tipo_via_validation["message"],
                    errors=tipo_via_validation["errors"],
                    tipos_via_no_encontrados=tipo_via_validation["tipos_via_no_encontrados"]
                ).to_dict()
            
            # 4. Crear ubicación
            localidad_id = self.location_manager.get_or_create_location(
                pais_nombre, ciudad_nombre, localidad_nombre
            )
            
            # 5. Procesar filas del CSV
            result = self._process_csv_rows(df, localidad_id)
            
            # 6. Confirmar transacción
            self.db.commit()
            
            # 7. Preparar resultado final
            return self._build_final_result(result, pais_nombre, ciudad_nombre, localidad_nombre)
            
        except Exception as e:
            self.db.rollback()
            return ProcessResult(
                success=False,
                message=f"Error al procesar CSV: {str(e)}",
                errors=[str(e)]
            ).to_dict()
    
    def check_localidad_exists(self, pais_nombre: str, ciudad_nombre: str, 
                             localidad_nombre: Optional[str] = None) -> bool:
        """Verifica si una localidad ya existe"""
        return self.location_manager.location_exists(pais_nombre, ciudad_nombre, localidad_nombre)
    
    # Métodos de consulta
    def get_tipo_vias(self) -> List[TipoVia]:
        return self.db.query(TipoVia).all()
    
    def get_calles_localidad(self) -> List[CalleLocalidad]:
        """Obtiene todas las calles por localidad"""
        return self.db.query(CalleLocalidad).all()
    
    def get_secciones_calle(self) -> List[SeccionCalle]:
        """Obtiene todas las secciones de calle"""
        return self.db.query(SeccionCalle).all()
    
    def get_paises(self) -> List[Pais]:
        return self.db.query(Pais).all()
    
    def get_ciudades(self, pais_id: Optional[int] = None) -> List[Ciudad]:
        query = self.db.query(Ciudad)
        if pais_id:
            query = query.filter(Ciudad.id_pais == pais_id)
        return query.all()
    
    def get_localidades(self, ciudad_id: Optional[int] = None) -> List[Localidad]:
        query = self.db.query(Localidad).filter(Localidad.flg_vigencia == 'S')
        if ciudad_id:
            query = query.filter(Localidad.id_ciudad == ciudad_id)
        return query.all()
    
    # Métodos privados
    def _validate_csv_structure(self, df: pd.DataFrame) -> ProcessResult:
        """Valida la estructura básica del CSV"""
        missing_columns = [col for col in self.REQUIRED_COLUMNS if col not in df.columns]
        
        if missing_columns:
            return ProcessResult(
                success=False,
                message=f"El CSV debe contener las columnas: {', '.join(self.REQUIRED_COLUMNS)}",
                errors=[f"Columnas faltantes: {missing_columns}. Encontradas: {list(df.columns)}"]
            )
        
        # Verificar que existe el tipo de vía "no definido"
        tipo_via_no_definido = self.tipo_via_validator.get_tipo_via_no_definido()
        if not tipo_via_no_definido:
            return ProcessResult(
                success=False,
                message="Error de configuración: No existe el tipo de vía 'no definido' en la base de datos.",
                errors=["Tipo de vía 'no definido' no existe"]
            )
        
        return ProcessResult(success=True, message="CSV válido")
    
    def _process_csv_rows(self, df: pd.DataFrame, localidad_id: int) -> ProcessResult:
        """Procesa todas las filas del CSV"""
        street_processor = StreetProcessor(self.db, localidad_id)
        processed_rows = 0
        errors = []
        
        for index, row in df.iterrows():
            try:
                # Limpiar datos
                nombre_calle = self._clean_text(row['nombre_calle'])
                seccion_calle = self._clean_text(row['seccion_calle'])
                tipo_via_original = self._clean_text(row['tipo_via'])
                
                # Validar sección requerida
                if not seccion_calle:
                    errors.append(f"Fila {index + 2}: seccion_calle no puede estar vacía")
                    continue
                
                # Obtener ID del tipo de vía
                tipo_via_id = self._get_tipo_via_id(tipo_via_original)
                if not tipo_via_id:
                    errors.append(f"Fila {index + 2}: Tipo de vía '{tipo_via_original}' no válido")
                    continue
                
                # Procesar la fila
                street_processor.process_street_row(nombre_calle, seccion_calle, tipo_via_id)
                processed_rows += 1
                
            except Exception as e:
                errors.append(f"Fila {index + 2}: Error al procesar - {str(e)}")
                continue
        
        return ProcessResult(
            success=True,
            processed_rows=processed_rows,
            errors=errors,
            calles_sin_nombre_creadas=street_processor.contador_calles_sin_nombre
        )
    
    def _get_tipo_via_id(self, tipo_via_original: str) -> Optional[int]:
        """Obtiene el ID del tipo de vía, usando 'no definido' si está vacío"""
        if not tipo_via_original or tipo_via_original.lower() in ['nan', 'null', '']:
            tipo_via_no_definido = self.tipo_via_validator.get_tipo_via_no_definido()
            return tipo_via_no_definido.id if tipo_via_no_definido else None
        
        tipo_via = self.tipo_via_validator.get_tipo_via_by_name(tipo_via_original)
        return tipo_via.id if tipo_via else None
    
    def _build_final_result(self, process_result: ProcessResult, pais_nombre: str, 
                          ciudad_nombre: str, localidad_nombre: Optional[str]) -> Dict[str, Any]:
        """Construye el resultado final con información de ubicación"""
        message = f"CSV procesado exitosamente. {process_result.processed_rows} filas procesadas."
        
        if process_result.calles_sin_nombre_creadas > 0:
            message += f" Se crearon {process_result.calles_sin_nombre_creadas} calles sin nombre."
        
        # Agregar información de ubicación creada
        location_info = []
        if self.location_manager.pais_creado:
            location_info.append(f"País '{pais_nombre}' creado")
        if self.location_manager.ciudad_creada:
            location_info.append(f"Ciudad '{ciudad_nombre}' creado")
        if self.location_manager.localidad_creada and localidad_nombre:
            location_info.append(f"Localidad '{localidad_nombre}' creada")
        
        if location_info:
            message += f" {', '.join(location_info)}."
        
        return ProcessResult(
            success=True,
            message=message,
            processed_rows=process_result.processed_rows,
            errors=process_result.errors,
            calles_sin_nombre_creadas=process_result.calles_sin_nombre_creadas,
            pais_creado=self.location_manager.pais_creado,
            ciudad_creada=self.location_manager.ciudad_creada,
            localidad_creada=self.location_manager.localidad_creada
        ).to_dict()
    
    @staticmethod
    def _clean_text(value) -> str:
        """Limpia y normaliza texto"""
        if pd.isna(value):
            return ""
        return str(value).strip().lower()