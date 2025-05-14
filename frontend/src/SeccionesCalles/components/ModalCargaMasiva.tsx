import { Modal, Form, Button } from "react-bootstrap";
import { useState, useEffect, FormEvent } from 'react'
import FormRow from "./FormRow";

interface RegionData{
    region: string;
    comunas: string[];
}

interface Props {
    show: boolean;
    onClose: () => void;
    data: RegionData[];
}

function ModalCargaMasiva ({show, onClose, data}: Props){
    const [validated, setValidated] = useState(false);

    const [pais, setPais] = useState('');
    const [region, setRegion] = useState('');
    const [comuna, setComuna] = useState('');
    const [archivo, setArchivo] = useState<File | null>(null);

    const [regiones, setRegiones] = useState<RegionData[]>([]);
    const [comunas, setComunas] = useState<string[]>([]);

    useEffect(()=> {
        if(pais == 'Chile'){
            setRegiones(data)
        } else {
            setRegiones([]);
            setRegion('');
            setComuna('');
        }
    }, [pais, data]);

    useEffect(() => {
        const selectedRegion = regiones.find((r) => r.region === region);
        if(selectedRegion){
            setComunas(selectedRegion.comunas);
        } else {
            setComunas([]);
        }
    }, [region, regiones]);

    const handleCancelar = () => {
        setPais('');
        setRegion('');
        setComuna('');
        setArchivo(null);
        setValidated(false);
        onClose();
    }

    const handleGuardarYLimpiar = () => {
        console.log({pais, region, comuna, archivo});
        // Aqui se deberia manejar la logica para mandar a la BD (podemos unir esta funcion con la de handleSubmit)
        // Limpiar todos los campos
        setPais('');
        setRegion('');
        setComuna('');
        setArchivo(null)
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
                    <FormRow label="Región:" showFeedback>
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