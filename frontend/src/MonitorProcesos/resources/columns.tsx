// resources/columns.tsx
import { Proceso } from './types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//iconos utilizados
import { faCheckCircle, faTimesCircle, faSpinner, faEye, faMap, faCircle } from '@fortawesome/free-solid-svg-icons';


//asigna icono segun el flag de estado
const iconoEstado = (estados: Proceso["estados"], nombreEstado: string) => {
  const estado = estados.find(e => e.estado === nombreEstado);
  if (!estado) return <FontAwesomeIcon icon={faSpinner} className="text-secondary" />;

  if (estado.flag === 'ok') {
    return <FontAwesomeIcon icon={faCheckCircle} className="text-success" />;
  } else if (estado.flag === 'error') {
    return <FontAwesomeIcon icon={faTimesCircle} className="text-danger" />;
  } else {
    return <FontAwesomeIcon icon={faCircle} className="text-secondary" />;
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
  header: 'Inicio',
  cell: ({ row }: any) => iconoEstado(row.original.estados, 'inicio')
},
{
  header: 'Preproceso',
  cell: ({ row }: any) => iconoEstado(row.original.estados, 'preproceso')
},
{
  header: 'Audio',
  cell: ({ row }: any) => iconoEstado(row.original.estados, 'audio')
},
{
  header: 'Video',
  cell: ({ row }: any) => iconoEstado(row.original.estados, 'video')
},
{
  header: 'Integrado',
  cell: ({ row }: any) => iconoEstado(row.original.estados, 'integrado')
},
  {
  header: 'Detalle',
  cell: ({ row }: any) => {
    const proceso: Proceso = row.original;

    //función para mostrar el boton mapas de ruido si se completó correctamente todo el proceso
    const todosOk = proceso.estados.every(
      (estado) => estado.flag === 'ok' && estado.fecha_hora_fin
    );

    if (todosOk) {
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
