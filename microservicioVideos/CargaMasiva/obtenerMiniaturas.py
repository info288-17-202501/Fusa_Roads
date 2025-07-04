import cv2  # Licencia Apache Software License (Apache 2.0)

def generar_miniatura(video_path: str, salida_path: str) -> dict:
    video = cv2.VideoCapture(video_path)

    if not video.isOpened():
        return {
            "status" : 0,
            "msg" : "No se pudo abrir el video"
        }

    ret, frame = video.read()
    if not ret:
        return {
            "status" : 0,
            "msg" : "No se pudo leer el primer frame"
        }

    cv2.imwrite(salida_path, frame)
    video.release()
    
    return {
        "status" : 1,
        "msg" : "Miniatura guardada en: {salida_path}"
    }
# video_file = "./data/VID_1(720P_60FPS).mp4"  
# salida_path = "./data/VID_1(720P_60FPS).jpg"  
# generar_miniatura(video_file, salida_path)