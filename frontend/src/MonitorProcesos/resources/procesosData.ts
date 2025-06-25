// resources/procesosData.ts
import { Proceso } from "./types";

export const procesosData: Proceso[] = [
  // 1. Proceso totalmente finalizado correctamente
  {
    id: 1,
    nombre: 'proceso1',
    estados: [
      { estado: 'creado', orden: 1, fecha_hora_ini: '2025-06-01T10:00:00', fecha_hora_fin: '2025-06-01T10:01:00', flag: 'ok' },
      { estado: 'iniciado', orden: 2, fecha_hora_ini: '2025-06-01T10:02:00', fecha_hora_fin: '2025-06-01T10:03:00', flag: 'ok' },
      { estado: 'audio', orden: 3, fecha_hora_ini: '2025-06-01T10:04:00', fecha_hora_fin: '2025-06-01T10:05:00', flag: 'ok' },
      { estado: 'video', orden: 4, fecha_hora_ini: '2025-06-01T10:06:00', fecha_hora_fin: '2025-06-01T10:10:00', flag: 'ok' },
      { estado: 'integrado', orden: 5, fecha_hora_ini: '2025-06-01T10:11:00', fecha_hora_fin: '2025-06-01T10:12:00', flag: 'ok' }
    ]
  },

  // 2. En ejecución en etapa video (con avance)
  {
    id: 2,
    nombre: 'proceso2',
    estados: [
      { estado: 'creado', orden: 1, fecha_hora_ini: '2025-06-02T09:00:00', fecha_hora_fin: '2025-06-02T09:01:00', flag: 'ok' },
      { estado: 'iniciado', orden: 2, fecha_hora_ini: '2025-06-02T09:10:00', fecha_hora_fin: '2025-06-02T09:11:00', flag: 'ok' },
      { estado: 'audio', orden: 3, fecha_hora_ini: '2025-06-02T09:12:00', fecha_hora_fin: '2025-06-02T09:20:00', flag: 'ok' },
      {
        estado: 'video',
        orden: 4,
        fecha_hora_ini: '2025-06-02T09:21:00',
        flag: '',
        avance: {
          actual: '34',
          total: '100'
        }
      },
      { estado: 'integrado', orden: 5 }
    ]
  },

  // 3. En ejecución sin avance
  {
    id: 3,
    nombre: 'proceso3',
    estados: [
      { estado: 'creado', orden: 1, fecha_hora_ini: '2025-06-03T08:00:00', fecha_hora_fin: '2025-06-03T08:01:00', flag: 'ok' },
      { estado: 'iniciado', orden: 2, fecha_hora_ini: '2025-06-03T08:15:00', fecha_hora_fin: '2025-06-03T08:16:00', flag: 'ok' },
      { estado: 'audio', orden: 3, fecha_hora_ini: '2025-06-03T08:30:00', fecha_hora_fin: '2025-06-03T08:40:00', flag: 'ok' },
      { estado: 'video', orden: 4, fecha_hora_ini: '2025-06-03T08:41:00', flag: '' },
      { estado: 'integrado', orden: 5 }
    ]
  },

  // 4. Error en etapa audio
  {
    id: 4,
    nombre: 'proceso4',
    estados: [
      { estado: 'creado', orden: 1, fecha_hora_ini: '2025-06-04T09:00:00', fecha_hora_fin: '2025-06-04T09:01:00', flag: 'ok' },
      { estado: 'iniciado', orden: 2, fecha_hora_ini: '2025-06-04T09:02:00', fecha_hora_fin: '2025-06-04T09:03:00', flag: 'ok' },
      {
        estado: 'audio',
        orden: 3,
        fecha_hora_ini: '2025-06-04T09:04:00',
        fecha_hora_fin: '2025-06-04T09:05:00',
        flag: 'error',
        descrip: 'Error al cargar el archivo de audio.'
      },
      { estado: 'video', orden: 4 },
      { estado: 'integrado', orden: 5 }
    ]
  },

  // 5. Error en etapa integrado, ejecución previa exitosa
  {
    id: 5,
    nombre: 'proceso5',
    estados: [
      { estado: 'creado', orden: 1, fecha_hora_ini: '2025-06-05T08:00:00', fecha_hora_fin: '2025-06-05T08:01:00', flag: 'ok' },
      { estado: 'iniciado', orden: 2, fecha_hora_ini: '2025-06-05T08:02:00', fecha_hora_fin: '2025-06-05T08:03:00', flag: 'ok' },
      { estado: 'audio', orden: 3, fecha_hora_ini: '2025-06-05T08:04:00', fecha_hora_fin: '2025-06-05T08:05:00', flag: 'ok' },
      { estado: 'video', orden: 4, fecha_hora_ini: '2025-06-05T08:06:00', fecha_hora_fin: '2025-06-05T08:07:00', flag: 'ok' },
      {
        estado: 'integrado',
        orden: 5,
        fecha_hora_ini: '2025-06-05T08:08:00',
        fecha_hora_fin: '2025-06-05T08:09:00',
        flag: 'error',
        descrip: 'Falló la consolidación de resultados.'
      }
    ]
  },

  // 6. Etapas mezcladas: iniciado en ejecución, video con error
  {
    id: 6,
    nombre: 'proceso6',
    estados: [
      { estado: 'creado', orden: 1, fecha_hora_ini: '2025-06-06T07:00:00', fecha_hora_fin: '2025-06-06T07:01:00', flag: 'ok' },
      { estado: 'iniciado', orden: 2, fecha_hora_ini: '2025-06-06T07:02:00', flag: '' },
      { estado: 'audio', orden: 3 },
      {
        estado: 'video',
        orden: 4,
        fecha_hora_ini: '2025-06-06T07:04:00',
        fecha_hora_fin: '2025-06-06T07:05:00',
        flag: 'error',
        descrip: 'Error al procesar el frame 230.'
      },
      { estado: 'integrado', orden: 5 }
    ]
  }
];
