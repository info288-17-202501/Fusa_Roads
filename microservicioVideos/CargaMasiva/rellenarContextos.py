from datetime import datetime, timedelta
from pathlib import Path
import ffmpeg #Apache Software License
import json
import re

# ffmpeg: https://github.com/BtbN/FFmpeg-Builds?tab=MIT-1-ov-file#readme -> MIT License

def obtenerMetadata(folder_path: str, video_name: str, mcjson_name: str):
    try:
        metadata = ffmpeg.probe(folder_path + video_name)


        # Contexto a mano
        with open(folder_path + mcjson_name, "r", encoding="utf-8") as f:
            mcjson = json.load(f)

        # Extraccion metadata
        formato = metadata["format"]
        streams = metadata["streams"]
        stream_video = next(s for s in streams if s["codec_type"] == "video")

        extension = Path(formato["filename"]).suffix
        duracion_s = float(formato["duration"])
        fps = stream_video["r_frame_rate"]
        hora_ini_metadata = formato["tags"].get("creation_time", None)

        
        if hora_ini_metadata:
            hora_ini_dt = datetime.fromisoformat(hora_ini_metadata.replace("Z", ""))
            hora_fin_dt = hora_ini_dt + timedelta(seconds=duracion_s)

            # Convertir a string en formato ISO
            hora_ini_metadata = hora_ini_dt.isoformat()
            hora_fin_metadata = hora_fin_dt.isoformat()
        else:
            # Si no hay metadata de hora, dejar como None o un string indicando ausencia
            hora_ini_metadata = None
            hora_fin_metadata = None

        res = {
            "ancho": stream_video["width"],
            "alto": stream_video["height"]
        }

        # Obtener ubicación GPS desde metadata
        location = formato["tags"].get("location", None)
        if location:
            matches = re.findall(r'-?\d+\.\d+', location)
            if len(matches) >= 2:
                lat = float(matches[0])
                lon = float(matches[1])
                gps = {
                    "raw" : location,
                    "latitud_metadata": lat,
                    "longitud_metadata": lon,
                }
            else:
                gps = {"raw" : location}
        else:
            gps = {"raw" : None}

        # ccjson con la metadata extraida + info de mcjson
        combinado = {
            **mcjson,
            "extension": extension,
            "duracion_s": duracion_s,
            "fps": fps,
            "hora_ini_metadata": hora_ini_metadata,
            "hora_fin_metadata": hora_fin_metadata,  # puedes sumarle tiempo si lo transformas a datetime
            "resolucion": res,
            "gps": gps
        }

        # Guardar como archivo .ccjson
        output_path = f"{folder_path}{Path(video_name).stem}.ccjson"
        with open(output_path, "w", encoding="utf-8") as archivo:
            json.dump(combinado, archivo, ensure_ascii=False, indent=4)

    except ffmpeg.Error as e:
        print(f"Error de FFmpeg: {e.stderr.decode()}")
    except Exception as e:
        print(f"Otro error: {e}")

obtenerMetadata("./data/","VID_2(720P_60FPS).mp4", "VID_2(720P_60FPS).mcjson")


