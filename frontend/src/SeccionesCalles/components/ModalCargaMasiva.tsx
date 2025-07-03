import { Modal, Form, Button } from "react-bootstrap";
import { useState, useEffect, FormEvent } from 'react'
import FormRow from "./FormRow";

interface Pais {
    id: number;
    nombre: string;
}

interface Ciudad {
    id: number;
    nombre: string;
    pais_id: number;
}
interface Props {
    show: boolean;
    onClose: () => void;
    data: string[]; // cada string es el nombre de una ciudad
}

function ModalCargaMasiva ({show, onClose}: Props){
    const [validated, setValidated] = useState(false);

    const [localidad, setLocalidad] = useState('');
    const [archivo, setArchivo] = useState<File | null>(null);

    const [paises, setPaises] = useState<Pais[]>([]);
    const [ciudades, setCiudades] = useState<Ciudad[]>([]); //setCiudades lo usare cuando exista una relacion entre ciudad y pais. Aparecerán solo las ciudades del pais seleccionado previamente
    const [paisId, setPaisId] = useState('');
    const [ciudadId, setCiudadId] = useState('');

    useEffect(() => {
        fetch("http://localhost:8001/csv/paises")
            .then(res => res.json())
            .then(setPaises)
            .catch(err => console.error("Error al cargar países", err));
    }, []);

    useEffect(() => {
        if (paisId === '') {
            setCiudades([]);
            setCiudadId('');
            return;
        }

        fetch(`http://localhost:8001/csv/ciudades?id_pais=${paisId}`)
            .then(res => res.json())
            .then(setCiudades)
            .catch(err => console.error("Error al cargar ciudades", err));
    }, [paisId]);

    const handleCancelar = () => {
        setPaisId('');
        setCiudadId('');
        setLocalidad('');
        setArchivo(null);
        setValidated(false);
        onClose();
    }

    const handleGuardarYLimpiar = async () => {
        if(!archivo) return;

        const formData = new FormData()
        formData.append("file", archivo)
        formData.append("id_pais", paisId)
        formData.append("id_ciudad", ciudadId)
        formData.append("localidad", localidad)
        for (const [key, value] of formData.entries()) {
            console.log(key, value);
        }
        
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

        setPaisId('');
        setCiudadId('');
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
                        <Form.Select required value={paisId} onChange={(e) => setPaisId(e.target.value)}>
                            <option value="">Seleccione País</option>
                            {paises.map((p) => (
                                <option key={p.id} value={p.id}>{p.nombre}</option>
                            ))}
                        </Form.Select>
                    </FormRow>
                    <FormRow label="Ciudad:" showFeedback>
                        <Form.Select required disabled={paisId ==''} value={ciudadId} onChange={(e) => setCiudadId(e.target.value)}>
                            <option value="">Seleccione Ciudad</option>
                            {ciudades.map((c) => (
                                <option key={c.id} value={c.id}>{c.nombre}</option>
                            ))}
                        </Form.Select>
                    </FormRow>
                    <FormRow label="Localidad:" showFeedback>
                        <Form.Control required value={localidad} onChange={(e) => setLocalidad(e.target.value)}>

                        </Form.Control>
                    </FormRow>
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