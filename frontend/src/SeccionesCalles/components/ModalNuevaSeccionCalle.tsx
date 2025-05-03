import { Modal, Button } from "react-bootstrap";

interface Props {
    show: boolean;
    onClose: () => void;
    onSubmit?: () => void;
}

function ModalNuevaSeccionCalle ({show, onClose, onSubmit}: Props){


    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>
                    Nueva Sección de Calle
                </Modal.Title>
            </Modal.Header>
            
            <Modal.Body>
                Aqui van los forms
                
            </Modal.Body>

            <Modal.Footer>
                <Button variant='secondary' onClick={onClose}>Cancelar</Button>
                <Button variant='primary' onClick={onSubmit}>Guardar</Button>
            </Modal.Footer>
        </Modal>
    )
}
export default ModalNuevaSeccionCalle