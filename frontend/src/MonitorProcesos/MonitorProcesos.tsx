import Table from '../components/Table';
import { Container } from 'react-bootstrap';
import { columns } from './resources/columns'
import { procesosProyecto as procesosData } from './resources/procesosData';
import { useState } from 'react';
import { ProcesoProyecto } from './resources/types';


function MonitorProcesos() {
    const [procesos, setProcesos] = useState(procesosData)
    

    return (
        <Container className="w-75 my-5">
            <h1 className="d-flex justify-content-center mb-4">
                Monitor de Procesos de Proyecto
            </h1>
            <Table
                columns={columns}
                data={procesos}
            />
        </Container>
    )
}

export default MonitorProcesos 