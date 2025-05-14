import { Modal, Button, Form } from "react-bootstrap";
import { useState, useEffect, FormEvent } from 'react'
import FormRow from "../../components/FormRow";
import { Modelo } from "../resources/types";


interface Props {
    show: boolean;
    onClose: () => void;
    initialValues?: Modelo;
    onSave: (modelo: Modelo) => void;
}

function ModalNuevoModelo ({show, onClose, initialValues, onSave}: Props){
    const [validated, setValidated] = useState(false);

    const [nombre, setNombre] = useState('');
    const [tipo, setTipo] = useState('');
    const [ruta, setRuta] = useState('modelos/');
    const [descripcion, setDescripcion] = useState('');
    const [archivo, setArchivo] = useState<File | null>(null);

    // Carga los valores del modelo que se quiere editar
    useEffect(() => {
        if (initialValues) {
            setNombre(initialValues.nombre);
            setTipo(initialValues.tipo);
            setRuta(initialValues.ruta);
            setDescripcion(initialValues.descripcion);
            
        } else {
            setNombre('');
            setTipo('');
            setRuta('');
            setDescripcion('');
        }
        setValidated(false);
    }, [initialValues, show]);

    const handleCancelar = () => {
        // Limpiar todos los campos
        setNombre('');
        setTipo('');
        setRuta('');
        setDescripcion('');
        setArchivo(null);
        setValidated(false);
        onClose();
    }

    const handleGuardarYLimpiar = () => {
        const modelo: Modelo = {
            id: initialValues?.id ?? Date.now(),
            nombre,
            tipo: 'Video',
            ruta,
            descripcion
        }
        onSave(modelo)
        // console.log({pais, region, comuna, nombreCalle, app, tipoVia});
        // Aqui se deberia manejar la logica para mandar a la BD (podemos unir esta funcion con la de handleSubmit)
        // Limpiar todos los campos
        setNombre('');
        setTipo('');
        setRuta('');
        setDescripcion('');
        setArchivo(null);
        setValidated(false);
        onClose();
    }

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (!form.checkValidity()) { //Si no es válido, entra aquí
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
        "modelos/pruebas/",
    ];

    return (
        <Modal show={show} onHide={handleCancelar} centered>
            <Modal.Header closeButton>
                <Modal.Title>
                    Nueva Sección de Calle
                </Modal.Title>
            </Modal.Header>
            
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Modal.Body>
                    
                <FormRow label="Subir archivo:" showFeedback>
                        <Form.Control
                            required
                            type='file'
                            accept=".pt"
                            onChange={(e) => {
                                const target = e.target as HTMLInputElement;
                                const file = target.files?.[0] || null
                                setArchivo(file)

                                if (file && !nombre) {
                                    const nombreSinExtension = file.name.replace(/\.[^/.]+$/, "");
                                    setNombre(nombreSinExtension);
                                    setRuta('modelos/' + file.name)
                                }
                            }}
                        />
                    </FormRow>

                    <FormRow label="Nombre del modelo:" showFeedback>
                        <Form.Control value={nombre} placeholder="Ingrese el nombre del modelo" required onChange={(e) => setNombre(e.target.value)}/>
                    </FormRow>
                    
                    <FormRow label="Ruta destino en MinIO:" showFeedback>
  <Form.Select
    value={ruta}
    onChange={(e) => setRuta(e.target.value)}
    required
  >
    <option value="">Seleccione una ruta</option>
    {rutasMinio.map((ruta, idx) => (
      <option key={idx} value={ruta}>
        {ruta}
      </option>
    ))}
  </Form.Select>
</FormRow>

                    <FormRow label="Tipo:" showFeedback>
                        <Form.Select aria-label="Selecciones el tipo de modelo" required value={tipo} onChange={(e) => setTipo(e.target.value)}>
                            <option value={''}>Seleccione el tipo de Modelo de IA</option>
                            <option>Audio</option>
                            <option>Video</option>
                        </Form.Select>
                    </FormRow>
                    <FormRow label="Descripción:" showFeedback>
                        <Form.Control as="textarea" value={descripcion} placeholder="Ingrese una descripción del modelo" required onChange={(e) => setDescripcion(e.target.value)}/>
                    </FormRow>

                    
                
                </Modal.Body>

                <Modal.Footer>
                    <Button variant='secondary' onClick={handleCancelar}>Cancelar</Button>
                    <Button type="submit">Guardar</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    )
}
export default ModalNuevoModelo






