import { Row } from '@tanstack/react-table';
import { Form } from 'react-bootstrap';

type Video = {
  id: number;
  nombre: string;
  fecha: string;
};

export const columnsVideos = (
    selectedIds: number[],
    toggleId: (id: number) => void
) => [
    { accessorKey: 'nombre', header: 'Nombre' },
    { accessorKey: 'fecha', header: 'Fecha' },
    {
        header: 'Seleccionado',
        cell: ({ row }: { row: Row<Video> }) => (
            <div className="d-flex justify-content-center">
                <Form.Check
                    style={{ transform: 'scale(1.5)', accentColor: '#007bff' }}
                    checked={selectedIds.includes(row.original.id)}
                    onChange={() => toggleId(row.original.id)}
                />
            </div>
        ),
    },
];
