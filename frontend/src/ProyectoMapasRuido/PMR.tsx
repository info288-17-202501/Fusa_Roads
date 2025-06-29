import Table from '../components/Table';
import { Container } from 'react-bootstrap';
import { columns } from './resources/columns'
import { useState, useEffect } from 'react';
import { PMR } from './resources/types';
import ModalConfirmacion from '../components/ModalConfirmacion';
import ModalNuevoPMR from './components/ModalNuevoPMR';



function PMR_page() {
    const [PMRs, setPMRs] = useState<PMR[]>([])
    const [showConfirmarModal, setShowConfirmarModal] = useState(false);
    const [message, setMessage] = useState<React.ReactNode>(null)
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const [editPMR, setEditPMR] = useState<PMR | undefined>(undefined);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showNuevo, setShowNuevo] = useState(false);

    useEffect(() => {
        fetch('http://localhost:8006/pmr/')
            .then(res => res.json())
            .then(data => setPMRs(data))
            .catch(err => console.error('Error cargando PMRs:', err));
    }, []);

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

    const handleConfirmDelete = async () => {
        if (deleteId === null) return;

        try{
            const response = await fetch(`http://localhost:8006/pmr/${deleteId}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error("Error al eliminar el PMR")
            
            setPMRs((prev) => prev.filter((c) => c.id !== deleteId))

        } catch (error) {
            console.error("Error eliminando PMR: ", error);
            alert("Hubo un problema al eliminar el PMR");
        } finally {
            setShowConfirmarModal(false);
            setDeleteId(null);
        }
        
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
                onSave={() => {
                            fetch("http://localhost:8006/pmr/")
                                .then(res => res.json())
                                .then(data => {
                                    setPMRs(data);
                                    setShowEditModal(false);
                                })
                                .catch(err => {
                                    console.error("Error al recargar PMRs:", err);
                                    setShowEditModal(false);
                                });
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
