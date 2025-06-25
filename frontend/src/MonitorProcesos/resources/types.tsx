//codigo original
/*
 //   export type ProcesoProyecto = {
 //   id: number;
 //   nombre: string;
    estado: {
        creado: boolean;
        iniciado: boolean;
        audioIA: boolean;
        videoIA: boolean;
        integrado: boolean;
    };
    };

*/

//tipos segun el backend

// resources/types.ts
export type Estado = {
  estado: string;
  orden: number;
  fecha_hora_ini?: string;
  fecha_hora_fin?: string;
  descrip?: string;
  flag?: string;
  avance?: {
    actual: string;
    total: string;
  };
};


export type Proceso = {
  id: number;
  nombre: string;
  estados: Estado[];
};
