import { ModeloIA } from './types';
import { CellContext, Row } from '@tanstack/react-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';

// Tipo extendido para cumplir con el requerimiento de tener un campo `id` en la tabla
type ModeloIAWithId = ModeloIA & { id: number };

export const columns = (
  handleAskDelete: (id_modelo: number, nombre: string, mongoId: string) => void,
  onEdit: (modelo: ModeloIAWithId) => void
) => [
  { accessorKey: 'id_modelo', header: 'ID' },
  { accessorKey: 'nomb_modelo', header: 'Nombre' },
  {
    accessorKey: 'tipo_modelo',
    header: 'Tipo',
    cell: (cell: CellContext<ModeloIAWithId, unknown>) => {
      const value = cell.getValue() as 'a' | 'v';
      return value === 'a' ? 'Audio' : 'Video';
    },
  },
  { accessorKey: 'ruta', header: 'Ruta' },
  { accessorKey: 'descripcion', header: 'Descripción' },
  {
    header: 'Acciones',
    cell: ({ row }: { row: Row<ModeloIAWithId> }) => {
      const { id_modelo, nomb_modelo, _id } = row.original;
      return (
        <div className="d-flex gap-2">
          <button
            type="button"
            className="bg-primary px-2 py-1 rounded border-0"
            title="Editar"
            onClick={() => onEdit(row.original)}
          >
            <FontAwesomeIcon icon={faPenToSquare} color="white" />
          </button>
          <button
            type="button"
            className="bg-danger px-2 py-1 rounded border-0"
            title="Eliminar"
            onClick={() => {
              if (_id) {
                handleAskDelete(id_modelo, nomb_modelo, _id);
              } else {
                alert('No se puede eliminar: ID de Mongo no disponible.');
              }
            }}
          >
            <FontAwesomeIcon icon={faTrashCan} color="white" />
          </button>
        </div>
      );
    },
  },
];
