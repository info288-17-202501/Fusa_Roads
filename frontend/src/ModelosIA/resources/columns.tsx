import { Modelo } from './types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { Row } from '@tanstack/react-table';


export const columns = (
    handleAskDelete: (id: number, nombre:string) => void,
    onEdit: (modelo: Modelo) => void 
) => [
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'nombre', header: 'Nombre' },
    { accessorKey: 'tipo', header: 'Tipo' },
    { accessorKey: 'ruta', header: 'Ruta' },
    { accessorKey: 'descripcion', header: 'Descripción' },
    {
        header: 'Acciones',
        cell: ({ row }: { row: Row<Modelo> }) => (
            <div className='d-flex gap-2'>
                <button className='bg-primary px-2 py-1 rounded border-0' title='Edit' onClick={() => onEdit(row.original)}>
                    <FontAwesomeIcon color='white' icon={faPenToSquare} />
                </button>
                <button className='bg-danger px-2 py-1 rounded border-0' title='Delete' onClick={() => handleAskDelete(row.original.id, row.original.nombre)}>
                    <FontAwesomeIcon color='white' icon={faTrashCan} />
                </button>
            </div>
        ),
    },
];
