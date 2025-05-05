import { Modal, Button, Form } from "react-bootstrap";
import { useState, useEffect, FormEvent } from 'react'
import FormRow from "./FormRow";
import { Calle } from "../resources/types";

interface RegionData{
    region: string;
    comunas: string[];
}

interface Props {
    show: boolean;
    onClose: () => void;
    data: RegionData[];
    initialValues?: Calle;
    onSave: (calle: Calle) => void;
}

function ModalNuevaSeccionCalle ({show, onClose, data, initialValues, onSave}: Props){
    const [validated, setValidated] = useState(false);

    const [pais, setPais] = useState('');
    const [region, setRegion] = useState('');
    const [comuna, setComuna] = useState('');
    const [nombreCalle, setNombreCalle] = useState('');
    const [app, setApp] = useState('');
    const [tipoVia, setTipoVia] = useState('');

    const [regiones, setRegiones] = useState<RegionData[]>([]);
    const [comunas, setComunas] = useState<string[]>([]);

    // Carga los valores de la sección de calle que se quiere editar
    useEffect(() => {
        if (initialValues) {
            setPais(initialValues.pais);
            setRegion(initialValues.region);
            setComuna(initialValues.comuna);
            setNombreCalle(initialValues.nombre);
            setApp(initialValues.app);
            setTipoVia(initialValues.tipo_via);
        } else {
            setPais('');
            setRegion('');
            setComuna('');
            setNombreCalle('');
            setApp('');
            setTipoVia('');
        }
        setValidated(false);
    }, [initialValues, show]);

    // Si el País seleccionado es Chile, muestra las regiones de Chile
    useEffect(()=> {
        if(pais == 'Chile'){
            setRegiones(data)
        } else {
            setRegiones([]);
            setRegion('');
            setComuna('');
        }
    }, [pais, data]);

    // Muestra las comunas según la región que se haya seleccionado
    useEffect(() => {
        const selectedRegion = regiones.find((r) => r.region === region);
        if(selectedRegion){
            setComunas(selectedRegion.comunas);
        } else {
            setComunas([]);
        }
    }, [region, regiones]);

    const handleCancelar = () => {
        // Limpiar todos los campos
        setPais('');
        setRegion('');
        setComuna('');
        setNombreCalle('');
        setApp('');
        setTipoVia('');
        setValidated(false);
        onClose();
    }

    const handleGuardarYLimpiar = () => {
        const calle: Calle = {
            id: initialValues?.id ?? Date.now(),
            pais,
            region,
            comuna,
            nombre: nombreCalle,
            app,
            tipo_via: tipoVia
        }
        onSave(calle)
        // console.log({pais, region, comuna, nombreCalle, app, tipoVia});
        // Aqui se deberia manejar la logica para mandar a la BD (podemos unir esta funcion con la de handleSubmit)
        // Limpiar todos los campos
        setPais('');
        setRegion('');
        setComuna('');
        setNombreCalle('');
        setApp('');
        setTipoVia('');
        setValidated(false);
        onClose();
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

    return (
        <Modal show={show} onHide={handleCancelar} centered>
            <Modal.Header closeButton>
                <Modal.Title>
                    Nueva Sección de Calle
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
                    <FormRow label="Nombre de la Calle" showFeedback>
                        <Form.Control value={nombreCalle} placeholder="Ingrese el nombre de la calle" required onChange={(e) => setNombreCalle(e.target.value)}/>
                    </FormRow>
                    <FormRow label="App:" showFeedback>
                        <Form.Select required value={app} onChange={(e) => setApp(e.target.value)}>
                            <option value={''}>Seleccione Modelo de IA</option>
                            <option>CadnaA</option>
                            <option>NoiseModelling</option>
                        </Form.Select>
                    </FormRow>
                    <FormRow label="Tipo de Vía:" showFeedback>
                        <Form.Select required value={tipoVia} onChange={(e) => setTipoVia(e.target.value)}>
                            <option value={''}>Seleccione el tipo de vía</option>
                            <option>Troncal</option>
                            <option>Federal</option>
                        </Form.Select>
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
export default ModalNuevaSeccionCalle