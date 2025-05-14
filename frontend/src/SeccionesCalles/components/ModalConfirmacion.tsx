import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Modal, Button } from 'react-bootstrap'

interface Props {
    show: boolean;
    onClose: () => void;
    onConfirm: () => void;
    message?: React.ReactNode;
}

const ModalConfirmacion = ({show, onClose, onConfirm, message}: Props) => {
    return(
        <Modal size="sm" show={show} onHide={onClose} centered>
            <Modal.Body>
                <div className='d-flex flex-column align-items-center text-center'>
                    <FontAwesomeIcon size="5x" icon={faExclamationCircle} color='#dc3545'/>
                    <p className='mt-3'>{message}</p>
                </div>
                <div className='d-flex justify-content-center gap-3'>
                    <Button variant='secondary' onClick={onClose}>Cancelar</Button>
                    <Button variant='danger' onClick={onConfirm}>Confirmar</Button>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default ModalConfirmacion