// columnsProyecto.ts
import { ProyectoIA } from './types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrashCan, faCirclePlay } from '@fortawesome/free-solid-svg-icons';
import { Row } from '@tanstack/react-table';

export const columns = (
  handleAskDelete: (id: number, nombre: string) => void,
  onEdit: (proyecto: ProyectoIA) => void,
  onProcess: (proyecto: ProyectoIA) => void
) => [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'nombre', header: 'Nombre' },
  { accessorKey: 'videoSalida', header: 'Video Salida' },
  { accessorKey: 'ventanasTiempo', header: 'Ventanas de Tiempo' },
  { accessorKey: 'mVideo', header: 'Modelo Video' },
  { accessorKey: 'mAudio', header: 'Modelo Audio' },
  {
    header: 'Acciones',
    cell: ({ row }: { row: Row<ProyectoIA> }) => (
      <div className='d-flex gap-2'>
        <button
          className='bg-primary px-2 py-1 rounded border-0'
          title='Editar'
          onClick={() => onEdit(row.original)}
        >
          <FontAwesomeIcon color='white' icon={faPenToSquare} />
        </button>
        <button
          className='bg-danger px-2 py-1 rounded border-0'
          title='Eliminar'
          onClick={() => handleAskDelete(row.original.id, row.original.nombre)}
        >
          <FontAwesomeIcon color='white' icon={faTrashCan} />
        </button>

        <button
          className='bg-success px-2 py-1 rounded border-0'
          title='Procesar'
          onClick={() => onProcess(row.original)}
        >
          <FontAwesomeIcon color='white' icon={faCirclePlay} />
        </button>
      </div>
    ),
  },
];
