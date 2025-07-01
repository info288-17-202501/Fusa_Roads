export type ProyectoIA = {
    id: number;
    nombre: string;
    videoSalida: boolean;
    ventanasTiempo: boolean;
    mVideo: string;
    mAudio: string;
    tiempo?: number;
    unidad?: string;
};

export type Video = {
  id: number;
  nombre: string;
  activo: boolean;
};