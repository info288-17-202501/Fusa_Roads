import Table from '../components/Table';
import { Container } from 'react-bootstrap';
import { columns } from './resources/columns';
import { proyectosData } from './resources/proyectosData';
import { useState } from 'react';
import ModalConfirmacion from '../components/ModalConfirmacion';
import { ProyectoIA } from './resources/types';
import ModalNuevoProyecto from './components/ModalNuevoProyecto';

function ProyectosIA() {
    const [showNuevo, setShowNuevo] = useState(false);
    const [proyectos, setProyectos] = useState(proyectosData);
    const [showConfirmarModal, setShowConfirmarModal] = useState(false);
    const [message, setMessage] = useState<React.ReactNode>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const [editProyecto, setEditProyecto] = useState<ProyectoIA | undefined>(undefined);
    const [showEditModal, setShowEditModal] = useState(false);

    const handleEdit = (proyecto: ProyectoIA) => {
        setEditProyecto(proyecto);
        setShowEditModal(true);
    };

    const handleAskDelete = (id: number, nombre: string) => {
        setDeleteId(id);
        setMessage(
            <>
                ¿Estás seguro que deseas eliminar el proyecto <strong>{nombre}</strong> con <strong>ID {id}</strong>?
            </>
        );
        setShowConfirmarModal(true);
    };

    const handleConfirmDelete = () => {
        if (deleteId === null) return;
        setProyectos((prev) => prev.filter((p) => p.id !== deleteId));
        setShowConfirmarModal(false);
        setDeleteId(null);
    };

        const handleProcess = (proyecto: ProyectoIA) => {
        alert(`Procesando proyecto: ${proyecto.nombre} (ID: ${proyecto.id})`);
        // Aquí podrías disparar una petición a la API o iniciar alguna lógica
    };

    return (
        <>
            <Container className="w-75 my-5">
                <h1 className="d-flex justify-content-center mb-4">Proyectos IA</h1>
                <Table 
                    columns={columns(handleAskDelete, handleEdit, handleProcess)}
                    data={proyectos}
                    showNewButton={true}
                    onClickNewButton={() => setShowNuevo(true)}
                />
            </Container>

            <ModalNuevoProyecto
                show={showNuevo}
                onClose={() => setShowNuevo(false)}
                onSave={(nuevoProyectoIA) => {
                    setProyectos(prev => [...prev, nuevoProyectoIA]);
                    setShowNuevo(false);
                }}
            />

            <ModalNuevoProyecto
                show={showEditModal}
                onClose={() => setShowEditModal(false)}
                initialValues={editProyecto}
                onSave={(updatedProyecto: ProyectoIA) => {
                    setProyectos((prev) => prev.map((p) => (p.id === updatedProyecto.id ? updatedProyecto : p)));
                    setShowEditModal(false);
                    setEditProyecto(undefined);
                }}
            />

            <ModalConfirmacion
                show={showConfirmarModal}
                onClose={() => setShowConfirmarModal(false)}
                onConfirm={handleConfirmDelete}
                message={message}
            />
        </>
    );
}

export default ProyectosIA;
