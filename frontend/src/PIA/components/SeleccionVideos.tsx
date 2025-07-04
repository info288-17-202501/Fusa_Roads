//SeleccionVideos.tsx
//Vista del modal con la lista para seleccionar videos
//TODO que deje guardar solo si se han seleccionado lineas en todos los videos

import { Button, Table } from 'react-bootstrap';
import { Video } from '../resources/types';

type Props = {
	videos: Video[];
	onToggleActivo: (id: number) => void;
	onLineaClick: (video: Video) => void;
	onBack: () => void;
};

export default function SeleccionVideos({videos, onToggleActivo, onLineaClick, onBack }: Props) {
	// Verificar si hay al menos un video activo(seleccionado)
	const hayVideosActivos = videos.some(video => video.activo);

	return (
		<div>
			<Table bordered hover responsive>
				<thead>
					<tr>
						<th>ID</th>
						<th>Nombre</th>
						<th>Acción</th>
					</tr>
				</thead>
				<tbody>
					{videos.map((video) => (
						<tr key={video._id} className={video.activo ? 'table-success' : ''}>
							<td>{video._id}</td>
							<td>{video.name}</td>
							<td className="d-flex gap-2">
								<Button
									size="sm"
									variant={video.activo ? 'success' : 'secondary'}
									onClick={() => onToggleActivo(video._id)}
									title={video.activo ? 'Desactivar video' : 'Activar video'}
								>
									{video.activo ? '✔' : '✕'}
								</Button>
								<Button
									size="sm"
									variant="primary"
									onClick={() => onLineaClick(video)}
									disabled={!video.activo} // Deshabilitar si el video no esta seleccionado
									title={!video.activo ? 'Video no seleccionado' : 'Editar líneas del video'}
								>
									líneas
								</Button>
							</td>
						</tr>
					))}
				</tbody>
			</Table>

			<div className="d-flex justify-content-between mt-3">
				<Button variant="secondary" onClick={onBack}>
					Volver
				</Button>
				<Button
					variant="primary"
					onClick={onBack}
					disabled={!hayVideosActivos} // Deshabilitar si no hay videos seleccionados
					title={!hayVideosActivos ? 'Seleccione al menos un video para continuar' : 'Guardar selección'}
				>
					Guardar selección
				</Button>
			</div>

			{!hayVideosActivos && (
				<div className="text-danger mt-2 text-center">
					Seleccione al menos un video para poder continuar
				</div>
			)}
		</div>
	);
}