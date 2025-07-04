import { useState, useEffect, useMemo } from 'react';
import { Container } from 'react-bootstrap';
import Table from '../components/Table';
import ModalConfirmacion from '../components/ModalConfirmacion';
import ModalNuevoModelo from './components/ModalNuevoModelo';
import { Modelo, ModeloParaTabla } from './resources/types';
import { columns } from './resources/columns';

function ModelosIA() {
  const [modelos, setModelos] = useState<Modelo[]>([]);
  const [showNuevo, setShowNuevo] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editModelo, setEditModelo] = useState<Modelo>();
  const [showConfirmarModal, setShowConfirmarModal] = useState(false);
  const [message, setMessage] = useState<React.ReactNode>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Cargar modelos desde backend
  useEffect(() => {
    fetch("http://localhost:8003/mongo/datos")
      .then((res) => res.json())
      .then((data: Modelo[]) => {
        setModelos(data);
      })
      .catch((err) => console.error("Error al cargar modelos IA:", err));
  }, []);

  // Mapear modelos para incluir la propiedad id requerida por la tabla
  // useMemo para evitar recalcular en cada render
  const modelosParaTabla: ModeloParaTabla[] = useMemo(() => 
    modelos.map(modelo => ({
      ...modelo,
      id: modelo.id_modelo
    })), [modelos]
  );

  const handleEdit = (modelo: Modelo) => {
    setEditModelo(modelo);
    setShowEditModal(true);
  };

  const handleAskDelete = (id_modelo: number, nombre: string) => {
    setDeleteId(id_modelo);
    setMessage(
      <>
        ¿Estás seguro que deseas eliminar el modelo <strong>{nombre}</strong> con <strong>ID {id_modelo}</strong>?
      </>
    );
    setShowConfirmarModal(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteId === null) return;
    
    try {
      // Hacer la llamada DELETE al backend
      const res = await fetch(`http://localhost:8003/mongo/datos/${deleteId}`, {
        method: 'DELETE'
      });
      
      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }
      
      // Solo actualizar el estado si la eliminación fue exitosa
      setModelos((prev) => prev.filter((m) => m.id_modelo !== deleteId));
    } catch (error) {
      console.error("Error al eliminar modelo:", error);
      // Aquí podrías mostrar un mensaje de error al usuario
    } finally {
      setDeleteId(null);
      setShowConfirmarModal(false);
    }
  };

  const handleSaveNew = (nuevoModelo: Modelo) => {
    setModelos((prev) => [...prev, nuevoModelo]);
    setShowNuevo(false);
  };

  const handleSaveEdit = (updatedModelo: Modelo) => {
    setModelos((prev) =>
      prev.map((m) => (m.id_modelo === updatedModelo.id_modelo ? updatedModelo : m))
    );
    setEditModelo(undefined);
    setShowEditModal(false);
  };

  return (
    <>
      <Container className="w-75 my-5">
        <h1 className="d-flex justify-content-center mb-4">Modelos IA</h1>
        <Table
          columns={columns(handleAskDelete, handleEdit)}
          data={modelosParaTabla}
          showNewButton
          onClickNewButton={() => setShowNuevo(true)}
        />
      </Container>

      <ModalNuevoModelo
        show={showNuevo}
        onClose={() => setShowNuevo(false)}
        onSave={handleSaveNew}
      />

      <ModalNuevoModelo
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        initialValues={editModelo}
        onSave={handleSaveEdit}
      />

      <ModalConfirmacion
        show={showConfirmarModal}
        onClose={() => setShowConfirmarModal(false)}
        onConfirm={handleConfirmDelete}
        message={message}
      />
    </>
  );
}

export default ModelosIA;