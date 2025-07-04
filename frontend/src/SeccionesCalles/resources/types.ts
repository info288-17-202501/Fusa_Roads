export type Calle = {
    id: number;
    pais: string;
    region: string;
    comuna: string;
    nombre: string;
    app: string;
    // app: 'CadnaA' | 'NoiseModelling';
    tipo_via: string;
};

export type CalleExtendida = {
    id: number;
    nombre_pais: string;
    nombre_ciudad: string;
    nombre_localidad: string;
    nombre_calle_localidad: string;
    nombre_seccion_calle: string;
    nombre_tipo_via: string;
    app: string;
}

export type Pais = {
    id: number;
    nombre: string;
};

export type Ciudad = {
    id: number;
    nombre: string;
    id_pais: number;
};

export type TipoVia = {
    id: number;
    nombre: string;
};