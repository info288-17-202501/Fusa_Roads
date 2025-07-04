// resources/columns.tsx
import { Proceso, obtenerEstadoActual, obtenerProgresoProceso, EstadoProceso, obtenerEstadoProceso } from './types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//iconos utilizados
import { faCheckCircle, faTimesCircle, faSpinner, faEye, faMap, faCircle, faClock, faPlay, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { Badge, ProgressBar } from 'react-bootstrap';

//asigna icono segun el flag de estado
const iconoEstado = (estados: Proceso["estados"], nombreEstado: string) => {
  const estado = estados.find(e => e.estado === nombreEstado);
  
  if (!estado) {
    return <FontAwesomeIcon icon={faCircle} className="text-secondary" title="No iniciado" />;
  }

  // Si tiene fecha_hora_ini pero no fecha_hora_fin (o está vacía), está en proceso
  if (estado.fecha_hora_ini && (!estado.fecha_hora_fin || estado.fecha_hora_fin === '')) {
    return <FontAwesomeIcon icon={faSpinner} className="text-warning" spin title="En proceso" />;
  }

  // Si tiene fecha_hora_fin y flag
  if (estado.fecha_hora_fin && estado.fecha_hora_fin !== '') {
    if (estado.flag === 'ok') {
      return <FontAwesomeIcon icon={faCheckCircle} className="text-success" title="Completado" />;
    } else if (estado.flag && estado.flag !== 'ok') {
      return <FontAwesomeIcon icon={faTimesCircle} className="text-danger" title="Error" />;
    }
  }

  return <FontAwesomeIcon icon={faCircle} className="text-secondary" title="En espera" />;
};

const getBadgeVariant = (estadoProceso: EstadoProceso): string => {
  switch (estadoProceso) {
    case EstadoProceso.COMPLETADO:
      return 'success';
    case EstadoProceso.EN_PROCESO:
      return 'warning';
    case EstadoProceso.ERROR:
      return 'danger';
    case EstadoProceso.EN_ESPERA:
    default:
      return 'secondary';
  }
};

const getEstadoIcon = (estadoProceso: EstadoProceso) => {
  switch (estadoProceso) {
    case EstadoProceso.COMPLETADO:
      return faCheckCircle;
    case EstadoProceso.EN_PROCESO:
      return faPlay;
    case EstadoProceso.ERROR:
      return faExclamationTriangle;
    case EstadoProceso.EN_ESPERA:
    default:
      return faClock;
  }
};



export const getColumns = (abrirModal: (proceso: Proceso) => void) => [
  {
    accessorKey: 'id',
    header: 'ID'
  },
  {
    accessorKey: 'pia_id',
    header: 'PIA ID'
  },
  {
    accessorKey: 'fecha_inicio',
    header: 'Fecha Inicio',
    cell: ({ row }: any) => {
      const fecha = new Date(row.original.fecha_inicio);
      return fecha.toLocaleString('es-ES');
    }
  },
  {
    header: 'Estado General',
    cell: ({ row }: any) => {
      const proceso: Proceso = row.original;
      const estadoProceso = obtenerEstadoProceso(proceso);
      const estadoActual = obtenerEstadoActual(proceso);
      const badgeVariant = getBadgeVariant(estadoProceso);
      const icon = getEstadoIcon(estadoProceso);

      return (
        <Badge bg={badgeVariant} className="d-flex align-items-center gap-1">
          <FontAwesomeIcon icon={icon} />
          {estadoActual}
        </Badge>
      );
    }
  },
  {
    header: 'Progreso',
    cell: ({ row }: any) => {
      const proceso: Proceso = row.original;
      const progreso = obtenerProgresoProceso(proceso);
      
      // Si hay un estado con avance (como video), mostrarlo
      const estadoConAvance = proceso.estados.find(estado => estado.avance);
      
      if (estadoConAvance && obtenerEstadoProceso(proceso) === EstadoProceso.EN_PROCESO) {
        const avance = estadoConAvance.avance!;
        const porcentajeAvance = Math.round((avance.actual / avance.total) * 100);
        
        return (
          <div>
            <ProgressBar 
              now={porcentajeAvance} 
              label={`${porcentajeAvance}%`}
              variant="info"
              style={{ height: '20px' }}
            />
            <small className="text-muted">
              {estadoConAvance.estado}: {avance.actual}/{avance.total}
            </small>
          </div>
        );
      }
      
      return (
        <div>
          <ProgressBar 
            now={progreso.porcentaje} 
            label={`${progreso.porcentaje}%`}
            variant={progreso.porcentaje === 100 ? 'success' : 'primary'}
            style={{ height: '20px' }}
          />
          <small className="text-muted">
            {progreso.actual}/{progreso.total} estados
          </small>
        </div>
      );
    }
  },
  {
    header: 'Inicio',
    cell: ({ row }: any) => iconoEstado(row.original.estados, 'inicio')
  },
  {
    header: 'Preproceso',
    cell: ({ row }: any) => iconoEstado(row.original.estados, 'preproceso')
  },
  {
    header: 'Video',
    cell: ({ row }: any) => iconoEstado(row.original.estados, 'video')
  },
  {
    header: 'Audio',
    cell: ({ row }: any) => iconoEstado(row.original.estados, 'audio')
  },
  {
    header: 'Integrado',
    cell: ({ row }: any) => iconoEstado(row.original.estados, 'integrado')
  },
  {
    header: 'Detalle',
    cell: ({ row }: any) => {
      const proceso: Proceso = row.original;
      const estadoProceso = obtenerEstadoProceso(proceso);

      //función para mostrar el boton mapas de ruido si se completó correctamente todo el proceso
      if (estadoProceso === EstadoProceso.COMPLETADO) {
        return (
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => {
              // Funcionalidad de mapas de ruido pendiente
            }}
          >
            <FontAwesomeIcon icon={faMap} /> Mapas de ruido
          </button>
        );
      } else {
        return (
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={() => abrirModal(proceso)}
          >
            <FontAwesomeIcon icon={faEye} /> Ver detalle
          </button>
        );
      }
    }
  }
];
