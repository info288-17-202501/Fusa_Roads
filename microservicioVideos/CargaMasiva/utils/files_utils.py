#files_utils.py
from pathlib import Path
from typing import List
import json

def crear_archivo(path_directorio: str, nombre_archivo: str) -> dict:
    ruta = Path(path_directorio) / nombre_archivo

    try:
        ruta.parent.mkdir(parents=True, exist_ok=True) 
        ruta.touch(exist_ok=False)  
        return {
            "status": True,
            "msg": f"Se creó el archivo: '{ruta}'"
        }
    except FileExistsError:
        return {
            "status": False,
            "msg": f"El archivo ya existe: '{ruta}'"
        }
    except Exception as e:
        return {
            "status": False,
            "msg": f"Error inesperado en la funcion 'crear_archivo': {e}"
        }
    

def obtener_archivos_en_directorio(path_directorio: str) -> dict:
    try:
        ruta = Path(path_directorio)
        if not ruta.exists():
            return {
                "status": False,
                "msg": f"El directorio: '{ruta}' no existe",
                "archivos": []
            }

        if not ruta.is_dir():
            return {
                "status": False,
                "msg": f"La ruta: '{ruta}', no es un directorio",
                "archivos": []
            }

        archivos = [f.name for f in ruta.iterdir() if f.is_file()]
        return {
            "status": True,
            "msg": f"{len(archivos)} archivo(s) encontrados en '{ruta}'",
            "archivos": archivos
        }
    except Exception as e:
        return {
            "status": False,
            "msg": f"Error inesperado en la funcion 'obtener_archivos_en_directorio': {e}",
            "archivos": []
        }
    
def actualizar_archivo_json(path_archivo: str, nombre_archivo: str, nuevo_contenido: dict) -> dict:
    """
        Funcion que permite sobreescribir un archivo existente con nuevo contenido
    """
    ruta = Path(path_archivo) / nombre_archivo
    try:
        # Verificar si el archivo existe
        if not ruta.exists():
            return {
                "status": False,
                "msg": f"El archivo: '{ruta}' no existe."
            }

        with open(ruta, "w", encoding="utf-8") as f:
            json.dump(nuevo_contenido, f, indent=4, ensure_ascii=False)

        return {
            "status": True,
            "msg": f"Archivo actualizado correctamente: '{ruta}'"
        }

    except Exception as e:
        return {
            "status": False,
            "msg": f"Error inesperado en la funcion 'actualizar_archivo': {e}"
        }
    

def filtrar_por_extension(archivos: List[str], extensiones_validas: List[str]) -> dict:
    try: 
        extensiones_normalizadas = [ext.lower().lstrip(".") for ext in extensiones_validas]

        archivos_filtrados = [
            archivo for archivo in archivos
            if Path(archivo).suffix.lower().lstrip(".") in extensiones_normalizadas
        ]

        return {
            "status": True,
            "archivos": archivos_filtrados,
            "msg": "Archivos obtenidos correctamente"
        }
    except Exception as e:
        return {
            "status": False,
            "archivos": [],
            "msg": f"Error inesperado en la funcion 'filtrar_por_extension': {e}"
        }