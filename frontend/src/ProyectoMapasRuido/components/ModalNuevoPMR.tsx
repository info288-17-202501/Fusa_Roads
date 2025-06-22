import { Modal, Button, Form } from "react-bootstrap";
import { useState, useEffect, FormEvent } from 'react'
import { PMR } from '../resources/types'
import FormRow from "../../components/FormRow";
import Table from "../../components/Table";

import { columnsVideos } from "../resources/columnsVideos";
import { videosEjemplo } from "../resources/videosData";

interface Props {
    show: boolean;
    onClose: () => void;
    onSave: (pmr: PMR) => void;
    pmrAEditar?: PMR;
}

function ModalNuevoPMR ({show, onClose, onSave, pmrAEditar} : Props){
    const [validated, setValidated] = useState(false);

    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [videosSeleccionados, setVideosSeleccionados] = useState<number[]>([]);

    useEffect(() => {
        if (pmrAEditar) {
            setNombre(pmrAEditar.nombre);
            setDescripcion(pmrAEditar.descripcion);
            setVideosSeleccionados(pmrAEditar.video_ids);
        } else {
            setNombre('');
            setDescripcion('');
            setVideosSeleccionados([]);
        }
    }, [pmrAEditar]);

    const toggleVideo = (id: number) => {
        setVideosSeleccionados((prev) =>
            prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
        );
    };

    const handleCancelar = () => {
        if (!pmrAEditar) {
            // Solo limpiar si estás creando un nuevo PMR
            setNombre('');
            setDescripcion('');
            setVideosSeleccionados([]);
            setValidated(false);
        }

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
    
        setValidated(true);
        handleGuardarYLimpiar();
    };

    const handleGuardarYLimpiar = () => {
        const pmr: PMR = {
            id: pmrAEditar?.id ?? Date.now(), //Cambiar por un id de verdad
            nombre: nombre,
            descripcion: descripcion,
            fecha_creacion: pmrAEditar?.fecha_creacion ?? new Date().toISOString().split('T')[0],
            video_ids: videosSeleccionados
        }
        onSave(pmr)
        console.log(pmr);
        // Aqui se deberia manejar la logica para mandar a la BD (podemos unir esta funcion con la de handleSubmit)
        
        setNombre('');
        setDescripcion('');
        setVideosSeleccionados([])
        setValidated(false);
        onClose();
    }



    return (
        <Modal show={show} onHide={handleCancelar} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>
                    Nuevo Proyecto de Mapa de Ruido
                </Modal.Title>
            </Modal.Header>

            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Modal.Body>
                    <FormRow label="Nombre">
                        <Form.Control value={nombre} placeholder="Ingrese el nombre del PMR" required onChange={(e) => setNombre(e.target.value)}/>
                    </FormRow>
                    <FormRow label="Descripción">
                        <Form.Control value={descripcion} placeholder="Ingrese una breve descripción del PMR" required onChange={(e) => setDescripcion(e.target.value)}/>
                    </FormRow>
                    <FormRow label="Seleccione videos">
                        <Table
                            columns={columnsVideos(videosSeleccionados, toggleVideo)}
                            data={videosEjemplo}
                        />
                    </FormRow>
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