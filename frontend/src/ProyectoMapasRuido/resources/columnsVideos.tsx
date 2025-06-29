import { Row } from '@tanstack/react-table';
import { Form } from 'react-bootstrap';
import { PiaVideo } from './types';

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('sv-SE').replace('T', ' ');
}

function formatDuration(seconds: number): string {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    const padded = (n: number) => n.toString().padStart(2, '0');

    return `${padded(hrs)}:${padded(mins)}:${padded(secs)}`;
}


export const columnsVideos = (
    selectedIds: number[],
    toggleId: (id: number) => void
) => [
    { accessorKey: 'codigo_video', header: 'Código Video' },
    {
        accessorKey: 'fecha_grabacion',
        header: 'Fecha Grabación',
        cell: ({row}: {row: Row<PiaVideo>}) => (
            <>{formatDate(row.original.fecha_grabacion)}</>
        )
    },
    { 
        accessorKey: 'timestamp_inicio',
        header: 'Fecha Procesamiento',
        cell: ({row}: {row: Row<PiaVideo>}) => (
            <>{formatDate(row.original.timestamp_inicio)}</>
        )
    },
    { accessorKey: 'tipo_via_nombre', header: 'Tipo de Vía' },
    { accessorKey: 'nombre_json', header: 'Archivo JSON' },
    {
        accessorKey: 'duracion',
        header: 'Duración',
        cell: ({row}: {row: Row<PiaVideo>}) => (
            <>{formatDuration(row.original.duracion)}</>
        )
    },
    {
        header: 'Seleccionado',
        cell: ({ row }: { row: Row<PiaVideo> }) => (
            <div className="d-flex justify-content-center">
                <Form.Check
                    style={{ transform: 'scale(1.5)', accentColor: '#007bff' }}
                    checked={selectedIds.includes(row.original.id)}
                    onChange={
                        () => toggleId(row.original.id)
                    }
                />
            </div>
        ),
    },
];
