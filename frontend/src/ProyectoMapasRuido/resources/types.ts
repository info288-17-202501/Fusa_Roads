export type PMR = {
    id: number;
    nombre: string;
    descripcion: string;
    fecha_creacion: string;
    id_localidad: number;
};

export type Pais = {
    id: number;
    nombre: string;
};

export type Ciudad = {
    id: number;
    nombre: string;
    id_pais: number;
};

export type Localidad = {
    id: number;
    nombre: string;
    id_ciudad: number;
    flg_vigencia: string;
};

export interface PiaVideo {
  id: number;
  id_pia: number;
  id_video: number;
  nombre_json: string;
  duracion: number;
  timestamp_inicio: string;
  codigo_video: string;
  fecha_grabacion: string;
  tipo_via_nombre: string;
}