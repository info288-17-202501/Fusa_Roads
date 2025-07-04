//types.tsx
//actualizado para que corresponda con el backend
export type Modelo = {
  _id?: string;                    // ID de Mongo
  id_modelo: number;              
  nomb_modelo: string;            
  tipo_modelo: 'a' | 'v';         // audio | video
  flag_vigente: 'S' | 'N';        // 'vigente | no vigente
  ruta: string;                   // Ruta minIO
  descripcion: string;          
};

// Tipo para la tabla que incluye la propiedad id requerida
export type ModeloParaTabla = Modelo & { id: number };