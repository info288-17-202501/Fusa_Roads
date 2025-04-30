import Table from '../components/Table';
import { Container } from 'react-bootstrap';
import { columns } from './resources/columns'
import { calles } from './resources/callesData';

function SeccionesCalles() {
    return (
        <>
            <Container className="w-75 my-5">
                <h1 className="d-flex justify-content-center mb-4">Secciones Calles</h1>
                <Table columns={columns} data={calles} showNewButton={true}/>
            </Container>
        </>
    )
}

export default SeccionesCalles
