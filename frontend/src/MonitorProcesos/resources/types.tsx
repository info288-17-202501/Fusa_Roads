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
  fecha_fin?: string;
  estados: Estado[];
};

// Enum para los estados del proceso
export enum EstadoProceso {
  EN_ESPERA = 'en_espera',
  EN_PROCESO = 'en_proceso', 
  COMPLETADO = 'completado',
  ERROR = 'error'
}

// Función para determinar el estado general del proceso
export const obtenerEstadoProceso = (proceso: Proceso): EstadoProceso => {
  if (!proceso.estados || proceso.estados.length === 0) {
    return EstadoProceso.EN_ESPERA;
  }

  // Verificar si hay algún estado con error
  const estadoConError = proceso.estados.find(estado => 
    estado.flag && estado.flag !== 'ok'
  );
  if (estadoConError) {
    return EstadoProceso.ERROR;
  }

  // Buscar el último estado con fecha_hora_ini
  const estadosConInicio = proceso.estados.filter(estado => estado.fecha_hora_ini);
  if (estadosConInicio.length === 0) {
    return EstadoProceso.EN_ESPERA;
  }

  // Ordenar por orden para obtener el último estado iniciado
  const ultimoEstadoIniciado = estadosConInicio
    .sort((a, b) => a.orden - b.orden)
    .pop();

  if (!ultimoEstadoIniciado) {
    return EstadoProceso.EN_ESPERA;
  }

  // Si tiene fecha_fin vacía o null, está en proceso
  if (!ultimoEstadoIniciado.fecha_hora_fin || ultimoEstadoIniciado.fecha_hora_fin === '') {
    return EstadoProceso.EN_PROCESO;
  }

  // Si todos los estados esperados están completados, el proceso está completo
  // Asumiendo que hay 5 estados: inicio, preproceso, video, audio, integrado
  const estadosCompletados = proceso.estados.filter(estado => 
    estado.fecha_hora_fin && estado.fecha_hora_fin !== ''
  );

  if (estadosCompletados.length >= 5) {
    return EstadoProceso.COMPLETADO;
  }

  return EstadoProceso.EN_PROCESO;
};

// Función para obtener el estado actual en el que se encuentra el proceso
export const obtenerEstadoActual = (proceso: Proceso): string => {
  const estadoProceso = obtenerEstadoProceso(proceso);
  
  if (estadoProceso === EstadoProceso.EN_ESPERA) {
    return 'En espera';
  }

  if (estadoProceso === EstadoProceso.ERROR) {
    const estadoConError = proceso.estados.find(estado => 
      estado.flag && estado.flag !== 'ok'
    );
    return `Error en: ${estadoConError?.estado || 'desconocido'}`;
  }

  if (estadoProceso === EstadoProceso.COMPLETADO) {
    return 'Completado';
  }

  // EN_PROCESO: encontrar el último estado iniciado pero no terminado
  const estadoEnProceso = proceso.estados.find(estado => 
    estado.fecha_hora_ini && (!estado.fecha_hora_fin || estado.fecha_hora_fin === '')
  );

  return estadoEnProceso ? `Procesando: ${estadoEnProceso.estado}` : 'En proceso';
};

// Función para obtener el progreso general del proceso
export const obtenerProgresoProceso = (proceso: Proceso): { actual: number, total: number, porcentaje: number } => {
  const totalEstados = 5; // inicio, preproceso, video, audio, integrado
  const estadosCompletados = proceso.estados.filter(estado => 
    estado.fecha_hora_fin && estado.fecha_hora_fin !== ''
  ).length;

  const porcentaje = Math.round((estadosCompletados / totalEstados) * 100);

  return {
    actual: estadosCompletados,
    total: totalEstados,
    porcentaje
  };
};
