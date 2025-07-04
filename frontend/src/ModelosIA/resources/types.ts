//types.tsx
//actualizado para que corresponda con el backend
export type ModeloIA = {
  id_modelo: number;
  nomb_modelo: string;
  tipo_modelo: 'a' | 'v';    // audio | video
  flag_vigente: 'S' | 'N';  //Si | No
  ruta: string;
  descripcion: string;
  _id?: string;             // solo si viene desde MongoDB
};