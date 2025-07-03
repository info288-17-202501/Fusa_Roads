import Table from '../components/Table';
import { Container, Spinner, Alert, Row, Col, Form, Button, Badge } from 'react-bootstrap';
import { getColumns } from './resources/columns';
import { fetchProcesos } from './resources/api';
import { useState, useEffect, useRef } from 'react';
import { Proceso } from './resources/types';
import { DetallesModal } from './components/DetallesModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRefresh, faPlay, faPause } from '@fortawesome/free-solid-svg-icons';

// Tipo extendido para usar con el componente Table
type ProcesoConId = Proceso & { id: number };

function MonitorProcesos() {
    const [procesos, setProcesos] = useState<ProcesoConId[]>([]);
    const [procesoSeleccionado, setProcesoSeleccionado] = useState<Proceso | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isPolling, setIsPolling] = useState(true);
    const [pollingInterval, setPollingInterval] = useState(3); // segundos
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    
    const intervalRef = useRef<number | null>(null);

    // Función para cargar datos de la API
    const cargarProcesos = async (showSpinner = false) => {
        try {
            if (showSpinner) {
                setLoading(true);
            } else {
                setIsRefreshing(true);
            }
            setError(null);
            
            const data = await fetchProcesos();
            // Mapear los datos para incluir un id numérico requerido por el componente Table
            const datosConId: ProcesoConId[] = data.map((proceso, index) => ({
                ...proceso,
                id: index + 1 // Usar el índice como id numérico
            }));
            setProcesos(datosConId);
            setLastUpdate(new Date());
        } catch (err) {
            setError('Error al cargar los procesos: ' + (err instanceof Error ? err.message : 'Error desconocido'));
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    // Configurar polling
    useEffect(() => {
        // Limpiar intervalo anterior
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        if (isPolling && pollingInterval > 0) {
            intervalRef.current = setInterval(() => {
                cargarProcesos(false);
            }, pollingInterval * 1000);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isPolling, pollingInterval]);

    // Cargar datos inicial
    useEffect(() => {
        cargarProcesos(true);
    }, []);

    const togglePolling = () => {
        setIsPolling(!isPolling);
    };

    const handleRefresh = () => {
        cargarProcesos(false);
    };

    const handleIntervalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        if (value >= 1 && value <= 60) {
            setPollingInterval(value);
        }
    };

    const abrirModal = (proceso: ProcesoConId) => {
        // Pasar solo las propiedades del tipo Proceso original al modal
        const procesoOriginal: Proceso = {
            _id: proceso._id,
            pia_id: proceso.pia_id,
            fecha_inicio: proceso.fecha_inicio,
            estados: proceso.estados
        };
        setProcesoSeleccionado(procesoOriginal);
        setShowModal(true);
    };

    const cerrarModal = () => {
        setProcesoSeleccionado(null);
        setShowModal(false);
    };

    // Crear una función adaptadora que convierta el tipo
    const abrirModalAdaptado = (proceso: Proceso) => {
        const procesoConId = procesos.find(p => p._id === proceso._id);
        if (procesoConId) {
            abrirModal(procesoConId);
        }
    };

    const columns = getColumns(abrirModalAdaptado);

    if (loading) {
        return (
            <Container className="w-75 my-5 text-center">
                <h1 className="d-flex justify-content-center mb-4">
                    Monitor de Procesos de Proyecto
                </h1>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </Spinner>
            </Container>
        );
    }

    return (
        <Container className="w-75 my-5">
            <h1 className="d-flex justify-content-center mb-4">
                Monitor de Procesos de Proyecto
            </h1>

            {/* Panel de control */}
            <Row className="mb-3 align-items-center">
                <Col md={4}>
                    <div className="d-flex align-items-center gap-2">
                        <Button 
                            variant={isPolling ? "success" : "secondary"} 
                            size="sm"
                            onClick={togglePolling}
                        >
                            <FontAwesomeIcon icon={isPolling ? faPause : faPlay} />
                            {isPolling ? " Pausar" : " Iniciar"}
                        </Button>
                        <Button 
                            variant="primary" 
                            size="sm"
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                        >
                            <FontAwesomeIcon 
                                icon={faRefresh} 
                                spin={isRefreshing}
                            />
                            {isRefreshing ? " Actualizando..." : " Refresh"}
                        </Button>
                    </div>
                </Col>
                <Col md={4}>
                    <Form.Group>
                        <Form.Label className="small mb-1">Intervalo (segundos):</Form.Label>
                        <Form.Control
                            type="number"
                            size="sm"
                            min="1"
                            max="60"
                            value={pollingInterval}
                            onChange={handleIntervalChange}
                            style={{ width: '80px' }}
                        />
                    </Form.Group>
                </Col>
                <Col md={4} className="text-end">
                    <div className="small text-muted">
                        {lastUpdate && (
                            <>
                                Última actualización: {lastUpdate.toLocaleTimeString()}
                                <br />
                                <Badge bg={isPolling ? "success" : "secondary"}>
                                    {isPolling ? "Auto-refresh activo" : "Auto-refresh pausado"}
                                </Badge>
                            </>
                        )}
                    </div>
                </Col>
            </Row>

            {error && (
                <Alert variant="danger" className="mb-3">
                    {error}
                    <Button 
                        variant="outline-danger" 
                        size="sm" 
                        className="ms-2"
                        onClick={handleRefresh}
                    >
                        Reintentar
                    </Button>
                </Alert>
            )}

            <Table columns={columns} data={procesos} />

            <DetallesModal
                show={showModal}
                onClose={cerrarModal}
                proceso={procesoSeleccionado}
            />
        </Container>
    );
}

export default MonitorProcesos;
