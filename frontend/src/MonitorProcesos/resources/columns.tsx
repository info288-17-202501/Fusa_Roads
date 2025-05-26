import { ProcesoProyecto } from './types';
import { Row }  from '@tanstack/react-table';

export const columns = [
    { accessorKey: 'id',        header: 'ID' },
    { accessorKey: 'nombre',    header: 'Nombre' },

    // Acceso manual a propiedades anidadas del estado
    {
        header: 'Creado',
        accessorFn: (row: ProcesoProyecto) => row.estado.creado ? '✅' : '❌'
    },
    {
        header: 'Iniciado',
        accessorFn: (row: ProcesoProyecto) => row.estado.iniciado ? '✅' : '❌'
    },
    {
        header: 'Audio-IA',
        accessorFn: (row: ProcesoProyecto) => row.estado.audioIA ? '✅' : '❌'
    },
    {
        header: 'Video-IA',
        accessorFn: (row: ProcesoProyecto) => row.estado.videoIA ? '✅' : '❌'
    },
    {
        header: 'Integrado',
        accessorFn: (row: ProcesoProyecto) => row.estado.integrado ? '✅' : '❌'
    },

    // Botones de acción
    {
    header: 'Detalle',
    cell: ({ row }: { row: Row<ProcesoProyecto> }) => (
        <div className="d-flex gap-2">
            <button className="btn btn-success px-3 py-1 rounded">
                Mapa de ruido
            </button>
            <button className="btn btn-danger px-3 py-1 rounded">
                Ver detalle
            </button>
        </div>
    )
}
];
