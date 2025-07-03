// resources/proyectosData.ts
import { ProyectoIA } from "./types";

export const proyectosData: ProyectoIA[] = [
  {
    id: 1,
    nombreProyecto: "placeholder",
    videoSalida: false,
    ventanasTiempo: false,
    mVideo: "m1",
    mAudio: "m2",
    listaVideos: [
      {
        _id: 2,
        name: "VID20250403124144.mp4",
        activo: true,
        ruta_miniatura_minio:
          "videos_original/test/miniaturas/VID20250403124144.jpg",
        minio_bucket: "fusaroads",
        linea: [
          {
            x: 365.0234375,
            y: 268.89453125,
          },
          {
            x: 316.0234375,
            y: 126.89453125,
          },
        ],
        poligono: [
          {
            x: 484.0234375,
            y: 276.89453125,
          },
          {
            x: 297.0234375,
            y: 34.89453125,
          },
          {
            x: 232.0234375,
            y: 164.89453125,
          },
          {
            x: 269.0234375,
            y: 283.89453125,
          },
        ],
      },
    ],
  },
];
