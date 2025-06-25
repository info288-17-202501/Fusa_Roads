// utils/procesoUtils.ts
import { Estado } from '../resources/types';

export const tieneInicio = (estados: Estado[], nombre: string): boolean => {
  const match = estados.find(e => e.estado === nombre);
  return !!match?.fecha_hora_ini;
};