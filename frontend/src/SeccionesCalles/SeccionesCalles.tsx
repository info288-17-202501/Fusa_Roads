import Table from '../components/Table';
import { Col, Container, Form, Row } from 'react-bootstrap';
import { columns } from './resources/columns'
import { calles as callesData } from './resources/callesData'; //Cambiar esto por un GET a la base de datos
import { useState } from 'react';
import ModalCargaMasiva from './components/ModalCargaMasiva';
import ModalNuevaSeccionCalle from './components/ModalNuevaSeccionCalle';
import ModalConfirmacion from './components/ModalConfirmacion'
import regiones_comunas from './resources/comunas-regiones.json'
import { Calle } from './resources/types';


function SeccionesCalles() {
    const [showNuevo, setShowNuevo] = useState(false);
    const [showCargaMasiva, setShowCargaMasiva] = useState(false);
    const [filtroApp, setFiltroApp] = useState<string>('cadnaa');


    const [calles, setCalles] = useState(callesData)
    const [showConfirmarModal, setShowConfirmarModal] = useState(false);
    const [message, setMessage] = useState<React.ReactNode>(null)
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const [editCalle, setEditCalle] = useState<Calle | undefined>(undefined);
    const [showEditModal, setShowEditModal] = useState(false);

    const handleEdit = (calle: Calle) => {
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

    const handleConfirmDelete = () => {
        if(deleteId === null) return;

        setCalles((prev) => prev.filter((c) => c.id !== deleteId))
        
        setShowConfirmarModal(false);
        setDeleteId(null);
    }

    // Cuando tengamos el backend, cambiar la forma de obtener los datos por este useEffecto
    // useEffect(() => {
    //     const fetchCalles = async () => {
    //         try {
    //             const response = await fetch('http://tu-backend.com/api/calles'); // <- cambia esto
    //             const data = await response.json();
    //             setCalles(data);
    //         } catch (error) {
    //             console.error("Error al cargar calles:", error);
    //         }
    //     };
    //     fetchCalles();
    // }, []);

    // Cuando tengamos el backend cambiar la funcion handleConfirmDelete:
    // const handleConfirmDelete = async () => {
    //     if (deleteId === null) return;
    
    //     try {
    //         await fetch(`http://tu-backend.com/api/calles/${deleteId}`, {
    //             method: 'DELETE',
    //         });
    
    //         setCalles((prev) => prev.filter((calle) => calle.id !== deleteId));
    //     } catch (error) {
    //         console.error("Error al eliminar calle:", error);
    //         // Podrías mostrar un toast o alerta al usuario
    //     } finally {
    //         setShowConfirmarModal(false);
    //         setDeleteId(null);
    //     }
    // };
    
    const getFilteredCalles = () => {
        if (filtroApp === 'cadnaa') {
            return calles.filter(c => c.app === 'CadnaA');
        } else if (filtroApp === 'noisemodelling') {
            return calles.filter(c => c.app === 'NoiseModelling');
        } else {
            return calles;
        }
    };



    return (
        <>

            <Container className="w-75 my-5">
                <h1 className="d-flex justify-content-center mb-4">Seccione Calles</h1>
                <Row className="justify-content-end mb-3">
                    <Col xs={6} sm={5} md={4} lg={3}>
                        <Form.Group className="d-flex">
                            <Form.Label className='d-flex align-items-center me-2'>App:</Form.Label>
                            <Form.Select
                                value={filtroApp}
                                onChange={(e) => setFiltroApp(e.target.value)}
                            >
                                <option value="cadnaa">CadnaA</option>
                                <option value="noisemodelling">Noise Modelling</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    
                </Row>

                <Table
                    columns={columns(handleAskDelete, handleEdit)}
                    data={getFilteredCalles()}
                    showNewButton={true}
                    onClickNewButton={() => setShowNuevo(true)}
                    showCargaMasivaButton={true}
                    onClickCargaMasivaButton={() => setShowCargaMasiva(true)}
                />
            </Container>

            <ModalCargaMasiva
                show={showCargaMasiva}
                onClose={() => setShowCargaMasiva(false)}
                data={regiones_comunas.regiones}
            />

            <ModalNuevaSeccionCalle
                show={showNuevo}
                onClose={() => setShowNuevo(false)}
                data={regiones_comunas.regiones}
                onSave={(nuevaCalle) => {
                    setCalles(prev => [...prev, nuevaCalle]);
                    setShowNuevo(false)
                }}
            />

            <ModalNuevaSeccionCalle
                show={showEditModal}
                onClose={() => setShowEditModal(false)}
                data={regiones_comunas.regiones}
                initialValues={editCalle}
                onSave={(updatedCalle: Calle) => {
                    setCalles((prev) => prev.map((c) => (c.id === updatedCalle.id ? updatedCalle : c)));
                    setShowEditModal(false);
                    setEditCalle(undefined);
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
