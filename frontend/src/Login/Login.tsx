import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Card from 'react-bootstrap/Card';
import { Button, Spinner } from 'react-bootstrap';
import FusaLogo from "./resources/fusa_logo.png"
import useLogout from "./hooks/useLogout"

import { useNavigate } from "react-router-dom";



function Login() {
    const navigate = useNavigate();
    const handleNavigate = () => {
        const route = "/";
        navigate(route);
        //window.scrollTo(0, 0);
    };
	const [showPassword, setShowPassword] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loginError, setLoginError] = useState<string>(""); 
    const [loading, setLoading] = useState(false);


	const handleLogin = async() => {
        setLoading(true);
		try{
			const formData = new URLSearchParams();
			formData.append("username", email);
			formData.append("password", password);

			const res = await fetch("http://localhost:8000/token",{
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				body: formData.toString(),
		});

		if(!res.ok){
			throw new Error("Error en login");
		}

		const data = await res.json();
		console.log(data)

		// Aquí puedes guardar los tokens en localStorage o en contexto
		localStorage.setItem("access_token", data.access_token);
		localStorage.setItem("refresh_token", data.refresh_token);

		setLoginError("");
        handleNavigate();
		} catch(err) {
			console.log(err);
			setLoginError("Usuario o contraseña incorrecta");
		} finally {
            setLoading(false);
        }
	}

	const logout = useLogout();

	return (
    	<>
			<div className="d-flex justify-content-center align-items-center vh-100">
				<Card className='p-4 col-lg-3 col-md-4 col-sm-6'>
					<img src={FusaLogo} className='col-6 mx-auto mb-4'/>
					<div className='text-start mb-4'>
						<label className="form-label">Email</label>
						<input
							className="form-control"
							placeholder="Ingrese email.."
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</div>

					<div className='text-start mb-4'>
						<label className="form-label">Contraseña</label>
						<div className="input-group position-relative">
								<input
									className="form-control pe-5"
									type={showPassword ? 'text' : 'password'}
									placeholder="Ingrese contraseña.."
									value={password}
									onChange={(e) => setPassword(e.target.value)}
								/>
							
							<span
								className='position-absolute end-0 top-50 translate-middle'
								style={{ zIndex: 10, cursor: 'pointer'}}

								onClick={() => setShowPassword(!showPassword)}
							>
								<FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
							</span>
						</div>
					</div>
					<div className="d-flex justify-content-center">
						<Button className='w-50' variant="primary" onClick={handleLogin} disabled={loading}>
                            <div className='d-flex align-items-center justify-content-center'>
                                {loading ? (
                                    <>
                                        <Spinner animation="border" size="sm" variant='light' />
                                        <p className='mb-0 ms-2'>Cargando...</p>
                                    </>
                                ) : (
                                    "Log in"
                                )}
                            </div>
                        </Button>
					</div>

					{loginError && (
						<div className='text-center text-danger mt-3'>{loginError}</div>
					)}
					<div className="d-flex justify-content-center">
						<Button onClick={logout} className='w-50 mt-3' variant='secondary'>Log out</Button>
					</div>
				</Card>
			</div>
    	</>
  	)
}

export default Login
