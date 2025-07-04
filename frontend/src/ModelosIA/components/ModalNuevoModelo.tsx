import { Modal, Button, Form, Alert } from "react-bootstrap";
import { useState, useEffect, FormEvent } from 'react';
import FormRow from "../../components/FormRow";
import { ModeloIA } from "../resources/types";

interface Props {
    show: boolean;
    onClose: () => void;
    initialValues?: ModeloIA;
    onSave: (modelo: ModeloIA) => void;
}

function ModalNuevoModelo({ show, onClose, initialValues, onSave }: Props) {
    const [validated, setValidated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [nombre, setNombre] = useState('');
    const [tipo, setTipo] = useState('');
    const [ruta, setRuta] = useState('');
    const [descripcion, setDescripcion] = useState('');

    const isEditing = Boolean(initialValues);

    useEffect(() => {
        if (initialValues) {
            setNombre(initialValues.nomb_modelo);
            setTipo(initialValues.tipo_modelo);
            setRuta(initialValues.ruta);
            setDescripcion(initialValues.descripcion);
        } else {
            setNombre('');
            setTipo('');
            setRuta('');
            setDescripcion('');
        }
        setValidated(false);
        setError(null);
    }, [initialValues, show]);

    const handleCancelar = () => {
        setNombre('');
        setTipo('');
        setRuta('');
        setDescripcion('');
        setValidated(false);
        setError(null);
        setLoading(false);
        onClose();
    };

    const handleGuardarYLimpiar = async () => {
  setLoading(true);
  setError(null);

  const modelo: ModeloIA = {
    id_modelo: initialValues?.id_modelo ?? Date.now(),
    nomb_modelo: nombre,
    tipo_modelo: tipo as 'a' | 'v',
    flag_vigente: 'S',
    ruta,
    descripcion,
    _id: initialValues?._id
  };

  try {
    const url = isEditing
      ? `http://localhost:8003/mongo/datos/${initialValues!._id}`
      : "http://localhost:8003/mongo/datos";

    const method = isEditing ? 'PUT' : 'POST';

    // ❌ Evitar enviar el _id en el body
    const { _id, ...modeloSinId } = modelo;

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(modeloSinId),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.detail || `Error ${res.status}: ${res.statusText}`);
    }

    const data: ModeloIA = await res.json();
    onSave(data);
    handleCancelar();
  } catch (error) {
    console.error("Error al guardar modelo:", error);
    setError(error instanceof Error ? error.message : 'Error desconocido al guardar');
  } finally {
    setLoading(false);
  }
};


    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (!form.checkValidity()) {
            event.stopPropagation();
            setValidated(true);
            return;
        }
        setValidated(true);
        handleGuardarYLimpiar();
    };

    const rutasMinio = [
        "modelos/audio/pann",
        "modelos/video/yolo",
        "modelos/pruebas/"
    ];

    return (
        <Modal show={show} onHide={handleCancelar} centered>
            <Modal.Header closeButton>
                <Modal.Title>
                    {isEditing ? 'Editar Modelo IA' : 'Nuevo Modelo IA'}
                </Modal.Title>
            </Modal.Header>

            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Modal.Body>
                    {error && (
                        <Alert variant="danger" className="mb-3">
                            {error}
                        </Alert>
                    )}

                    <FormRow label="Nombre del modelo:" showFeedback>
                        <Form.Control
                            value={nombre}
                            placeholder="Ingrese el nombre del modelo"
                            required
                            disabled={loading}
                            onChange={(e) => setNombre(e.target.value)}
                        />
                    </FormRow>

                    <FormRow label="Ruta destino en MinIO:" showFeedback>
                        <Form.Select
                            value={ruta}
                            onChange={(e) => setRuta(e.target.value)}
                            required
                            disabled={loading}
                        >
                            <option value="">Seleccione una ruta</option>
                            {rutasMinio.map((rutaOption, idx) => (
                                <option key={idx} value={rutaOption}>
                                    {rutaOption}
                                </option>
                            ))}
                        </Form.Select>
                    </FormRow>

                    <FormRow label="Tipo:" showFeedback>
                        <Form.Select
                            required
                            value={tipo}
                            onChange={(e) => setTipo(e.target.value)}
                            disabled={loading}
                        >
                            <option value="">Seleccione el tipo de IA</option>
                            <option value="a">Audio</option>
                            <option value="v">Video</option>
                        </Form.Select>
                    </FormRow>

                    <FormRow label="Descripción:" showFeedback>
                        <Form.Control
                            as="textarea"
                            value={descripcion}
                            placeholder="Ingrese una descripción del modelo"
                            required
                            disabled={loading}
                            onChange={(e) => setDescripcion(e.target.value)}
                            rows={3}
                        />
                    </FormRow>

                </Modal.Body>

                <Modal.Footer>
                    <Button 
                        variant='secondary' 
                        onClick={handleCancelar}
                        disabled={loading}
                    >
                        Cancelar
                    </Button>
                    <Button 
                        type="submit" 
                        disabled={loading}
                    >
                        {loading ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Guardar')}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}

export default ModalNuevoModelo;