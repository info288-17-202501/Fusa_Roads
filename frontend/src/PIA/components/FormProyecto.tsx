// FORMULARIO PARA CREAR UN PROYECTO DE PIA
import { FormEvent, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import FormRow from '../../components/FormRow';
import { ProyectoIA } from '../resources/types';

type Props = {
    data: ProyectoIA;
    onSave: (data: ProyectoIA) => void;
    onCancel: () => void;
    onShowVideos: () => void;
};

export default function FormProyecto({ data, onSave, onCancel, onShowVideos }: Props) {
    const [validated, setValidated] = useState(false);
    const [formData, setFormData] = useState<ProyectoIA>(data);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setValidated(true);
        if (!formData.nombre_proyecto || !formData.modelo_audio || !formData.modelo_video) return;
        onSave(formData);
    };

    const handleChange = (field: keyof ProyectoIA, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <FormRow label="Nombre del proyecto:" showFeedback>
                <Form.Control
                    required
                    value={formData.nombre_proyecto}
                    onChange={(e) => handleChange('nombre_proyecto', e.target.value)}
                    placeholder="Ingrese el nombre del proyecto"
                />
            </FormRow>

            <FormRow label="Modelo de Video:" showFeedback>
                <Form.Control
                    disabled={true}
                    required
                    value={formData.modelo_video}
                    onChange={(e) => handleChange('modelo_video', e.target.value)}
                    placeholder="ej: modelo_video_v1"
                />
            </FormRow>

            <FormRow label="Modelo de Audio:" showFeedback>
                <Form.Control
                    required
                    disabled={true}
                    value={formData.modelo_audio}
                    onChange={(e) => handleChange('modelo_audio', e.target.value)}
                    placeholder="ej: modelo_audio_v1"
                />
            </FormRow>

            <FormRow label="¿Genera video de salida?" showFeedback>
                <Form.Check
                    type="checkbox"
                    disabled={true}
                    label="Sí"
                    checked={formData.flag_videos_salida}
                    onChange={(e) => handleChange('flag_videos_salida', e.target.checked)}
                />
            </FormRow>

            <FormRow label="¿Usa ventanas de tiempo?" showFeedback>
                <Form.Check
                    type="checkbox"
                    label="Sí"
                    disabled={true}
                    checked={formData.flag_ventanas_tiempo}
                    onChange={(e) => handleChange('flag_ventanas_tiempo', e.target.checked)}
                />
            </FormRow>

            {formData.flag_ventanas_tiempo && (
                <>
                    <FormRow label="Tiempo (numérico):" showFeedback>
                        <Form.Control
                            required
                            type="number"
                            min={1}
                            value={formData.cant_ventanas ?? ''}
                            onChange={(e) => handleChange('cant_ventanas', parseInt(e.target.value))}
                        />
                    </FormRow>

                    <FormRow label="Unidad de tiempo:" showFeedback>
                        <Form.Select
                            value={formData.unidad_tiempo_ventanas}
                            onChange={(e) => handleChange('unidad_tiempo_ventanas', e.target.value)}
                        >
                            <option value="hora">hora</option>
                            <option value="minuto">minuto</option>
                            <option value="segundo">segundo</option>
                        </Form.Select>
                    </FormRow>
                </>
            )}

            <Button
                variant="outline-secondary"
                className="mt-3"
                onClick={onShowVideos}
            >
                Selecciona Videos &gt;
            </Button>

            <div className="d-flex justify-content-end mt-3 gap-2">
                <Button variant="secondary" onClick={onCancel}>Cancelar</Button>
                <Button type="submit">Guardar</Button>
            </div>
        </Form>
    );
}