import { Modelo } from './types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { Row, CellContext, ColumnDef } from '@tanstack/react-table';

// Tipo para la tabla que incluye la propiedad id requerida
type ModeloParaTabla = Modelo & { id: number };

export const columns = (
  handleAskDelete: (id_modelo: number, nombre: string) => void,
  onEdit: (modelo: Modelo) => void
): ColumnDef<ModeloParaTabla>[] => [
  {
    accessorKey: 'id_modelo',
    header: 'ID'
  },
  {
    accessorKey: 'nomb_modelo',
    header: 'Nombre'
  },
  {
    accessorKey: 'tipo_modelo',
    header: 'Tipo',
    cell: (info: CellContext<ModeloParaTabla, 'a' | 'v'>) => {
      const tipo = info.getValue();
      return tipo === 'a' ? 'Audio' : 'Video';
    }
  },
  {
    accessorKey: 'ruta',
    header: 'Ruta'
  },
  {
    accessorKey: 'descripcion',
    header: 'Descripción'
  },
  {
    header: 'Acciones',
    cell: ({ row }: CellContext<ModeloParaTabla, unknown>) => (
      <div className="d-flex gap-2">
        <button
          className="bg-primary px-2 py-1 rounded border-0"
          title="Editar"
          onClick={() => onEdit(row.original)}
        >
          <FontAwesomeIcon color="white" icon={faPenToSquare} />
        </button>
        <button
          className="bg-danger px-2 py-1 rounded border-0"
          title="Eliminar"
          onClick={() =>
            handleAskDelete(row.original.id_modelo, row.original.nomb_modelo)
          }
        >
          <FontAwesomeIcon color="white" icon={faTrashCan} />
        </button>
      </div>
    )
  }
];