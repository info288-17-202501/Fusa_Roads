import Table from '../components/Table';
import { Container } from 'react-bootstrap';
import { columns } from './resources/columns'
import { modelos as modelosData } from './resources/modelosData';
import { useState } from 'react';
import  ModalConfirmacion  from '../components/ModalConfirmacion';
import { Modelo } from './resources/types';
import  ModalNuevoModelo  from './components/ModalNuevoModelo' 

function ModelosIA() {
    const [showNuevo, setShowNuevo] = useState(false);

    const [modelos, setModelos] = useState(modelosData)
    const [showConfirmarModal, setShowConfirmarModal] = useState(false);
    const [message, setMessage] = useState<React.ReactNode>(null)
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const [editModelo, setEditModelo] = useState<Modelo | undefined>(undefined);
    const [showEditModal, setShowEditModal] = useState(false);

    const handleEdit = (modelo: Modelo) => {
        setEditModelo(modelo);
        setShowEditModal(true);
    }

    const handleAskDelete = (id: number, nombre: string) => {
        setDeleteId(id);
        setMessage( // Quedó así para poder poner letra en negrita
            <> 
                ¿Estás seguro que desear eliminar el modelo <strong>{nombre}</strong> con <strong>ID {id}</strong>?
            </>
        )
        // setMessage(`¿Estás seguro que deseas eliminar la sección de Modelo "${nombre}" con ID ${id}?`)
        setShowConfirmarModal(true);
    }

    const handleConfirmDelete = () => {
        if(deleteId === null) return;

        setModelos((prev) => prev.filter((c) => c.id !== deleteId))
        
        setShowConfirmarModal(false);
        setDeleteId(null);
    }

    return (
        <>
            <Container className="w-75 my-5">
                <h1 className="d-flex justify-content-center mb-4">Modelos IA</h1>
                <Table 
                    columns={columns(handleAskDelete, handleEdit)}
                    data={modelos}
                    showNewButton={true}
                    onClickNewButton={() => setShowNuevo(true)}
                />     
            </Container>


            <ModalNuevoModelo
                show={showNuevo}
                onClose={() => setShowNuevo(false)}
                onSave={(nuevaCalle) => {
                    setModelos(prev => [...prev, nuevaCalle]);
                    setShowNuevo(false)
                }}
            />

            <ModalNuevoModelo
                show={showEditModal}
                onClose={() => setShowEditModal(false)}
                initialValues={editModelo}
                onSave={(updatedCalle: Modelo) => {
                    setModelos((prev) => prev.map((c) => (c.id === updatedCalle.id ? updatedCalle : c)));
                    setShowEditModal(false);
                    setEditModelo(undefined);
                }}
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

export default ModelosIA
