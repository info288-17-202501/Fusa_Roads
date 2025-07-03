export type ProyectoIA = {
  _id: number;
  id: number;
  nombre_proyecto: string;
  modelo_video: string;
  modelo_audio: string;
  lista_videos: Video[];

  flag_videos_salida?: boolean;
  path_videos_salida?: string;
  bucket_videos_salida?: string;

  flag_ventanas_tiempo?: boolean;
  cant_ventanas?: number;
  unidad_tiempo_ventanas?: string;
};

export type Video = {
  _id: number;
  name: string;
  activo: boolean;
  ruta_miniatura_minio: string;
  minio_bucket: string;
  linea?: Point[];
  poligono?: Point[]; 
};

export type Point = {
  x: number;
  y: number;
};
