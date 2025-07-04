export type ProyectoIA = {
  _id: number
  id: number;
  nombre_proyecto: string;
  lista_videos: Video[];
  modelo_video: string;
  modelo_audio: string;

  listaVideos?: Video[];
  
  flag_videos_salida: boolean;
  path_videos_salida?: string;
  bucket_video_salida?: string;

  flag_ventanas_tiempo: boolean;
  cantidad_ventanas?: number;
  unidad_tiempo_ventanas?: string;
};

export type Video = {
  _id: number;
  name: string;
  activo: boolean;
  ruta_miniatura_minio: string;
  minio_bucket: string;
  linea?: Point[]; // Agregado
  poligono?: Point[]; // Agregado
};

export type Point = {
  x: number;
  y: number;
};
