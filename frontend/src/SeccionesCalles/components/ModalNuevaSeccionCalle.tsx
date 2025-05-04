import { Modal, Button, Row, Form } from "react-bootstrap";
import { useState, useEffect } from 'react'

interface RegionData{
    region: string;
    comunas: string[];
}

interface Props {
    show: boolean;
    onClose: () => void;
    data: RegionData[];
}

function ModalNuevaSeccionCalle ({show, onClose, data}: Props){
    const [pais, setPais] = useState('');
    const [region, setRegion] = useState('');
    const [comuna, setComuna] = useState('');

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
        // Dejar archivo vació
        onClose();
    }

    const handleGuardar = () => {
        console.log({pais, region, comuna});
        onClose();
    }

    return (
        <Modal show={show} onHide={handleCancelar} centered scrollable>
            <Modal.Header closeButton>
                <Modal.Title>
                    Nueva Sección de Calle
                </Modal.Title>
            </Modal.Header>
            
            <Modal.Body>
                <Row className='justify-content-center mb-3'>
                    <Form.Group className="w-75">    
                        <Form.Label>País:</Form.Label>
                        <Form.Select value={pais} onChange={(e) => setPais(e.target.value)}>
                            <option value={''}>Seleccione País</option>
                            <option>Chile</option>
                        </Form.Select>
                    </Form.Group>
                </Row>
                <Row className='justify-content-center mb-3'>
                    <Form.Group className="w-75">
                        <Form.Label>Región:</Form.Label>
                        <Form.Select disabled={pais ==''} value={region} onChange={(e) => setRegion(e.target.value)}>
                            <option value={''}>Seleccione Región</option>
                            {regiones.map((r) => (
                                <option key={r.region}>{r.region}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Row>
                <Row className='justify-content-center mb-3'>
                    <Form.Group className="w-75">
                        <Form.Label>Comuna:</Form.Label>
                        <Form.Select disabled={region == ''} value={comuna} onChange={(e) => setComuna(e.target.value)}>
                            <option value={''}>Seleccione Comuna</option>
                            {comunas.map((c) => (
                                <option key={c}>{c}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Row>
                <Row className='justify-content-center mb-3'>
                    <Form.Group className="w-75">
                        <Form.Label>Nombre Calle:</Form.Label>
                        <Form.Control/>
                    </Form.Group>
                </Row>
                <Row className='justify-content-center mb-3'>
                    <Form.Group className="w-75">    
                        <Form.Label>App:</Form.Label>
                        <Form.Select>
                            <option value={''}>Seleccione Modelo de IA</option>
                            <option>CadnaA</option>
                            <option>NoiseModelling</option>
                        </Form.Select>
                    </Form.Group>
                </Row>
                <Row className='justify-content-center mb-3'>
                    <Form.Group className="w-75">    
                        <Form.Label>Tipo de Vía:</Form.Label>
                        <Form.Select>
                            <option value={''}>Seleccione el tipo de vía</option>
                            <option>Troncal</option>
                            <option>Federal</option>
                        </Form.Select>
                    </Form.Group>
                </Row>
                
            </Modal.Body>

            <Modal.Footer>
                <Button variant='secondary' onClick={handleCancelar}>Cancelar</Button>
                <Button variant='primary' onClick={handleGuardar}>Guardar</Button>
            </Modal.Footer>
        </Modal>
    )
}
export default ModalNuevaSeccionCalle