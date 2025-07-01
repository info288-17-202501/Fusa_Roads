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
    if (!formData.nombre || !formData.mVideo || !formData.mAudio) return;
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
          value={formData.nombre}
          onChange={(e) => handleChange('nombre', e.target.value)}
          placeholder="Ingrese el nombre del proyecto"
        />
      </FormRow>

      <FormRow label="Modelo de Video:" showFeedback>
        <Form.Control
          required
          value={formData.mVideo}
          onChange={(e) => handleChange('mVideo', e.target.value)}
          placeholder="ej: modelo_video_v1"
        />
      </FormRow>

      <FormRow label="Modelo de Audio:" showFeedback>
        <Form.Control
          required
          value={formData.mAudio}
          onChange={(e) => handleChange('mAudio', e.target.value)}
          placeholder="ej: modelo_audio_v1"
        />
      </FormRow>

      <FormRow label="¿Genera video de salida?" showFeedback>
        <Form.Check
          type="checkbox"
          label="Sí"
          checked={formData.videoSalida}
          onChange={(e) => handleChange('videoSalida', e.target.checked)}
        />
      </FormRow>

      <FormRow label="¿Usa ventanas de tiempo?" showFeedback>
        <Form.Check
          type="checkbox"
          label="Sí"
          checked={formData.ventanasTiempo}
          onChange={(e) => handleChange('ventanasTiempo', e.target.checked)}
        />
      </FormRow>

      {formData.ventanasTiempo && (
        <>
          <FormRow label="Tiempo (numérico):" showFeedback>
            <Form.Control
              required
              type="number"
              min={1}
              value={formData.tiempo ?? ''}
              onChange={(e) => handleChange('tiempo', parseInt(e.target.value))}
            />
          </FormRow>

          <FormRow label="Unidad de tiempo:" showFeedback>
            <Form.Select
              value={formData.unidad}
              onChange={(e) => handleChange('unidad', e.target.value)}
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