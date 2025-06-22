import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PMR } from './types';
import { Row } from '@tanstack/react-table';
import { faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';


export const columns = (
    handleAskDelete: (id: number, nombre:string) => void,
    onEdit: (pmr: PMR) => void
) => [
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'nombre', header: 'Nombre' },
    { accessorKey: 'descripcion', header: 'Descripción' },
    {
        header: 'Seleccionado',
        cell: ({ row }: { row: Row<PMR> }) => (
            <div className='d-flex gap-2'>
                <button className='bg-primary px-2 py-1 rounded border-0' onClick={() => onEdit(row.original)}>
                    <FontAwesomeIcon color='white' icon={faPenToSquare} />
                </button>
                <button className='bg-danger px-2 py-1 rounded border-0' onClick={() => handleAskDelete(row.original.id, row.original.nombre)}>
                    <FontAwesomeIcon color='white' icon={faTrashCan} />
                </button>
            </div>
        ),
    },
];
