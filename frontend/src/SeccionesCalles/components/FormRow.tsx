import { Row, Form} from "react-bootstrap"
import { ReactNode } from "react"

interface FormRowProps {
    label: string;
    children: ReactNode;
    showFeedback?: boolean;
}

const FormRow = ({label, children, showFeedback = false}: FormRowProps) => (
    <Row className="justify-content-center mb-3">
        <Form.Group className="w-75">
            <Form.Label>{label}</Form.Label>
            {children}
            {showFeedback && (
                <Form.Control.Feedback type="invalid">
                    Este campo es obligatorio
                </Form.Control.Feedback>
            )}
        </Form.Group>
    </Row>
);

export default FormRow;