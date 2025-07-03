import { Container } from 'react-bootstrap';
import { columns } from './resources/columns';
import { useState, useEffect } from 'react';
import { ProyectoIA } from './resources/types';
import Table from '../components/Table';
import ModalConfirmacion from '../components/ModalConfirmacion';
import ModalNuevoProyecto from './components/ModalNuevoProyecto';

function ProyectosIA() {
    // Cambiar esto cuando se realize la consulta a mongo
    const [showNuevo, setShowNuevo] = useState(false);
    const [showConfirmarModal, setShowConfirmarModal] = useState(false);
    const [message, setMessage] = useState<React.ReactNode>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [editProyecto, setEditProyecto] = useState<ProyectoIA | undefined>(undefined);
    const [showEditModal, setShowEditModal] = useState(false);

    const [proyectos, setProyectos] = useState<ProyectoIA[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const res = await fetch('http://localhost:8005/parametros/', { method: 'GET' });
                const data = await res.json();
                const processedData = data.map((ProyectoIA: ProyectoIA) => ({
                    _id: ProyectoIA._id,
                    id: ProyectoIA._id,
                    nombre_proyecto: ProyectoIA.nombre_proyecto,
                    modelo_video: ProyectoIA.modelo_video,
                    modelo_audio: ProyectoIA.modelo_audio,
                    lista_videos: ProyectoIA.lista_videos,

                    flag_videos_salida: ProyectoIA.flag_videos_salida,
                    path_videos_salida: ProyectoIA.path_videos_salida,
                    bucket_videos_salida: ProyectoIA.path_videos_salida,

                    flag_ventanas_tiempo: ProyectoIA.flag_ventanas_tiempo,
                    cant_ventanas: ProyectoIA.cant_ventanas,
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


    // Editar PIA
    const edit_pia = (proyecto: ProyectoIA) => {
        setMessage(<>Editar PIA?</>)
        // setEditProyecto(proyecto);
        setShowConfirmarModal(true);
    };

    // Borrar PIA
    const delete_pia = (id: number, nombre: string) => {
        setMessage(<>¿Estás seguro que deseas eliminar el proyecto <strong>{nombre}</strong> con <strong>ID {id}</strong>?</>);
        setShowConfirmarModal(true);
    };

    const handleConfirmDelete = () => {
        if (deleteId === null) return;
        setProyectos((prev) => prev.filter((p) => p._id !== deleteId));
        setShowConfirmarModal(false);
        setDeleteId(null);
    };

    // Ejecutar PIA
    const ejecutar_pia = (proyecto: ProyectoIA) => {
        alert(`Procesando proyecto: ${proyecto.nombre_proyecto} (ID: ${proyecto._id})`);
        // ACA SE DEBERIA LLAMAR AL PROCESO DE IA
    };

    return (
        <Container>
            {loading ? (
                <p className="text-center">Cargando los PIA...</p>
            ) : (
                <Container className="w-75 my-5">
                    <h1 className="d-flex justify-content-center mb-4">Proyectos IA</h1>
                    <Table
                        columns={columns(delete_pia, edit_pia, ejecutar_pia)}
                        data={proyectos}
                        showNewButton={true}
                        onClickNewButton={() => setShowNuevo(true)}
                    />
                </Container>)}

            <ModalNuevoProyecto
                show={showNuevo}
                cerrar_nuevo_proyecto={() => setShowNuevo(false)}
                guardar_nuevo_proyecto={(nuevoProyectoIA) => {
                    setProyectos(prev => [...prev, nuevoProyectoIA]);
                    setShowNuevo(false);
                }}
            />

            {/* <ModalNuevoProyecto
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
            /> */}
        </Container>
    );
}

export default ProyectosIA;
