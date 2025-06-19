# Coordinador.py: Coordinador del proceso de carga masiva
from os import listdir
from pathlib import Path
from typing import List
import argparse
import json
import os
import sys

from rellenarContextos import obtenerMetadata
from obtenerMiniaturas import generar_miniatura

from utils.files_utils import obtener_archivos_en_directorio,actualizar_archivo_json,crear_archivo,filtrar_por_extension
from utils.json_utils import check_mcjson_format

def obtener_etapa_actual(mem, nombre_video):
    for detalle in mem.get("detalle_videos", []):
        if detalle.get("nombre_video") == nombre_video:
            etapas = detalle.get("etapas", {})
            etapas_ordenadas = sorted(etapas.keys())
            
            # Recorre en orden inverso para encontrar la última con True
            for etapa in reversed(etapas_ordenadas):
                if etapas[etapa]:
                    return etapa  # retorna la última etapa completada
            
            return "I_NN"  # pasó por ninguna etapa
    
    return "I_NN"  # no existe en detalle_videos

def etapa_inicial(nombre_general: str, archivos: str) -> dict:
    # Verificar que existe general.json
    if nombre_general not in archivos:
        print("No existe general.json")
        sys.exit(0)
    else:
        with open(path + nombre_general, "r", encoding="utf-8") as f:
            general_json = json.load(f)
            return general_json

def etapa_verificacion(general_json: dict, cant_videos):
    # Verificar que la cantidad de videos de input sea igual a la esperada
    if general_json["cantidad_de_videos"] != cant_videos:
        seguir = input("La cantidad de videos definida en 'general.json' no es igual a la cantidad de videos en la carpeta, seguir (s/n)")
        if seguir != 's':
            print("Se termino la ejecucion por input de usuario")
            sys.exit(0)
    return True

def etapa_memoria(nombre_memoria: str, path: str, archivos: str, lista_videos: List[str]) -> dict | bool:

    detalle_video_vacio = False
    if nombre_memoria not in archivos:  # No hay mem
        mem_json = {
            "lista_videos": lista_videos,
            "lista_videos_procesados": [],
            "campagna": general_json["nombre_campagna"],
            "inicial": True,            # Existe general.json
            "verificacion": True,       # Cant videos esperada confirmada 
            "detalle_videos": []
        }
        crear_archivo(path, "mem.json")
        actualizar_archivo_json(path, "mem.json", mem_json)
        
    else:                               # Si hay mem
        with open(path + nombre_memoria, "r", encoding="utf-8") as f:
            mem_json = json.load(f)

    if mem_json.get("detalle_videos") == []:
        detalle_video_vacio = True
        
    return mem_json, detalle_video_vacio

def etapa_00(path: str, video: str, nvideo_sin_extension:str , archivos: List[str], mem_json: dict) -> dict | bool:
    # Ver si tiene mcjson
    if (nvideo_sin_extension + ".mcjson") not in archivos:
        print(f"No existe el contexto manual (.mcjson) para el video: {video}")
        saltar = input("Saltar (s), Parar proceso (p)")
        if saltar.lower() != 's':
            print("Se termino la ejecucion por input de usuario")
            sys.exit(0)
        return {}, False

    else:
        # Actualizar mem
        mem_json["detalle_videos"].append({
            "nombre_video": video,
            "etapas": 
                {"I_00": True}
        })
    
    actualizar_archivo_json(path, "mem.json", mem_json)

    with open(path + nvideo_sin_extension + ".mcjson", "r", encoding="utf-8") as f:
        mc_json = json.load(f)
    return mc_json, True

def etapa_01(path: str, video: str, mc_json: dict, mem_json: dict) -> bool:
    # Ver si cumple el formato 
    if not check_mcjson_format(mc_json):
        print(f"El contexto manual para el video: {video}, no cumple con el formato adecuado")
        saltar = input("Saltar (s), Parar proceso (p)")
        if saltar != 's':
            print("Se termino la ejecucion por input de usuario")
            sys.exit(0)
        return False
    else:
        # Actualizar mem
        for detalle in mem_json["detalle_videos"]:
            if detalle.get("nombre_video") == video:
                detalle.setdefault("etapas", {})["I_01"] = True
            
    actualizar_archivo_json(path, "mem.json", mem_json)
    return True

def etapa_02(path: str, video: str, mem_json: dict) -> bool:
    # Sacar metadata y hacer ccjson
    obtenerMetadata(path, video, nvideo_sin_extension + ".mcjson")
    # Actualizar mem
    for detalle in mem_json["detalle_videos"]:
        if detalle.get("nombre_video") == video:
            detalle.setdefault("etapas", {})["I_02"] = True
    
    actualizar_archivo_json(path, "mem.json", mem_json)
    return True

def etapa_03(path: str, video:str, nvideo_sin_extension: str, mem_json: dict) -> bool:
    generar_miniatura(path + video, path + nvideo_sin_extension + ".jpg")
    for detalle in mem_json["detalle_videos"]:
        if detalle.get("nombre_video") == video:
            detalle.setdefault("etapas", {})["I_03"] = True

    actualizar_archivo_json(path, "mem.json", mem_json)
    return True

if __name__ == '__main__':
    path = "./data/"
    general_name = "general.json"

    # Obtener lista de archivos en data o E:
    archivos = obtener_archivos_en_directorio(path)["archivos"]
    lista_videos = filtrar_por_extension(archivos, [".mp4"])["archivos"]
    
    # general.json
    general_json = etapa_inicial(general_name, archivos)
    
    # Ver si existe memoria 
    mem_json, detalle_video_vacio = etapa_memoria("mem.json", path, archivos, lista_videos)
    
    # Videos no procesados
    lista_videos_no_procesado = mem_json["lista_videos"].copy()

    print(f"Videos a procesar: {lista_videos_no_procesado}")
    for i, video in enumerate(lista_videos_no_procesado):
        nvideo_sin_extension = os.path.splitext(video)[0]

        print(f"Num: {i}, Procesando video: {video}, Sin extension: {nvideo_sin_extension}")       

        # Ver si el video fue procesado parcialmente antes
        if not detalle_video_vacio: 
            etapa = obtener_etapa_actual(mem_json, video)
            print(f"    Etapa: {etapa}")
        else:
            print(f"    Desde cero")

        mc_json = None
        if etapa != "I_NN" and etapa != "I_00":
            ruta_mcjson = Path(path) / f"{nvideo_sin_extension}.mcjson"
            if ruta_mcjson.exists():
                with open(ruta_mcjson, "r", encoding="utf-8") as f:
                    mc_json = json.load(f)


        if detalle_video_vacio or etapa == "I_00":
            mc_json, continuar = etapa_00(path, video, nvideo_sin_extension, archivos, mem_json)
            if not continuar or mc_json == {}:
                continue

            etapa = "I_01"
            
        if detalle_video_vacio or etapa == "I_01":
            if not etapa_01(path, video, mc_json, mem_json):
                continue

            etapa = "I_02"

        if detalle_video_vacio or etapa == "I_02":
            etapa_02(path, video, mem_json)
            etapa = "I_03"

        if detalle_video_vacio or etapa == "I_03":
            etapa_03(path, video, nvideo_sin_extension, mem_json)
            etapa = "I_04"

        if detalle_video_vacio or etapa == "I_04":
            print("Subir pogres")

            etapa = "I_05"

            # Subir posgres

                # Obtener posgres ID

                    # Actualizar mem


        if detalle_video_vacio or etapa == "I_05":
            # Subir mongo
            print("Subir mongo")

            etapa = "I_06"

        if detalle_video_vacio or etapa == "I_06":
            print("Subir minio")
            # Subir MinIO


            mem_json["lista_videos_procesados"].append(video)
            mem_json["lista_videos"].remove(video)

            actualizar_archivo_json(path, "mem.json", mem_json)


    