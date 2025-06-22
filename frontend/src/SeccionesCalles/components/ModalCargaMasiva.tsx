import { Modal, Form, Button } from "react-bootstrap";
import { useState, useEffect, FormEvent } from 'react'
import FormRow from "./FormRow";

interface Props {
    show: boolean;
    onClose: () => void;
    data: string[]; // cada string es el nombre de una ciudad
}

function ModalCargaMasiva ({show, onClose, data}: Props){
    const [validated, setValidated] = useState(false);

    const [pais, setPais] = useState('');
    const [ciudad, setCiudad] = useState('');
    const [localidad, setLocalidad] = useState('');
    const [archivo, setArchivo] = useState<File | null>(null);

    const [ciudades, setCiudades] = useState<string[]>(data); //setCiudades lo usare cuando exista una relacion entre ciudad y pais. Aparecerán solo las ciudades del pais seleccionado previamente


    const handleCancelar = () => {
        setPais('');
        setCiudad('');
        setLocalidad('');
        setArchivo(null);
        setValidated(false);
        onClose();
    }

    const handleGuardarYLimpiar = async () => {
        if(!archivo) return;

        const formData = new FormData()
        formData.append("file", archivo)
        formData.append("pais", pais)
        formData.append("ciudad", ciudad)
        formData.append("localidad", localidad)
        
        try{
            const response = await fetch("http://localhost:8001/csv/upload",{
                method: "POST",
                body: formData,
            });

            if(!response.ok){
                const error = await response.json();
                alert(`Error: ${error.detail}`);
                return;
            }

            const result = await response.json();
            alert(`Carga existosa: ${result.processed_rows} filas procesadas`)
        } catch (err){
            console.error(err)
            alert("Error al conectar con el servidor")
        }

        setPais('');
        setCiudad('');
        setLocalidad('');
        setArchivo(null);
        setValidated(false);
        onClose();
    }
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (!form.checkValidity() || !archivo) { //Si no es válido o no hay archivo subido, entra aquí
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
                    Carga Masiva de Secciones de Calle
                </Modal.Title>
            </Modal.Header>
                
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Modal.Body>
                    <FormRow label="País:" showFeedback>
                        <Form.Select required value={pais} onChange={(e) => setPais(e.target.value)}>
                            <option value={''}>Seleccione País</option>
                            <option>Chile</option>
                        </Form.Select>
                    </FormRow>
                    <FormRow label="Ciudad:" showFeedback>
                        <Form.Select required disabled={pais ==''} value={ciudad} onChange={(e) => setCiudad(e.target.value)}>
                            <option value={''}>Seleccione Ciudad</option>
                            {ciudades.map((r) => (
                                <option key={r}>{r}</option>
                            ))}
                        </Form.Select>
                    </FormRow>
                    <FormRow label="Localidad:" showFeedback>
                        <Form.Control required value={localidad} onChange={(e) => setLocalidad(e.target.value)}>

                        </Form.Control>
                    </FormRow>
                    {/* <FormRow label="Región:" showFeedback>
                        <Form.Select required disabled={pais ==''} value={region} onChange={(e) => setRegion(e.target.value)}>
                            <option value={''}>Seleccione Región</option>
                            {regiones.map((r) => (
                                <option key={r.region}>{r.region}</option>
                            ))}
                        </Form.Select>
                    </FormRow>
                    <FormRow label="Comuna:" showFeedback>
                        <Form.Select required disabled={region == ''} value={comuna} onChange={(e) => setComuna(e.target.value)}>
                            <option value={''}>Seleccione Comuna</option>
                            {comunas.map((c) => (
                                <option key={c}>{c}</option>
                            ))}
                        </Form.Select>
                    </FormRow> */}
                    <FormRow label="Subir archivo:" showFeedback>
                        <Form.Control
                            required
                            type='file'
                            accept=".csv"
                            onChange={(e) => {
                                const target = e.target as HTMLInputElement;
                                setArchivo(target.files?.[0] || null)
                            }}
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
export default ModalCargaMasiva