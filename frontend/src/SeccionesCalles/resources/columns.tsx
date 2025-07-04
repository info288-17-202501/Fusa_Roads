import { CalleExtendida } from './types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { Row } from '@tanstack/react-table';

export const columns = (
    handleAskDelete: (id: number, nombre:string) => void,
    onEdit: (calle: CalleExtendida) => void
) => [
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'nombre_pais', header: 'País' },
    { accessorKey: 'nombre_ciudad', header: 'Ciudad' },
    { accessorKey: 'nombre_localidad', header: 'Localidad' },
    { accessorKey: 'nombre_calle_localidad', header: 'Nombre Calle' },
    { accessorKey: 'nombre_seccion_calle', header: 'Sección' },
    { accessorKey: 'nombre_tipo_via', header: 'Tipo Vía' },
    {
        header: 'Acciones',
        cell: ({ row }: { row: Row<CalleExtendida> }) => (
            <div className='d-flex gap-2'>
                <button className='bg-primary px-2 py-1 rounded border-0' onClick={() => onEdit(row.original)}>
                    <FontAwesomeIcon color='white' icon={faPenToSquare} />
                </button>
                <button className='bg-danger px-2 py-1 rounded border-0' onClick={() => handleAskDelete(row.original.id, row.original.nombre_calle_localidad + " " + row.original.nombre_seccion_calle)}>
                    <FontAwesomeIcon color='white' icon={faTrashCan} />
                </button>
            </div>
        ),
    },
];
