#json_utils.py

def check_mcjson_format(data):
    # Claves principales requeridas
    claves_requeridas = [
        "nombre_video",
        "fecha_de_registro_manual",
        "gps_manual",
        "hora_ini_manual",
        "hora_fin_manual",
        "desc_manual",
        "contexto"
    ]
    
    # Verificar primeras claves
    for clave in claves_requeridas: 
        if clave not in data:
            print(f"Falta la clave: {clave}")
            return False
    
    # verificar claves dentro de 'gps_manual'
    gps = data.get("gps_manual", {})
    if not isinstance(gps, dict):
        print("gps_manual no es un objeto")
        return False
    
    if "latitud_manual" not in gps or "longitud_manual" not in gps:
        print("gps_manual debe contener latitud_manual y longitud_manual")
        return False
    
    return True


def check_general_json_format(data):
    # Claves principales requeridas
    claves_requeridas = ["nombre_campagna", "cantidad_de_videos", "pais", "ciudad", "localidad"]
    
    # Verificar primeras claves
    for clave in claves_requeridas: 
        if clave not in data:
            print(f"Falta la clave: {clave}")
            return False
    
    return True