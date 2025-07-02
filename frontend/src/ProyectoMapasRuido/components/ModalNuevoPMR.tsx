import { Modal, Button, Form, Container, Alert} from "react-bootstrap";
import { useState, useEffect, FormEvent } from 'react'
import { PMR, Pais, Ciudad, Localidad, PiaVideo } from '../resources/types'
import FormRow from "../../components/FormRow";
import Table from "../../components/Table";

import { columnsVideos } from "../resources/columnsVideos";

interface Props {
    show: boolean;
    onClose: () => void;
    onSave: (pmr: PMR) => void;
    pmrAEditar?: PMR;
}

function ModalNuevoPMR ({show, onClose, onSave, pmrAEditar} : Props){
    const [validated, setValidated] = useState(false);

    const [pais, setPais] = useState('');
    const [paises, setPaises] = useState<Pais[]>([]);
    const [ciudad, setCiudad] = useState('');
    const [ciudades, setCiudades] = useState<Ciudad[]>([]);
    const [localidad, setLocalidad] = useState('');
    const [localidades, setLocalidades] = useState<Localidad[]>([]);
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [activo, setActivo] = useState<boolean>(false);
    const [videos, setVideos] = useState<PiaVideo[]>([]);
    const [videosSeleccionados, setVideosSeleccionados] = useState<number[]>([]);
    const [errorVideos, setErrorVideos] = useState<string | null>(null);


    useEffect(() => {
        fetchPaises();
    }, []);

    const fetchPaises = async () => {
        const response = await fetch('http://localhost:8006/ubicacion/paises');
        const data = await response.json();
        setPaises(data);
    };

    const handlePaisChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = parseInt(e.target.value);
        setPais(e.target.value);
        setCiudad('');
        setLocalidad('');
        setCiudades([]);
        setLocalidades([]);
        if (!isNaN(selectedId)) fetchCiudades(selectedId);
    };

    const fetchCiudades = async (idPais: number) => {
        const response = await fetch(`http://localhost:8006/ubicacion/ciudades/${idPais}`);
        const data = await response.json();
        setCiudades(data);
    };

    const handleCiudadChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = parseInt(e.target.value);
        setCiudad(e.target.value);
        setLocalidad('');
        setLocalidades([]);
        if (!isNaN(selectedId)) {
            fetchLocalidades(selectedId);
            fetchVideos(selectedId)
        }
    };

    const fetchLocalidades = async (idCiudad: number) => {
        const response = await fetch(`http://localhost:8006/ubicacion/localidades/${idCiudad}`);
        const data = await response.json();
        setLocalidades(data);
    };

    const fetchVideos = async (idCiudad: number) => {
        try{
            const response = await fetch(`http://localhost:8006/pia_videos/?id_ciudad=${idCiudad}`);
            if (!response.ok) throw new Error("Error al obtener pia_videos")
            const data = await response.json();
            setVideos(data)
        } catch (error){
            console.error(error);
            setVideos([]);
            setErrorVideos("Error al obtener pia_videos de la ciudad seleccionada")
        }
    };

    useEffect(() => {
        if (!pmrAEditar) return;
        setNombre(pmrAEditar.nombre);
        setDescripcion(pmrAEditar.descripcion);
        setActivo(pmrAEditar.activo)

        const cargarUbicacionYVideos = async () => {
            const locRes = await fetch(`http://localhost:8006/ubicacion/detalles_localidad/${pmrAEditar.id_localidad}`);
            const data = await locRes.json();

            setPais(data.id_pais.toString());
            setCiudad(data.id_ciudad.toString());
            setLocalidad(data.id_localidad.toString());

            fetchCiudades(data.id_pais);
            fetchLocalidades(data.id_ciudad);
            fetchVideos(data.id_ciudad);
        };

        const cargarVideosSeleccionados = async () => {
            const res = await fetch(`http://localhost:8006/uso/${pmrAEditar.id}`);
            const ids: number[] = await res.json();
            setVideosSeleccionados(ids);
        };

        cargarUbicacionYVideos();
        cargarVideosSeleccionados();
    }, [pmrAEditar]);

    const toggleVideo = (id: number) => {
        setVideosSeleccionados((prev) =>
            prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
        );
    };

    const handleCancelar = () => {
        if (!pmrAEditar) {
            // Solo limpiar si estás creando un nuevo PMR
            resetForm();
            // setPais('')
            // setCiudad('')
            // setLocalidad('')
            // setNombre('');
            // setDescripcion('');
            // setVideos([])
            // setVideosSeleccionados([]);
            // setErrorVideos('')
            // setValidated(false);
        }
        console.log(videosSeleccionados)
        onClose(); // Siempre cerrar
    }

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (!form.checkValidity()) { //Si no es válido, entra aquí
            event.stopPropagation();
            setValidated(true);
            return;
        }

        if(videosSeleccionados.length === 0){
            setErrorVideos("¡Debe seleccionar al menos un video!");
            return;
        }
    
        setValidated(true);
        setErrorVideos(null)
        handleGuardarYLimpiar();
    };

    const handleGuardarYLimpiar = async () => {
        try{
            let nuevoPMR: PMR;

            if (pmrAEditar) {
                const response = await fetch(`http://localhost:8006/pmr/${pmrAEditar.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        nombre: nombre.trim(),
                        descripcion: descripcion.trim(),
                        id_localidad: parseInt(localidad),
                        activo
                    })
                });

                if (!response.ok) throw new Error("Error al editar PMR");
                nuevoPMR = await response.json();

                // Obtener videos anteriores para comparar
                const responseUsos = await fetch(`http://localhost:8006/uso/${pmrAEditar.id}`);
                const videosAnteriores: number[] = await responseUsos.json();

                // Calcular diferencias
                const videosAAgregar = videosSeleccionados.filter(id => !videosAnteriores.includes(id));
                const videosAEliminar = videosAnteriores.filter(id => !videosSeleccionados.includes(id));

                // Agregar nuevos usos
                if (videosAAgregar.length > 0) {
                    const addRes = await fetch("http://localhost:8006/uso/batch", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            id_pmr: nuevoPMR.id,
                            id_pia_videos: videosAAgregar
                        })
                    });
                    if (!addRes.ok) throw new Error("Error agregando nuevos videos");
                }

                // Eliminar usos quitados (esto requiere un nuevo endpoint DELETE)
                if (videosAEliminar.length > 0) {
                    for (const idVideo of videosAEliminar) {
                        const delRes = await fetch(`http://localhost:8006/uso/${pmrAEditar.id}/${idVideo}`, {
                            method: "DELETE"
                        });
                        if (!delRes.ok) throw new Error("Error eliminando video deseleccionado");
                    }
                }
            } else {
                // Crear Nuevo PMR
                const pmrResponse = await fetch("http://localhost:8006/pmr/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        nombre: nombre.trim(),
                        descripcion: descripcion.trim(),
                        id_localidad: parseInt(localidad),
                        activo
                    })
                });

                if (!pmrResponse.ok) throw new Error("Error al crear PMR");
                nuevoPMR = await pmrResponse.json();

                // Asociar videos
                if (videosSeleccionados.length > 0) {
                    const usosResponse = await fetch("http://localhost:8006/uso/batch", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            id_pmr: nuevoPMR.id,
                            id_pia_videos: videosSeleccionados
                        })
                    });
                    if (!usosResponse.ok) throw new Error("Error al asociar videos al nuevo PMR");
                }
            }
            onSave(nuevoPMR);
            resetForm();
            // setNombre('');
            // setDescripcion('');
            // setVideos([])
            // setVideosSeleccionados([]);
            // setValidated(false);
            onClose();
        } catch (error) {
            console.error("Error al guardar PMR:", error);
            alert("Ocurrió un error al guardar el PMR");
        }
    }

    const resetForm = () => {
        setPais('');
        setCiudad('');
        setLocalidad('');
        setNombre('');
        setDescripcion('');
        setActivo(false)
        setVideos([]);
        setVideosSeleccionados([]);
        setErrorVideos(null);
        setValidated(false);
    };

    return (
        <Modal show={show} onHide={handleCancelar} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>
                    {pmrAEditar ? "Editar Proyecto de Mapa de Ruido" : "Nuevo Proyecto de Mapa de Ruido"}
                </Modal.Title>
            </Modal.Header>

            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Modal.Body>
                    <FormRow label="Pais:" showFeedback>
                        <Form.Select required value={pais} onChange={handlePaisChange} disabled={!!pmrAEditar}>
                            <option value={''}>Seleccione Pais</option>
                            {paises.map((p: Pais) => (
                                <option key={p.id} value={p.id}>{p.nombre}</option>
                            ))}
                        </Form.Select>
                    </FormRow>
                    <FormRow label="Ciudad:" showFeedback>
                        <Form.Select required disabled={!!pmrAEditar || !pais} value={ciudad} onChange={handleCiudadChange}>
                            <option value={''}>Seleccione Ciudad</option>
                            {ciudades.map((c: Ciudad) => (
                                <option key={c.id} value={c.id}>{c.nombre}</option>
                            ))}
                        </Form.Select>
                    </FormRow>
                    <FormRow label="Localidad:" showFeedback>
                        <Form.Select required disabled={!!pmrAEditar || !ciudad} value={localidad} onChange={(e) => setLocalidad(e.target.value)}>
                            <option value={''}>Seleccione Localidad</option>
                            {localidades.map((l: Localidad) => (
                                <option key={l.id} value={l.id}>{l.nombre}</option>
                            ))}
                        </Form.Select>
                    </FormRow>
                    <FormRow label="Nombre">
                        <Form.Control value={nombre} placeholder="Ingrese el nombre del PMR" required maxLength={50} onChange={(e) => setNombre(e.target.value)}/>
                    </FormRow>
                    <FormRow label="Descripción">
                        <Form.Control value={descripcion} placeholder="Ingrese una breve descripción del PMR" required maxLength={50} onChange={(e) => setDescripcion(e.target.value)}/>
                    </FormRow>

                    <FormRow label="Estado de Activación del PMR">
                        <Form.Switch label={activo ? "Activado" : "Desactivado"} checked={activo} onChange={(e) => setActivo(e.target.checked)}/>
                        {activo && (
                            <Alert variant="warning" className="mb-0 mt-2 p-2">
                                ¡Al activar esta opción, <strong>todos</strong> los demás PMRs serán <strong>desactivados automáticamente</strong>!
                            </Alert>
                        )}
                    </FormRow>
                    
                    <Container className="">
                        <Form.Label>Seleccione Videos</Form.Label>
                        {errorVideos && (
                            <Alert variant="danger">
                                {errorVideos}
                            </Alert>
                        )} 

                        {videos.length === 0 && ! ciudad && (
                            <Alert variant="info">
                                Debe seleccionar una ciudad para ver videos disponibles
                            </Alert>
                        )}

                        {videos.length === 0 && ciudad && (
                            <Alert variant="warning">
                                No hay videos disponibles para esta ciudad
                            </Alert>
                        )}
                        
                        {videos.length > 0 && (
                            <Table
                                columns={columnsVideos(videosSeleccionados, toggleVideo)}
                                data={videos}
                            />
                        )}
                        
                    </Container>

                </Modal.Body>

                <Modal.Footer>
                    <Button variant='secondary' onClick={handleCancelar}>Cancelar</Button>
                    <Button type="submit">Guardar</Button>
                </Modal.Footer>
            </Form>


        </Modal>
    )
}
export default ModalNuevoPMR