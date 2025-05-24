import { useState, FormEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Button, Container, Row, Card, Col, Form, InputGroup } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { validateEmail, validateUsername, validatePassword } from './helpers/utils';

function SignUp() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [lastname, setLastname] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");

    const [errorName, setErrorName] = useState("");
    const [errorLastname, setErrorLastname] = useState("");
    const [errorsUsername, setErrorsUsername] = useState<string[]>([]);
    const [errorEmail, setErrorEmail] = useState("");
    const [errorsPassword, setErrorsPassword] = useState<string[]>([]);
    const [errorPassword2, setErrorPassword2] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);

    // Estado para controlar si el formulario ha sido validado (tras un intento de submit)
    const [validated, setValidated] = useState(false);

    const resetForm = () => {
        setName("");
        setLastname("");
        setUsername("");
        setEmail("");
        setPassword("");
        setPassword2("");
        setErrorName("");
        setErrorLastname("");
        setErrorsUsername([]);
        setErrorEmail("");
        setErrorsPassword([]);
        setErrorPassword2("");
        setValidated(false);
        setShowPassword(false);
        setShowPassword2(false);
    };

    const handleCancel = () => {
        resetForm();
        navigate("/login");
    };

    const runValidations = (): boolean => {
        let isValid = true;

        if (!name.trim()) {
            setErrorName("El nombre es obligatorio.");
            isValid = false;
        } else setErrorName("");

        if (!lastname.trim()) {
            setErrorLastname("El apellido es obligatorio.");
            isValid = false;
        } else setErrorLastname("");
        
        const usernameValidationErrors = validateUsername(username);
        setErrorsUsername(usernameValidationErrors);
        if (usernameValidationErrors.length > 0) isValid = false;

        const emailValidationError = validateEmail(email);
        setErrorEmail(emailValidationError);
        if (emailValidationError) isValid = false;
        if (!email.trim() && !emailValidationError) {
             setErrorEmail("El email es obligatorio.");
             isValid = false;
        }


        const passwordValidationErrors = validatePassword(password);
        setErrorsPassword(passwordValidationErrors);
        if (passwordValidationErrors.length > 0) isValid = false;
         if (!password.trim() && passwordValidationErrors.length === 0) {
             setErrorsPassword(["La contraseña es obligatoria."]);
             isValid = false;
        }

        // Confirmar Contraseña
        if (!password2.trim()) {
            setErrorPassword2("Debes confirmar la contraseña.");
            isValid = false;
        } else if (password.trim() && password !== password2) {
            setErrorPassword2("Las contraseñas no coinciden.");
            isValid = false;
        } else {
            setErrorPassword2("");
        }
        
        return isValid;
    };


    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        event.stopPropagation();

        setValidated(true);
        
        if (runValidations()) {
            console.log("Formulario válido. Enviando datos...");
            const userData = {
                name,
                lastname,
                username,
                email,
                password,
            };

            try {
                const response = await fetch("http://localhost:8000/register", {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(userData)
                });
                const data = await response.json();

                if (response.ok) {
                    console.log("Registro exitoso:", data);
                    alert("¡Registro exitoso!");
                    resetForm();
                    navigate("/login");
                } else {
                    const errorMessage = data.detail || "Error al registrar el usuario.";
                    console.error("Error del backend:", errorMessage);
                    alert(`Error: ${errorMessage}`);
                }
            } catch (error) {
                console.error("Error de red o conexión:", error);
                alert("Error de conexión. Inténtalo de nuevo más tarde.");
            }
        } else {
            console.log("Formulario inválido. Revisa los campos.");
        }
    };

    return (
        <Container className='mt-5 mb-5 w-50'>
            <Card>
                <Card.Header as="h2" className="text-center">Registrar Nueva Cuenta</Card.Header>
                <Card.Body className='p-4'>
                    <Form noValidate onSubmit={handleSubmit}>
                        <Row>
                            <Form.Group as={Col} sm={12} md={6} className='mt-1' controlId="formGridName">
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Tu nombre"
                                    value={name}
                                    onChange={(e) => {
                                        setName(e.target.value);
                                        if (validated) setErrorName(e.target.value.trim() ? "" : "El nombre es obligatorio.");
                                    }}
                                    required
                                    isInvalid={validated && !!errorName}
                                    isValid={validated && name.trim() !== "" && !errorName}
                                />
                                <Form.Control.Feedback type="invalid">{errorName}</Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group as={Col} sm={12} md={6} className='mt-1' controlId="formGridLastname">
                                <Form.Label>Apellido</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Tu apellido"
                                    value={lastname}
                                    onChange={(e) => {
                                        setLastname(e.target.value);
                                        if (validated) setErrorLastname(e.target.value.trim() ? "" : "El apellido es obligatorio.");
                                    }}
                                    required
                                    isInvalid={validated && !!errorLastname}
                                    isValid={validated && lastname.trim() !== "" && !errorLastname}
                                />
                                <Form.Control.Feedback type="invalid">{errorLastname}</Form.Control.Feedback>
                            </Form.Group>
                        </Row>

                        <Row>
                            <Form.Group as={Col} sm={12} md={6} className='mt-3' controlId="formGridUsername">
                                <Form.Label>Nombre de usuario</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Elige un nombre de usuario"
                                    value={username}
                                    onChange={(e) => {
                                        setUsername(e.target.value);
                                        if (validated) setErrorsUsername(validateUsername(e.target.value));
                                    }}
                                    required
                                    isInvalid={validated && errorsUsername.length > 0}
                                    isValid={validated && username.trim() !== "" && errorsUsername.length === 0}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errorsUsername.map((err, idx) =>
                                        <div key={idx}>{err}</div>
                                    )}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group as={Col} sm={12} md={6} className='mt-3' controlId="formGridEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="tu.correo@ejemplo.com"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        if (validated) setErrorEmail(validateEmail(e.target.value) || (e.target.value.trim() ? "" : "El email es obligatorio."));
                                    }}
                                    required
                                    isInvalid={validated && !!errorEmail}
                                    isValid={validated && email.trim() !== "" && !errorEmail}
                                />
                                <Form.Control.Feedback type="invalid">{errorEmail}</Form.Control.Feedback>
                            </Form.Group>
                        </Row>

                        <Row>
                            <Form.Group as={Col} sm={12} md={6} className='mt-3' controlId="formGridPassword">
                                <Form.Label>Contraseña</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Crea una contraseña segura"
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            if (validated) setErrorsPassword(validatePassword(e.target.value) || (e.target.value.trim() ? [] : ["La contraseña es obligatoria."]));
                                        }}
                                        required
                                        isInvalid={validated && errorsPassword.length > 0}
                                        isValid={validated && password.trim() !== "" && errorsPassword.length === 0}
                                    />
                                    <InputGroup.Text style={{cursor:"pointer"}} onClick={() => setShowPassword(!showPassword)}>
                                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye}/>
                                    </InputGroup.Text>
                                    <Form.Control.Feedback type="invalid">
                                        {errorsPassword.map((err, idx) =>
                                            <div key={idx}>{err}</div>
                                        )}
                                    </Form.Control.Feedback>
                                </InputGroup>
                            </Form.Group>

                            <Form.Group as={Col} sm={12} md={6} className='mt-3' controlId="formGridPassword2">
                                <Form.Label>Confirmar contraseña</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        type={showPassword2 ? "text" : "password"}
                                        placeholder="Repite la contraseña"
                                        value={password2}
                                        onChange={(e) => { 
                                            setPassword2(e.target.value); 
                                            if (validated) {
                                                if (!e.target.value.trim()) setErrorPassword2("Debes confirmar la contraseña.");
                                                else if (password !== e.target.value) setErrorPassword2("Las contraseñas no coinciden.");
                                                else setErrorPassword2("");
                                            }
                                        }}
                                        required
                                        isInvalid={validated && !!errorPassword2}
                                        isValid={validated && password2.trim() !== "" && !errorPassword2 && password === password2}
                                    />
                                    <InputGroup.Text style={{cursor:"pointer"}} onClick={() => setShowPassword2(!showPassword2)}>
                                        <FontAwesomeIcon icon={showPassword2 ? faEyeSlash : faEye}/>
                                    </InputGroup.Text>
                                    <Form.Control.Feedback type="invalid">{errorPassword2}</Form.Control.Feedback>
                                </InputGroup>
                            </Form.Group>
                        </Row>

                        <Card.Footer className="d-flex justify-content-end gap-2 bg-transparent border-top-0 pt-4 pb-0 px-0">
                            <Button variant="secondary" onClick={handleCancel} type="button">Cancelar</Button>
                            <Button variant="primary" type="submit">Crear Cuenta</Button>
                        </Card.Footer>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default SignUp;