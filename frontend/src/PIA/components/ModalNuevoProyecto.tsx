import { Modal, Button, Form } from "react-bootstrap";
import { useState, useEffect, FormEvent } from 'react';
import FormRow from "../../components/FormRow";
import { ProyectoIA } from "../resources/types";

interface Props {
    show: boolean;
    onClose: () => void;
    initialValues?: ProyectoIA;
    onSave: (proyecto: ProyectoIA) => void;
}

function ModalNuevoProyecto({ show, onClose, initialValues, onSave }: Props) {
    const [validated, setValidated] = useState(false);

    const [nombre, setNombre] = useState('');
    const [videoSalida, setVideoSalida] = useState(false);
    const [ventanasTiempo, setVentanasTiempo] = useState(false);
    const [mVideo, setMVideo] = useState('');
    const [mAudio, setMAudio] = useState('');

    useEffect(() => {
        if (initialValues) {
            setNombre(initialValues.nombre);
            setVideoSalida(initialValues.videoSalida);
            setVentanasTiempo(initialValues.ventanasTiempo);
            setMVideo(initialValues.mVideo);
            setMAudio(initialValues.mAudio);
        } else {
            setNombre('');
            setVideoSalida(false);
            setVentanasTiempo(false);
            setMVideo('');
            setMAudio('');
        }
        setValidated(false);
    }, [initialValues, show]);

    const handleCancelar = () => {
        setNombre('');
        setVideoSalida(false);
        setVentanasTiempo(false);
        setMVideo('');
        setMAudio('');
        setValidated(false);
        onClose();
    };

    const handleGuardarYLimpiar = () => {
        const proyecto: ProyectoIA = {
            id: initialValues?.id ?? Date.now(),
            nombre,
            videoSalida,
            ventanasTiempo,
            mVideo,
            mAudio
        };
        onSave(proyecto);

        // Limpiar y cerrar
        handleCancelar();
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (!form.checkValidity()) {
            event.stopPropagation();
            setValidated(true);
            return;
        }

        setValidated(true);
        handleGuardarYLimpiar();
    };

    return (
        <Modal show={show} onHide={handleCancelar} centered>
            <Modal.Header closeButton>
                <Modal.Title>
                    {initialValues ? "Editar Proyecto" : "Nuevo Proyecto IA"}
                </Modal.Title>
            </Modal.Header>

            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Modal.Body>

                    <FormRow label="Nombre del proyecto:" showFeedback>
                        <Form.Control
                            required
                            value={nombre}
                            placeholder="Ingrese el nombre del proyecto"
                            onChange={(e) => setNombre(e.target.value)}
                        />
                    </FormRow>

                    <FormRow label="Modelo de Video:" showFeedback>
                        <Form.Control
                            required
                            value={mVideo}
                            placeholder="ej: modelo_video_v1"
                            onChange={(e) => setMVideo(e.target.value)}
                        />
                    </FormRow>

                    <FormRow label="Modelo de Audio:" showFeedback>
                        <Form.Control
                            required
                            value={mAudio}
                            placeholder="ej: modelo_audio_v1"
                            onChange={(e) => setMAudio(e.target.value)}
                        />
                    </FormRow>

                    <FormRow label="¿Genera video de salida?" showFeedback>
                        <Form.Check
                            type="checkbox"
                            label="Sí"
                            checked={videoSalida}
                            onChange={(e) => setVideoSalida(e.target.checked)}
                        />
                    </FormRow>

                    <FormRow label="¿Usa ventanas de tiempo?" showFeedback>
                        <Form.Check
                            type="checkbox"
                            label="Sí"
                            checked={ventanasTiempo}
                            onChange={(e) => setVentanasTiempo(e.target.checked)}
                        />
                    </FormRow>

                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCancelar}>Cancelar</Button>
                    <Button type="submit">Guardar</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}

export default ModalNuevoProyecto;
