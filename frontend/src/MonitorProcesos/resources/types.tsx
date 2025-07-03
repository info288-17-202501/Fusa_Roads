// resources/types.ts

// del proceso, si hubo error se incluye descrip con los detalles, para video se usa el atributo avance
export type Estado = {
  estado: string;
  orden: number;
  fecha_hora_ini?: string;
  fecha_hora_fin?: string;
  descrip: string;
  flag?: string;
  avance?: {
    actual: number;
    total: number;
  };
};


export type Proceso = {
  _id: string;
  pia_id: string;
  fecha_inicio: string;
  estados: Estado[];
};
