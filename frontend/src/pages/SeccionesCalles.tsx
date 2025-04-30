import Table from '../components/Table';
import { faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Row } from '@tanstack/react-table';
import { Container } from 'react-bootstrap';


const handleEdit = (calle: Calle) => {
    alert(`Editar calle: ${calle.nombre}`);
};
  
const handleDelete = (id: number) => {
   alert(`Eliminar calle con ID: ${id}`);
};
  
const columnas = [
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'pais', header: 'País' },
    { accessorKey: 'region', header: 'Región' },
    { accessorKey: 'comuna', header: 'Comuna' },
    { accessorKey: 'nombre', header: 'Nombre' },
    { accessorKey: 'app', header: 'App' },
    { accessorKey: 'tipo_via', header: 'Tipo Vía' },
    {
        header: 'Acciones',
        cell: ({ row }: { row: Row<Calle> }) => (
            <div className='d-flex gap-2'>
                <button className='bg-primary px-2 py-1 rounded border-0' onClick={() => handleEdit(row.original)}>
                    <FontAwesomeIcon color='white' icon={faPenToSquare} />
                </button>
                <button className='bg-danger px-2 py-1 rounded border-0' onClick={() => handleDelete(row.original.id)}>
                    <FontAwesomeIcon color='white' icon={faTrashCan} />
                </button>
            </div>
        ),
    },

  ];

const calles: Calle[] = [
    { id: 1, pais: 'Chile', region: 'Región de Los Ríos', comuna: 'Valdivia', nombre: 'Avenida Alemania', app: 'CadnaA', tipo_via: 'troncal' },
    { id: 2, pais: 'Chile', region: 'Región de Los Ríos', comuna: 'Valdivia', nombre: 'Picarte', app: 'NoiseModelling', tipo_via: 'troncal' },
    { id: 3, pais: 'Chile', region: 'Región de Los Ríos', comuna: 'Valdivia', nombre: 'Simpson', app: 'CadnaA', tipo_via: 'troncal' },
    { id: 4, pais: 'Chile', region: 'Región de Los Ríos', comuna: 'Valdivia', nombre: 'Av. Pedro Montt', app: 'NoiseModelling', tipo_via: 'troncal' },
    { id: 5, pais: 'Chile', region: 'Región de Los Ríos', comuna: 'Valdivia', nombre: 'Av. Circunvalación', app: 'CadnaA', tipo_via: 'troncal' },
    { id: 6, pais: 'Chile', region: 'Región de Los Ríos', comuna: 'Valdivia', nombre: 'Av. René Schneider', app: 'NoiseModelling', tipo_via: 'troncal' },
    { id: 7, pais: 'Chile', region: 'Región de Los Ríos', comuna: 'Valdivia', nombre: 'Av. Argentina', app: 'CadnaA', tipo_via: 'troncal' },
    { id: 8, pais: 'Chile', region: 'Región de Los Ríos', comuna: 'Valdivia', nombre: 'Arauco', app: 'NoiseModelling', tipo_via: 'troncal' },
    { id: 9, pais: 'Chile', region: 'Región de Los Ríos', comuna: 'Valdivia', nombre: 'Yerbas Buenas', app: 'CadnaA', tipo_via: 'troncal' },
    { id: 10, pais: 'Chile', region: 'Región de Los Ríos', comuna: 'Valdivia', nombre: 'Bueras', app: 'NoiseModelling', tipo_via: 'troncal' },
    { id: 11, pais: 'Chile', region: 'Región de Los Ríos', comuna: 'Valdivia', nombre: 'Av. Francia', app: 'CadnaA', tipo_via: 'troncal' },
    { id: 12, pais: 'Chile', region: 'Región de Los Ríos', comuna: 'Valdivia', nombre: 'Chacabuco', app: 'NoiseModelling', tipo_via: 'troncal' },
  ];

type Calle = {
    id: number;
    pais: string;
    region: string;
    comuna: string;
    nombre: string;
    app: "CadnaA" | "NoiseModelling";
    tipo_via: string;
};

function TablePage() {
    return (
        <>
            <Container className="w-75 my-5">
                <h1 className="d-flex justify-content-center mb-4">Secciones Calles</h1>
                <Table columns={columnas} data={calles} showNewButton={true}/>

            </Container>
        </>
    )
}

export default TablePage
