//ModalNuevoPoryecto.tsx
//MOdal para añadir/editar PIA
//TODO añadir verificaciones (que la lista de videos no este vacia por ej) 
//TODO conexion backend

import { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import FormProyecto from './FormProyecto';
import SeleccionVideos from './SeleccionVideos'; //vista para seleccionar videos
import SeleccionPuntos from './SeleccionPuntos'; //vista para seleccionar puntos
import { ProyectoIA, Video } from '../resources/types';

const dummyVideos: Video[] = [
  { id: 1, nombre: 'picartet1', activo: false },
  { id: 2, nombre: 'picartet2', activo: true },
  { id: 3, nombre: 'General Logos1', activo: true },
  { id: 4, nombre: 'General Logos2', activo: true },
];

type Props = {
  show: boolean;
  onClose: () => void;
  onSave: (proyecto: ProyectoIA) => void;
  initialValues?: ProyectoIA;
};

export default function ModalNuevoProyecto({ show, onClose, onSave, initialValues }: Props) {
  const [currentView, setCurrentView] = useState<'form' | 'videos' | 'puntos'>('form');
  const [videos, setVideos] = useState<Video[]>(dummyVideos);
  const [videoSeleccionado, setVideoSeleccionado] = useState<Video | null>(null);
  const [proyectoData, setProyectoData] = useState<ProyectoIA>({
    id: 0,
    nombre: '',
    mVideo: '',
    mAudio: '',
    videoSalida: false,
    ventanasTiempo: false,
    tiempo: undefined,
    unidad: 'hora'
  });

  // Resetear al formulario cuando se abre el modal
  useEffect(() => {
    if (show) {
      setCurrentView('form');
      if (initialValues) {
        setProyectoData(initialValues);
      } else {
        setProyectoData({
          id: 0,
          nombre: '',
          mVideo: '',
          mAudio: '',
          videoSalida: false,
          ventanasTiempo: false,
          tiempo: undefined,
          unidad: 'hora'
        });
      }
    }
  }, [show, initialValues]);

  const handleToggleActivo = (id: number) => {
    setVideos(videos.map(v => v.id === id ? { ...v, activo: !v.activo } : v));
  };

  const handleLineaClick = (video: Video) => {
    setVideoSeleccionado(video);
    setCurrentView('puntos');
  };

  const handleSaveProyecto = (data: ProyectoIA) => {
    setProyectoData(data);
    onSave(data);
  };

  const renderView = () => {
    switch (currentView) {
      case 'videos':
        return (
          <SeleccionVideos 
            videos={videos}
            onToggleActivo={handleToggleActivo}
            onLineaClick={handleLineaClick}
            onBack={() => setCurrentView('form')}
          />
        );
      case 'puntos':
        return (
          <SeleccionPuntos 
            video={videoSeleccionado!}
            onBack={() => setCurrentView('videos')}
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
      case 'puntos': return `Líneas para: ${videoSeleccionado?.nombre}`;
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