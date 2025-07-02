export type ProyectoIA = {
    nombreProyecto: string;
    videoSalida: boolean;
    ventanasTiempo: boolean;
    mVideo: string;
    mAudio: string;
    listaVideos: Video[];
    tiempo?: number;
    unidad?: string;
};

export type Video = {
  _id: number;
  name: string;
  activo: boolean;
  ruta_miniatura_minio: string;
  minio_bucket: string;
  linea?: Point[];      // Agregado
  poligono?: Point[];   // Agregado
};

export type Point = {
  x: number;
  y: number;
};