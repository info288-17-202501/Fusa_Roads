import Table from '../components/Table';
import { Container } from 'react-bootstrap';
import { getColumns } from './resources/columns';
import { procesosData as procesosData } from './resources/procesosData';
import { useState } from 'react';
import { Proceso } from './resources/types';
import { DetallesModal } from './components/DetallesModal';

function MonitorProcesos() {
    const [procesos, setProcesos] = useState(procesosData);
    const [procesoSeleccionado, setProcesoSeleccionado] = useState<Proceso | null>(null);
    const [showModal, setShowModal] = useState(false);

    const abrirModal = (proceso: Proceso) => {
        setProcesoSeleccionado(proceso);
        setShowModal(true);
    };

    const cerrarModal = () => {
        setProcesoSeleccionado(null);
        setShowModal(false);
    };

    const columns = getColumns(abrirModal); // 👈 Pasamos función al generador

    return (
        <Container className="w-75 my-5">
            <h1 className="d-flex justify-content-center mb-4">
                Monitor de Procesos de Proyecto
            </h1>
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
