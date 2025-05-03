import { Col, Modal, Row, Form, Button } from "react-bootstrap";
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

function ModalCargaMasiva ({show, onClose, data}: Props){
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
        <Modal show={show} onHide={handleCancelar} centered>
            <Modal.Header closeButton>
                <Modal.Title>
                    Carga Masiva de Secciones de Calle
                </Modal.Title>
            </Modal.Header>
            
            <Modal.Body>
                <Row className='d-flex align-items-center justify-content-center mb-3'>
                    <Col lg={2}>
                        <Form.Label>País:</Form.Label>
                    </Col>
                    <Col lg={10}>
                        <Form.Select value={pais} onChange={(e) => setPais(e.target.value)}>
                            <option value={''}>Seleccione País</option>
                            <option>Chile</option>
                        </Form.Select>
                    </Col>
                </Row>
                <Row className='d-flex align-items-center justify-content-center mb-3'>
                    <Col lg={2}>
                        <Form.Label>Región:</Form.Label>
                    </Col>
                    <Col lg={10}>
                        <Form.Select disabled={pais ==''} value={region} onChange={(e) => setRegion(e.target.value)}>
                            <option value={''}>Seleccione Región</option>
                            {regiones.map((r) => (
                                <option key={r.region}>{r.region}</option>
                            ))}
                        </Form.Select>
                    </Col>
                </Row>
                <Row className='d-flex align-items-center justify-content-center mb-3'>
                    <Col lg={2}>
                        <Form.Label>Comuna:</Form.Label>
                    </Col>
                    <Col lg={10}>
                        <Form.Select disabled={region == ''} value={comuna} onChange={(e) => setComuna(e.target.value)}>
                            <option value={''}>Seleccione Comuna</option>
                            {comunas.map((c) => (
                                <option key={c}>{c}</option>
                            ))}
                        </Form.Select>
                    </Col>
                </Row>
                <Row className='d-flex align-items-center'>
                    <Form.Group>
                        <Form.Label>Subir archivo</Form.Label>
                        <Form.Control type='file'/>
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
export default ModalCargaMasiva