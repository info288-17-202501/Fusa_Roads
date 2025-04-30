import { Calle } from './types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { Row } from '@tanstack/react-table';

const handleEdit = (calle: Calle) => {
    alert(`Editar calle: ${calle.nombre}`);
};

const handleDelete = (id: number) => {
    alert(`Eliminar calle con ID: ${id}`);
};

export const columns = [
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'pais', header: 'País' },
    { accessorKey: 'region', header: 'Región' },
    { accessorKey: 'comuna', header: 'Comuna' },
    { accessorKey: 'nombre', header: 'Nombre' },
    { accessorKey: 'app', header: 'App' },
    { accessorKey: 'tipo_via', header: 'Tipo Vía' },
    {
        header: 'Acciones',
        cell: ({ row }: { row: Row<Calle> }) => (
            <div className='d-flex gap-2'>
                <button className='bg-primary px-2 py-1 rounded border-0' onClick={() => handleEdit(row.original)}>
                    <FontAwesomeIcon color='white' icon={faPenToSquare} />
                </button>
                <button className='bg-danger px-2 py-1 rounded border-0' onClick={() => handleDelete(row.original.id)}>
                    <FontAwesomeIcon color='white' icon={faTrashCan} />
                </button>
            </div>
        ),
    },
];
