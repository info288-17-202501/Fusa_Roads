import { Modal, Button, Form } from "react-bootstrap";
import { useState, useEffect, FormEvent } from 'react'
import FormRow from "./FormRow";
import { CalleExtendida, Ciudad, Pais, TipoVia } from "../resources/types";

interface Props {
    show: boolean;
    onClose: () => void;
    onSave: (calle: CalleExtendida) => void;
    seccionAEditar?: CalleExtendida;
}

function getIdFromNombre(nombre: string, lista: { id: number, nombre: string }[]): string {
    const item = lista.find(e => e.nombre === nombre);
    return item ? String(item.id) : '';
}

function ModalNuevaSeccionCalle ({show, onClose, seccionAEditar, onSave}: Props){
    const [validated, setValidated] = useState(false);

    const [pais, setPais] = useState('');
    const [ciudad, setCiudad] = useState('');
    const [localidad, setLocalidad] = useState('');
    const [nombreCalle, setNombreCalle] = useState('');
    const [nombreSeccionCalle, setNombreSeccionCalle] = useState('');
    const [app, setApp] = useState('');
    const [tipoVia, setTipoVia] = useState('');

    const [paises, setPaises] = useState<Pais[]>([]);
    const [ciudades, setCiudades] = useState<Ciudad[]>([]);
    const [tiposVia, setTiposVia] = useState<TipoVia[]>([]);

    // Carga los valores de la sección de calle que se quiere editar
    useEffect(() => {
        if (!seccionAEditar) {
            setPais('');
            setCiudad('');
            setLocalidad('');
            setNombreCalle('');
            setNombreSeccionCalle('');
            setApp('');
            setTipoVia('');
            setValidated(false);
            return;
        }

        const paisId = getIdFromNombre(seccionAEditar.nombre_pais, paises);
        const ciudadId = getIdFromNombre(seccionAEditar.nombre_ciudad, ciudades);

        setPais(String(paisId));
        setCiudad(String(ciudadId));
        setLocalidad(seccionAEditar.nombre_localidad);
        setNombreCalle(seccionAEditar.nombre_calle_localidad);
        setNombreSeccionCalle(seccionAEditar.nombre_seccion_calle);
        setApp(seccionAEditar.app);
        setTipoVia(getIdFromNombre(seccionAEditar.nombre_tipo_via, tiposVia));
        setValidated(false);
    }, [seccionAEditar]);


    useEffect(() => {
        fetchPaises();
        fetchTiposVia();
    }, []);

    const fetchPaises = async () => {
        const response = await fetch('http://localhost:8001/ubicacion/paises');
        const data = await response.json();
        setPaises(data);
    };

    const handlePaisChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = parseInt(e.target.value);
        setPais(e.target.value);
        setCiudad('');
        setLocalidad('');
        setCiudades([]);
        if (!isNaN(selectedId)) fetchCiudades(selectedId);
    };

    const fetchCiudades = async (idPais: number) => {
        const response = await fetch(`http://localhost:8001/ubicacion/ciudades/${idPais}`);
        const data = await response.json();
        setCiudades(data);
    };

    const fetchTiposVia = async () => {
        const response = await fetch('http://localhost:8001/secciones/tipos-via');
        const data = await response.json();
        setTiposVia(data);
    }


    const handleCancelar = () => {
        // Limpiar todos los campos
        setPais('');
        setCiudad('');
        setLocalidad('');
        setNombreCalle('');
        setApp('');
        setTipoVia('');
        setValidated(false);
        onClose();
    }

    const handleGuardarYLimpiar = () => {
        const calle: CalleExtendida = {
            id: seccionAEditar?.id ?? Date.now(),
            nombre_pais: pais,
            nombre_ciudad: ciudad,
            nombre_localidad: localidad,
            nombre_calle_localidad: nombreCalle,
            nombre_seccion_calle: nombreSeccionCalle,
            app,
            nombre_tipo_via: tipoVia
        }
        onSave(calle)
        setPais('');
        setCiudad('');
        setLocalidad('');
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
                    {seccionAEditar ? 'Editar Sección de Calle' : 'Nueva Sección de Calle'}
                </Modal.Title>
            </Modal.Header>
            
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Modal.Body>
                    <FormRow label="País:" showFeedback>
                        <Form.Select required value={pais} onChange={handlePaisChange} disabled={!!seccionAEditar}>
                            <option value={''}>Seleccione País</option>
                            {paises.map((p: Pais) => (
                                <option key={p.id} value={p.id}>{p.nombre}</option>
                            ))}
                        </Form.Select>
                    </FormRow>
                    <FormRow label="Ciudad:" showFeedback>
                        <Form.Select required disabled={!!seccionAEditar || !pais} value={ciudad} onChange={(e) => setCiudad(e.target.value)}>
                            <option value={''}>Seleccione Ciudad</option>
                            {ciudades.map((c: Ciudad) => (
                                <option key={c.id} value={c.id}>{c.nombre}</option>
                            ))}
                        </Form.Select>
                    </FormRow>
                    <FormRow label="Localidad:" showFeedback>
                        <Form.Control required value={localidad} onChange={(e) => setLocalidad(e.target.value)}>

                        </Form.Control>
                    </FormRow>
                    <FormRow label="Nombre de la Calle" showFeedback>
                        <Form.Control value={nombreCalle} placeholder="Ingrese el nombre de la calle" required onChange={(e) => setNombreCalle(e.target.value)}/>
                    </FormRow>
                    <FormRow label="Nombre de la Sección de Calle" showFeedback>
                        <Form.Control value={nombreSeccionCalle} placeholder="Ingrese el nombre de la sección de la calle" required onChange={(e) => setNombreSeccionCalle(e.target.value)}/>
                    </FormRow>
                    <FormRow label="App:" showFeedback>
                        <Form.Select required value={app} onChange={(e) => setApp(e.target.value)}>
                            <option value={''}>Seleccione Modelo de IA</option>
                            <option value={'cadnaa'}>CadnaA</option>
                            <option value={'noisemodelling'}>NoiseModelling</option>
                        </Form.Select>
                    </FormRow>
                    <FormRow label="Tipo de Vía:" showFeedback>
                        <Form.Select required value={tipoVia} onChange={(e) => setTipoVia(e.target.value)}>
                            <option value={''}>Seleccione el tipo de vía</option>
                            {tiposVia.map((tv: TipoVia) => (
                                <option key={tv.id} value={tv.id}>{tv.nombre}</option>
                            ))}
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