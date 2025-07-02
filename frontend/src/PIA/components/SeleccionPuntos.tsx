//SeleccionPuntos.tsx
//Vista del modal para seleccionar los puntos
//Se podría traer el codigo de PntosVideo para acá

import { Button } from 'react-bootstrap';
import { Video } from '../resources/types';
import  PuntosVideo from  './puntosVideo' //codigo renato

type Props = {
  video: Video;
  onBack: () => void;
};

export default function SeleccionPuntos({ video, onBack }: Props) {
  return (
    <div style={{ height: '60vh' }}>
      <h5>Editando líneas para: {video.name}</h5>
      <div className="border rounded p-3 mb-3" style={{ height: '90%' }}>
        <PuntosVideo/>
      </div>
      <div className="d-flex justify-content-end gap-2">
        <Button variant="secondary" onClick={onBack}>Volver</Button>
        <Button variant="primary" onClick={onBack}>Guardar líneas</Button>
      </div>
    </div>
  );
}