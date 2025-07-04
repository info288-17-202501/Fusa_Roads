import { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { ModeloIA } from './resources/types';
import { columns } from './resources/columns';
import Table from '../components/Table';
import ModalNuevoModelo from './components/ModalNuevoModelo';
import ModalConfirmacion from '../components/ModalConfirmacion';

function ModelosIA() {
  const [modelos, setModelos] = useState<ModeloIA[]>([]);
  const [showNuevo, setShowNuevo] = useState(false);
  const [showConfirmarModal, setShowConfirmarModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editModelo, setEditModelo] = useState<ModeloIA | null>(null);
  const [message, setMessage] = useState<React.ReactNode>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8003/mongo/datos")
      .then((res) => res.json())
      .then((data: ModeloIA[]) => {
        setModelos(data);
      })
      .catch((err) => console.error("Error al cargar modelos IA:", err));
  }, []);

  const handleEdit = (modelo: ModeloIA) => {
    setEditModelo(modelo);
    setShowEditModal(true);
  };

  const handleAskDelete = (id_modelo: number, nombre: string, mongoId: string) => {
    setDeleteId(mongoId);
    setMessage(
      <>
        ¿Estás seguro que deseas eliminar el modelo <strong>{nombre}</strong> con <strong>ID {id_modelo}</strong>?
      </>
    );
    setShowConfirmarModal(true);
  };

const handleConfirmDelete = async () => {
  if (deleteId === null) return;

  const modelo = modelos.find(m => m._id === deleteId);
  if (!modelo) return;

  try {
    const rutaCompleta = modelo.ruta;
    const partes = rutaCompleta.split('/');
    const fileName = partes.pop() || '';
    const folder = partes.join('/');

    const formData = new FormData();
    formData.append("file_names", fileName);
    formData.append("folder", folder);
    formData.append("bucket", "fusaroads");

    // 👇 Asigna la respuesta a resMinio
    const resMinio = await fetch("http://localhost:8003/minio/modelo", {
      method: "DELETE",
      body: formData
    });

    if (!resMinio.ok) {
      const err = await resMinio.text();
      throw new Error(`Error al borrar archivo en MinIO: ${err}`);
    }

    // ✅ Luego borrar en Mongo
    const resMongo = await fetch(`http://localhost:8003/mongo/datos/${deleteId}`, {
      method: "DELETE"
    });

    if (!resMongo.ok) {
      throw new Error("Error al borrar modelo en Mongo");
    }

    setModelos(prev => prev.filter(m => m._id !== deleteId));
    setShowConfirmarModal(false);
    setDeleteId(null);
  } catch (error) {
    alert("Error al borrar modelo o archivo: " + (error as Error).message);
  }
};



  return (
    <>
      <Container className="w-75 my-5">
        <h1 className="text-center mb-4">Modelos IA</h1>

        <Table
          columns={columns(handleAskDelete, handleEdit)}
          data={modelos.map((m) => ({ ...m, id: m.id_modelo }))}
          showNewButton
          onClickNewButton={() => setShowNuevo(true)}
        />
      </Container>

      <ModalNuevoModelo
        show={showNuevo}
        onClose={() => setShowNuevo(false)}
        onSave={(nuevo) => {
          setModelos((prev) => [...prev, nuevo]);
          setShowNuevo(false);
        }}
      />

      <ModalNuevoModelo
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        initialValues={editModelo || undefined}
        onSave={(updated) => {
          setModelos((prev) =>
            prev.map((m) =>
              m.id_modelo === updated.id_modelo ? updated : m
            )
          );
          setShowEditModal(false);
          setEditModelo(null);
        }}
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
