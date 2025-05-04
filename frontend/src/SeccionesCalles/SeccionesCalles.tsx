import Table from '../components/Table';
import { Container } from 'react-bootstrap';
import { columns } from './resources/columns'
import { calles } from './resources/callesData';
import { useState } from 'react';
import ModalCargaMasiva from './components/ModalCargaMasiva';
import ModalNuevaSeccionCalle from './components/ModalNuevaSeccionCalle';
import regiones_comunas from './resources/comunas-regiones.json'


function SeccionesCalles() {
    const [showNuevo, setShowNuevo] = useState(false);
    const [showCargaMasiva, setShowCargaMasiva] = useState(false);

    return (
        <>
            <Container className="w-75 my-5">
                <h1 className="d-flex justify-content-center mb-4">Secciones Calles</h1>
                <Table
                    columns={columns}
                    data={calles}
                    showNewButton={true}
                    onClickNewButton={() => setShowNuevo(true)}
                    showCargaMasivaButton={true}
                    onClickCargaMasivaButton={() => setShowCargaMasiva(true)}
                />
            </Container>

            <ModalCargaMasiva
                show={showCargaMasiva}
                onClose={() => setShowCargaMasiva(false)}
                data={regiones_comunas.regiones}
            />

            <ModalNuevaSeccionCalle
                show={showNuevo}
                onClose={() => setShowNuevo(false)}
                data={regiones_comunas.regiones}
            />
        </>
    )
}

export default SeccionesCalles
