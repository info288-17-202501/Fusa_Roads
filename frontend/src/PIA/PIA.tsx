import { Container } from 'react-bootstrap';
import { columns } from './resources/columns';
import { useState, useEffect } from 'react';
import { ProyectoIA } from './resources/types';
import Table from '../components/Table';
import ModalConfirmacion from '../components/ModalConfirmacion';
import ModalNuevoProyecto from './components/ModalNuevoProyecto';

function ProyectosIA() {
    // Cambiar esto cuando se realize la consulta a mongo
    const [proyectos, setProyectos] = useState<ProyectoIA[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const res = await fetch('http://localhost:8005/parametros/', { method: 'GET' });
                const data = await res.json();

                const processedData = data.map((ProyectoIA: ProyectoIA) => ({
                    id: ProyectoIA._id,
                    _id: ProyectoIA._id,
                    nombre_proyecto: ProyectoIA.nombre_proyecto,
                    flag_videos_salida: ProyectoIA.flag_videos_salida,
                    flag_ventanas_tiempo: ProyectoIA.flag_ventanas_tiempo,
                    modelo_video: ProyectoIA.modelo_video,
                    modelo_audio: ProyectoIA.modelo_audio,
                    lista_videos: ProyectoIA.lista_videos,
                    cantidad_ventanas: ProyectoIA.cantidad_ventanas,
                    unidad_tiempo_ventanas: ProyectoIA.unidad_tiempo_ventanas,
                }));


                setProyectos(processedData);
                setLoading(false);
            } catch (error) {
                console.error("Error cargando los videos:", error);
                setLoading(false);
            }
        };
        fetchVideos();
    }, []);

    const [showNuevo, setShowNuevo] = useState(false);
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
            <>¿Estás seguro que deseas eliminar el proyecto <strong>{nombre}</strong> con <strong>ID {id}</strong>?</>
        );
        setShowConfirmarModal(true);
    };

    const handleConfirmDelete = () => {
        if (deleteId === null) return;
        setProyectos((prev) => prev.filter((p) => p.id !== deleteId));
        setShowConfirmarModal(false);
        setDeleteId(null);
    };

    const handleProcess = async (proyecto: ProyectoIA) => {
        alert(`Procesando proyecto: ${proyecto.nombre_proyecto} (ID: ${proyecto._id})`);
        // ACA SE DEBE INDICAR A PARAMETROS QUE SE QUIERE COMENZAR EL PROCESO
        try {
            const res = await fetch(`http://localhost:8005/parametros/${proyecto._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!res.ok) throw new Error("Error en la respuesta del servidor");

            const result = await res.json();
            console.log("Se mandó a procesar correctamente:", result);
        } catch (error) {
            console.error("Error al mandar los datos", error);
        }
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
