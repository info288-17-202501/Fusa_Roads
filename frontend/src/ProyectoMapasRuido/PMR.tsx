import Table from '../components/Table';
import { Container } from 'react-bootstrap';
import { PMRs_ejemplo } from './resources/pmrData';
import { columns } from './resources/columns'
import { useState } from 'react';
import { PMR } from './resources/types';
import ModalConfirmacion from '../components/ModalConfirmacion';
import ModalNuevoPMR from './components/ModalNuevoPMR';



function PMR_page() {
    const [PMRs, setPMRs] = useState(PMRs_ejemplo)
    const [showConfirmarModal, setShowConfirmarModal] = useState(false);
    const [message, setMessage] = useState<React.ReactNode>(null)
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const [editPMR, setEditPMR] = useState<PMR | undefined>(undefined);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showNuevo, setShowNuevo] = useState(false);

    const handleEdit = (pmr: PMR) => {
        setEditPMR(pmr);
        setShowEditModal(true);
    }

    const handleAskDelete = (id: number, nombre: string) => {
        setDeleteId(id);
        setMessage( // Quedó así para poder poner letra en negrita
            <> 
                ¿Estás seguro que desear eliminar el PMR <strong>{nombre}</strong> con <strong>ID {id}</strong>?
            </>
        )
        setShowConfirmarModal(true);
    }

    const handleConfirmDelete = () => {
        if(deleteId === null) return;

        setPMRs((prev) => prev.filter((c) => c.id !== deleteId))
        
        setShowConfirmarModal(false);
        setDeleteId(null);
    }
    
    return (
        <>

            <Container className="w-75 my-5">
                <h1 className="d-flex justify-content-center mb-4">Proyectos Mapa de Ruido</h1>
                <Table
                    columns={columns(handleAskDelete, handleEdit)}
                    data={PMRs}
                    showNewButton={true}
                    onClickNewButton={() => setShowNuevo(true)}
                />
            </Container>

            {/* Modal para crear Nuevo PMR */}
            <ModalNuevoPMR 
                show={showNuevo}
                onClose={() => setShowNuevo(false)}
                onSave={(nuevoPMR) => {
                    setPMRs(prev => [...prev, nuevoPMR]);
                    setShowNuevo(false)
                }}
                
            />

            {/* Modal para editar */}
            <ModalNuevoPMR 
                show={showEditModal}
                onClose={() => setShowEditModal(false)}
                onSave={(pmrEditado) => {
                    setPMRs(prev => prev.map(p => (p.id === pmrEditado.id ? pmrEditado : p)));
                    setShowEditModal(false)
                }}
                pmrAEditar={editPMR}
            />

            <ModalConfirmacion
                show={showConfirmarModal}
                onClose={() => setShowConfirmarModal(false)}
                onConfirm={handleConfirmDelete}
                message={message}
            />
        </>
    )
}

export default PMR_page
