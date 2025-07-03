//ModalNuevoPoryecto.tsx
//MOdal para añadir/editar PIA
//TODO añadir verificaciones (que la lista de videos no este vacia por ej) 
//TODO conexion backend

import { useState, useEffect } from 'react';
import { Modal, Table, Button } from 'react-bootstrap';
import FormProyecto from './FormProyecto';
import PuntosVideo from './puntosVideo'; //vista para seleccionar puntos
import { ProyectoIA, Video } from '../resources/types';

type Props = {
	show: boolean;
	onClose: () => void;
	onSave: (proyecto: ProyectoIA) => void;
	initialValues?: ProyectoIA;
};

export default function ModalNuevoProyecto({ show, onClose, onSave, initialValues }: Props) {

	const [videos, setVideos] = useState<any[]>([]);	// Videos en mongo
	const [loading, setLoading] = useState(true);

	const hayVideosActivos = videos.some(video => video.activo);

	const [currentView, setCurrentView] = useState<'form' | 'videos' | 'puntos'>('form');
	const [videoSeleccionado, setVideoSeleccionado] = useState<Video | null>(null);
	const [proyectoData, setProyectoData] = useState<ProyectoIA>({
		id: 1,
		_id: 1,
		nombre_proyecto: '',
		modelo_video: '',
		modelo_audio: '',
		lista_videos: [],
		flag_videos_salida: false,
		flag_ventanas_tiempo: false,
		cantidad_ventanas: undefined,
		unidad_tiempo_ventanas: 'hora'
	});

	useEffect(() => {
		const fetchVideos = async () => {
			try {
				const res = await fetch('http://localhost:8002/mongo/datos', { method: 'GET' });
				const data = await res.json();

				const processedData = data.map((video: any) => ({
					_id: video._id,
					name: video.nombre_video,
					activo: false,
					ruta_miniatura_minio: video.ruta_miniatura_minio,
					minio_bucket: video.minio_bucket
				}));

				setVideos(processedData);
				setLoading(false);
			} catch (error) {
				console.error("Error cargando los videos:", error);
				setLoading(false);
			}
		};
		fetchVideos();
	}, []);

	// Resetear al formulario cuando se abre el modal
	useEffect(() => {
		if (show) {
			setCurrentView('form');
			if (initialValues) {
				setProyectoData(initialValues);
			} else {
				setProyectoData({
					id: 1,
					_id: 1,
					nombre_proyecto: '',
					modelo_video: 'yolo12s.pt',
					modelo_audio: 'Cnn14_DecisionLevelMax.pth',
					lista_videos: [],
					flag_videos_salida: false,
					flag_ventanas_tiempo: false,
					cantidad_ventanas: undefined,
					unidad_tiempo_ventanas: 'hora'
				});
			}
		}
	}, [show, initialValues]);

	const handleToggleActivo = (_id: number) => {
		setVideos(prev =>
			prev.map(v =>
				v._id === _id ? { ...v, activo: !v.activo } : v
			)
		);
	};

	const handleLineaClick = (video: Video) => {
		setVideoSeleccionado(video);
		setCurrentView('puntos');
	};

	const handleSaveProyecto = async (data: ProyectoIA) => {
		try {
			const { id, _id, listaVideos, ...rest } = data;
			const dataSinIds = {
				...rest,
				lista_videos: listaVideos
			};

			const res = await fetch("http://localhost:8005/parametros/", {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(dataSinIds)
			});

			if (!res.ok) throw new Error("Error en la respuesta del servidor");

			const result = await res.json();
			console.log("Proyecto guardado:", result);

			onSave({
				...data,
				_id: result._id, // opcional, si lo devuelve el backend
				id: result._id   // opcional, si lo usas como key en frontend
			});
		} catch (error) {
			console.error("Error al mandar los datos del PIA", error);
		}
	};

	const handleGuardarSeleccionVideos = () => {
		const videosSeleccionados = videos.filter(v => v.activo).map(v => v);
		setProyectoData(prev => ({
			...prev,
			listaVideos: videosSeleccionados // puedes cambiarlo según tu backend
		}));
		setCurrentView('form');
	};

	const renderView = () => {
		switch (currentView) {
			case 'videos':
				return (
					// De volver lista de videos
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
												onClick={() => handleToggleActivo(video._id)}
												title={video.activo ? 'Desactivar video' : 'Activar video'}
											>
												{video.activo ? '✔' : '✕'}
											</Button>
											<Button
												size="sm"
												variant="primary"
												onClick={() => handleLineaClick(video)}
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
							<Button variant="secondary" onClick={() => setCurrentView('form')}>
								Volver
							</Button>
							<Button
								variant="primary"
								disabled={!hayVideosActivos}
								title={!hayVideosActivos ? 'Seleccione al menos un video para continuar' : 'Guardar selección'}
								onClick={handleGuardarSeleccionVideos}
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
			case 'puntos':
				return (
					<PuntosVideo
						video={videoSeleccionado!}
						onGuardar={(videoActualizado) => {
							setVideos(prev =>
								prev.map(v => v._id === videoActualizado._id ? videoActualizado : v)
							);
							setCurrentView('videos');
						}}
						onVolver={() => setCurrentView('videos')}
					/>

				);
			default:
				return (
					<FormProyecto
						data={proyectoData}
						onSave={handleSaveProyecto}
						onCancel={onClose}
						onShowVideos={() => setCurrentView('videos')}
					/>
				);
		}
	};

	const getTitle = () => {
		switch (currentView) {
			case 'videos': return 'Selección de Videos';
			case 'puntos': return `Líneas para: ${videoSeleccionado?.name}`;
			default: return initialValues ? "Editar Proyecto" : "Nuevo Proyecto IA";
		}
	};

	return (
		<Modal show={show} onHide={onClose} centered size={currentView === 'puntos' ? 'xl' : 'lg'}>
			<Modal.Header closeButton>
				<Modal.Title>{getTitle()}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				{renderView()}
			</Modal.Body>
		</Modal>
	);
}
