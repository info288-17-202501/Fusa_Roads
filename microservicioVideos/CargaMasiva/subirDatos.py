# Este programa se encarga de subir los datos. Videos a minio, contexto a MongoDB
# Este programa se encarga de ver la lista de videos, llamar a las funciones para generar los datos faltantes y mantiene el orden del proceso generando un log.
import argparse
import os
from os import listdir
from pathlib import Path
import json

def find_files_os(directory, filename):
    for root, _, files in os.walk(directory):
        if filename in files:
            return os.path.join(root, filename)
    return False 

# Obtener lista de elementos en la carpeta
path_data = "./data/"
lista_archivos = listdir(path_data)

# Leer el general.json
general_name = "general.json"
if not find_files_os(path_data,general_name):
    print("No se encuentra el archivo general")
    exit(1)

with open(path_data + general_name, "r", encoding="utf-8") as f:
    general = json.load(f)
cant_videos = general["cantidad_de_videos"]

# Ver si existe carpeta data (o pendrive E:)

# Ver si el flag de inicio es --mode m (memory) o c (desde cero)

    # la memoria seria un txt que diga si algun mcjson tubo o no problemas, si esta con 'n' lo tomara en la lista


# Obtener lista de mcjson
lista_contextos_a_mano = []
extensiones = [".mcjson"]

for elem in lista_archivos: 
    extension = os.path.splitext(elem)
    if extension[1] in extensiones:
        lista_contextos_a_mano.append(elem)


# Obtener lista de videos 
lista_videos = []
extensiones = [".mp4"]

for elem in lista_archivos: 
    extension = os.path.splitext(elem)
    if extension[1] in extensiones:
        lista_videos.append(elem)

# Ver si la lista de videos = cantidad de videos
if len(lista_videos) != cant_videos:
    print("La cantidad de videos no es igual a la cantidad establecida en general.json")
    exit(1)

# Ver si cant contexto es igual a cant de videos
if len(lista_contextos_a_mano) == len(lista_videos):
    print("Existen menos contextos a mano que videos en la carpeta")
    

# Recorriendo lista de mcjson
for contexto in lista_contextos_a_mano:
    with open(path_data + contexto, "r", encoding="utf-8") as f:
        mcjson = json.load(f)


    # Ver si existe video
    nombre_video = mcjson[""]
    

        # Si existe generar miniatura y ccjson

            # generar miniatur

            # generar ccjson (metadata) (Dar aviso en caso de que algun campo no exista)


        # Si no dar aviso

    

# Verificar que existe video - ccjson - miniatura

    # Si existe subir los elem a minio, mongo


    # Si no volver 




