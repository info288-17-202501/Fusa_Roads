import json
from typing import List, Dict, Any
from fastapi import HTTPException
from pathlib import Path
from pydantic import BaseModel


# funciones auxiliares que se pueden utilizar en cualquier parte del microservicio


def read_json(JSON_PATH) -> List[Dict[str, Any]]:
    try:
        with open(JSON_PATH, 'r', encoding='utf-8') as file:
            return json.load(file)
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="Archivo JSON no encontrado")
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Error decodificando JSON")

def write_json(data: List[Dict[str, Any]], JSON_PATH):
    try:
        with open(JSON_PATH, 'w', encoding='utf-8') as file:
            json.dump(data, file, indent=4, ensure_ascii=False)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error escribiendo JSON: {str(e)}")

