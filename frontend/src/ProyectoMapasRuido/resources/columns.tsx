import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PMR } from './types';
import { Row } from '@tanstack/react-table';
import { faCircleCheck, faCircleXmark, faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('sv-SE').replace('T', ' ');
}

export const columns = (
    handleAskDelete: (id: number, nombre:string) => void,
    onEdit: (pmr: PMR) => void
) => [
    { accessorKey: 'id', header: 'ID' },
    {
        accessorKey: 'activo',
        header: 'Activo',
        cell: ({row}: {row: Row<PMR>}) => (
            <div className='d-flex justify-content-center'>
                <FontAwesomeIcon
                    fontSize={25}
                    color={row.original.activo ? "green" : "rgb(220, 53, 69)"}
                    icon={row.original.activo ? faCircleCheck : faCircleXmark}
                />
            </div>
        )
    },
    { accessorKey: 'nombre', header: 'Nombre' },
    { accessorKey: 'descripcion', header: 'Descripción' },
    {
        accessorKey: 'fecha_creacion',
        header: 'Fecha Creación',
        cell: ({row}: {row: Row<PMR>}) => (
            <>{formatDate(row.original.fecha_creacion)}</>
        )
    },
    { accessorKey: 'nombre_pais', header: 'País' },
    { accessorKey: 'nombre_ciudad', header: 'Ciudad' },
    { accessorKey: 'nombre_localidad', header: 'Localidad' },
    {
        header: 'Acciones',
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
