// resources/proyectosData.ts
import { ProyectoIA } from "./types";

export const proyectosData: ProyectoIA[] = [
  {
    id: 1,
    nombre: "Proyecto A",
    videoSalida: true,
    ventanasTiempo: true,
    mVideo: "modelo_video_v1",
    mAudio: "modelo_audio_v1",
  },
  {
    id: 2,
    nombre: "Proyecto B",
    videoSalida: false,
    ventanasTiempo: true,
    mVideo: "modelo_video_v2",
    mAudio: "modelo_audio_v2",
  },
  {
    id: 3,
    nombre: "Proyecto C",
    videoSalida: true,
    ventanasTiempo: false,
    mVideo: "modelo_video_experimental",
    mAudio: "modelo_audio_v3",
  },
];
