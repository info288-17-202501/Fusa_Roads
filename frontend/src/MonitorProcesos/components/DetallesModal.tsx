// DetallesModal.tsx
import { Modal, Button } from 'react-bootstrap';
import { Proceso } from '../resources/types';

type Props = {
  show: boolean;
  onClose: () => void;
  proceso: Proceso | null;
};

export const DetallesModal = ({ show, onClose, proceso }: Props) => {
  if (!proceso) return null;

  // Mostrar solo estado 'video' con avance o cualquier estado con error
  const estadosRelevantes = proceso.estados.filter(
    (e) => 
      (e.estado === "video" && e.avance) ||
      e.flag === "error"
  );

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Detalles de {proceso.nombre}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {estadosRelevantes.length === 0 ? (
          <p>No hay información adicional disponible.</p>
        ) : (
          <ul>
            {estadosRelevantes.map((e, i) => (
              <li key={i}>
                <strong>{e.estado}</strong>
                {e.avance && (
                  <> | <strong>Avance:</strong> {e.avance.actual}/{e.avance.total}</>
                )}
                {e.flag === "error" && (
                  <> | <strong>Error:</strong> {e.descrip || "Sin descripción"}</>
                )}
              </li>
            ))}
          </ul>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Cerrar</Button>
      </Modal.Footer>
    </Modal>
  );
};
