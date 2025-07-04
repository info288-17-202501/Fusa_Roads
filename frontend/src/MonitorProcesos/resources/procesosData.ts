// resources/procesosData.ts
// Los datos ahora se cargan desde la API
import { Proceso } from "./types";
import { fetchProcesos } from "./api";

// Función para obtener los datos de la API
export const loadProcesosData = async (): Promise<Proceso[]> => {
  return await fetchProcesos();
};

// Datos de ejemplo para casos de prueba (ya no se usan en producción)
export const procesosDataExample: Proceso[] = [
  {
    "_id": "6865f6f8caa6d789464a8152",
    "pia_id": "1",
    "fecha_inicio": "2025-07-02T23:20:24.550501",
    "estados": [
      {
        "estado": "inicio",
        "orden": 1,
        "fecha_hora_ini": "2025-07-02T23:20:24.562762",
        "fecha_hora_fin": "2025-07-02T23:20:24.571799",
        "flag": "ok",
        "descrip": ""
      },
      {
        "estado": "preproceso",
        "orden": 2,
        "fecha_hora_ini": "2025-07-02T23:20:24.581676",
        "fecha_hora_fin": "2025-07-02T23:20:24.594232",
        "flag": "ok",
        "descrip": ""
      },
      {
        "estado": "video",
        "orden": 3,
        "fecha_hora_ini": "2025-07-02T23:20:24.602744",
        "fecha_hora_fin": "2025-07-02T23:20:24.699624",
        "flag": "ok",
        "descrip": "",
        "avance": {
          "actual": 90,
          "total": 100
        }
      },
      {
        "estado": "audio",
        "orden": 4,
        "fecha_hora_ini": "2025-07-02T23:20:24.707623",
        "fecha_hora_fin": "2025-07-02T23:20:24.717622",
        "flag": "ok",
        "descrip": ""
      },
      {
        "estado": "integrado",
        "orden": 5,
        "fecha_hora_ini": "2025-07-02T23:20:24.727624",
        "fecha_hora_fin": "2025-07-02T23:20:24.737624",
        "flag": "ok",
        "descrip": ""
      }
    ]
  },
  {
    "_id": "6865f707caa6d789464a8153",
    "pia_id": "1",
    "fecha_inicio": "2025-07-02T23:20:39.186758",
    "estados": [
      {
        "estado": "inicio",
        "orden": 1,
        "fecha_hora_ini": "2025-07-02T23:20:39.198453",
        "fecha_hora_fin": "2025-07-02T23:20:39.208555",
        "flag": "ok",
        "descrip": ""
      },
      {
        "estado": "preproceso",
        "orden": 2,
        "fecha_hora_ini": "2025-07-02T23:20:39.217255",
        "fecha_hora_fin": "2025-07-02T23:20:39.228977",
        "flag": "ok",
        "descrip": ""
      },
      {
        "estado": "video",
        "orden": 3,
        "fecha_hora_ini": "2025-07-02T23:20:39.239541",
        "fecha_hora_fin": "2025-07-02T23:20:39.333043",
        "flag": "ok",
        "descrip": "",
        "avance": {
          "actual": 90,
          "total": 100
        }
      },
      {
        "estado": "audio",
        "orden": 4,
        "fecha_hora_ini": "2025-07-02T23:20:39.342780",
        "fecha_hora_fin": "2025-07-02T23:20:39.355234",
        "flag": "ok",
        "descrip": ""
      },
      {
        "estado": "integrado",
        "orden": 5,
        "fecha_hora_ini": "2025-07-02T23:20:39.364330",
        "fecha_hora_fin": "2025-07-02T23:20:39.375014",
        "flag": "ok",
        "descrip": ""
      }
    ]
  }
];
