import Table from '../components/Table';
import { Container } from 'react-bootstrap';
import { columns } from './resources/columns'
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ModalCargaMasiva from './components/ModalCargaMasiva';
import ModalNuevaSeccionCalle from './components/ModalNuevaSeccionCalle';
import ModalConfirmacion from '../components/ModalConfirmacion'
import { CalleExtendida } from './resources/types';


function SeccionesCalles() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const appParam = queryParams.get("app") || "cadnaa"; // Por defecto mostraría cadnaa
    const [filtroApp, setFiltroApp] = useState<string>(appParam);

    useEffect(() => {
        setFiltroApp(appParam);
    }, [appParam]);

    const [showNuevo, setShowNuevo] = useState(false);
    const [showCargaMasiva, setShowCargaMasiva] = useState(false);

    // const [calles, setCalles] = useState(callesData)
    const [calles, setCalles] = useState<CalleExtendida[]>([])
    const [showConfirmarModal, setShowConfirmarModal] = useState(false);
    const [message, setMessage] = useState<React.ReactNode>(null)
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const [editCalle, setEditCalle] = useState<CalleExtendida | undefined>(undefined);
    const [showEditModal, setShowEditModal] = useState(false);

    useEffect(() => {
        fetchSeccionesCalles();
    }, [filtroApp]);

    const fetchSeccionesCalles = () => {
        fetch(`http://localhost:8001/secciones/${filtroApp}`)
            .then(res => res.json())
            .then(data => setCalles(data))
            .catch(err => console.error('Error cargando las Secciones de Calle: ', err));
    }

    const handleEdit = (calle: CalleExtendida) => {
        setEditCalle(calle);
        setShowEditModal(true);
    }

    const handleAskDelete = (id: number, nombre: string) => {
        setDeleteId(id);
        setMessage( // Quedó así para poder poner letra en negrita
            <> 
                ¿Estás seguro que desear eliminar la sección de calle <strong>{nombre}</strong> con <strong>ID {id}</strong>?
            </>
        )
        // setMessage(`¿Estás seguro que deseas eliminar la sección de calle "${nombre}" con ID ${id}?`)
        setShowConfirmarModal(true);
    }

        const handleConfirmDelete = async () => {
        if (deleteId === null) return;

        try{
            const response = await fetch(`http://localhost:8001/secciones/${deleteId}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error("Error al eliminar Sección de Calle")
            
            setCalles((prev) => prev.filter((c) => c.id !== deleteId))

        } catch (error) {
            console.error("Error eliminando Sección de Calle: ", error);
            alert("Hubo un problema al eliminar la Sección de calle");
        } finally {
            setShowConfirmarModal(false);
            setDeleteId(null);
        }
        
    }


    return (
        <>

            <Container className="w-75 my-5">
                <h1 className="d-flex justify-content-center mb-4">Secciones Calles</h1>
                <Table
                    columns={columns(handleAskDelete, handleEdit)}
                    data={calles}
                    // showNewButton={true}
                    onClickNewButton={() => setShowNuevo(true)}
                    showCargaMasivaButton={true}
                    onClickCargaMasivaButton={() => setShowCargaMasiva(true)}
                />
            </Container>

            <ModalCargaMasiva
                show={showCargaMasiva}
                onClose={() => setShowCargaMasiva(false)}
                onSuccess={() => {
                    fetchSeccionesCalles();
                    setShowCargaMasiva(false);
                }}
            />

            <ModalNuevaSeccionCalle
                show={showNuevo}
                onClose={() => setShowNuevo(false)}
                onSave={() => {
                            fetch(`http://localhost:8001/secciones/${filtroApp}`)
                                .then(res => res.json())
                                .then(data => {
                                    setCalles(data);
                                    setShowNuevo(false);
                                })
                                .catch(err => {
                                    console.error("Error al recargar Secciones de calle:", err);
                                    setShowNuevo(false);
                                });
                        }}
            />

            <ModalNuevaSeccionCalle
                show={showEditModal}
                onClose={() => setShowEditModal(false)}
                seccionAEditar={editCalle}
                onSave={() => {
                            fetch(`http://localhost:8001/secciones/${filtroApp}`)
                                .then(res => res.json())
                                .then(data => {
                                    setCalles(data);
                                    setShowEditModal(false);
                                })
                                .catch(err => {
                                    console.error("Error al recargar Secciones de calle:", err);
                                    setShowEditModal(false);
                                });
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

export default SeccionesCalles
