import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faCheckCircle,
	faTimesCircle,
	faTrashCan,
	faPenToSquare,
	faCirclePlay,
} from '@fortawesome/free-solid-svg-icons';
import { Row } from '@tanstack/react-table';
import { ProyectoIA } from './types';


export const columns = (
	handleAskDelete: (id: number, nombre: string) => void,
	onEdit: (proyecto: ProyectoIA) => void,
	onProcess: (proyecto: ProyectoIA) => void
) => [
		{ accessorKey: 'id', header: 'ID' },
		{ accessorKey: 'nombre_proyecto', header: 'Nombre' },

		{
			header: 'Video Salida',
			accessorKey: 'videoSalida',
			cell: ({ row }: { row: Row<ProyectoIA> }) => (
				<FontAwesomeIcon
					icon={row.original.flag_videos_salida ? faCheckCircle : faTimesCircle}
					className={row.original.flag_videos_salida ? 'text-success' : 'text-danger'}
				/>
			),
		},

		{
			header: 'Ventanas de Tiempo',
			accessorKey: 'ventanasTiempo',
			cell: ({ row }: { row: Row<ProyectoIA> }) => (
				<FontAwesomeIcon
					icon={row.original.flag_ventanas_tiempo ? faCheckCircle : faTimesCircle}
					className={row.original.flag_ventanas_tiempo ? 'text-success' : 'text-danger'}
				/>
			),
		},

		{ accessorKey: 'modelo_video', header: 'Modelo Video' },
		{ accessorKey: 'modelo_audio', header: 'Modelo Audio' },

		{
			header: 'Acciones',
			cell: ({ row }: { row: Row<ProyectoIA> }) => (
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
						onClick={() => handleAskDelete(row.original.id, row.original.nombre_proyecto)}
					>
						<FontAwesomeIcon color="white" icon={faTrashCan} />
					</button>
					<button
						className="bg-success px-2 py-1 rounded border-0"
						title="Procesar"
						onClick={() => onProcess(row.original)}
					>
						<FontAwesomeIcon color="white" icon={faCirclePlay} />
					</button>
				</div>
			),
		},
	];