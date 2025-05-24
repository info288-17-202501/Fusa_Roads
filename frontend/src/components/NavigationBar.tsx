import { Container, Nav, Navbar, Button, NavDropdown, Spinner } from "react-bootstrap";
import FusaLogo from "../resources/fusa_logo.png";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../Login/hooks/useUser";
import useLogout from "../Login/hooks/useLogout";

const NavButtons = [
	{ ruta: "/home", etiqueta: "Home", disabled: false },
	{ ruta: "/videos", etiqueta: "Videos", disabled: false },
	{ ruta: "/secciones-calles", etiqueta: "Secciones Calles", disabled: false },
	{ ruta: "/modelos-ia", etiqueta: "Modelos IA", disabled: false },
	{ ruta: "/proyectos-ia", etiqueta: "PIA", disabled: true },
	{ ruta: "/monitor-procesos", etiqueta: "Monitor de Procesos", disabled: true },
	{ ruta: "/proyecto-mapa-de-ruido", etiqueta: "PMR", disabled: true },
	{ ruta: "/visor-mapas-de-ruido", etiqueta: "Visor de Mapas", disabled: true }
];
  

function NavigationBar() {
	const navigate = useNavigate();
	const location = useLocation();
	const currentPath = location.pathname;
	const {user, isLoadingUser} = useUser();
	const logout = useLogout();

  	return (
    	<Navbar expand="lg" style={{ backgroundColor: "#eee" }} data-bs-theme="light">
      		<Container> {/* className="d-flex align-items-end" para que los botones del nav se peguen abajo */}
       			<Navbar.Brand href="/home">
          			<img src={FusaLogo} height="55" alt="FusaLogo.png" />
        		</Navbar.Brand>
        		<Navbar.Toggle aria-controls="navbar-responsive" />
        		<Navbar.Collapse id="navbar-responsive">
					<Nav className="me-auto"> {/* mx-auto para que los botones del nav se centren */}
						{NavButtons.map((button) => 
							button.etiqueta !== "Secciones Calles" ? (
							<Nav.Link
								key={button.ruta}
								href={button.ruta}
								disabled={button.disabled}
								className="rounded-5 me-auto"
								style={{backgroundColor: currentPath === button.ruta ? "#ddd" : ""}}
							>
								{button.etiqueta}
							</Nav.Link>
						) : (
							<NavDropdown
								key={button.ruta}
								title={button.etiqueta}
								className="rounded-5 me-auto"
								style={{backgroundColor: currentPath === button.ruta ? "#ddd" : ""}}
							>
								<NavDropdown.Item onClick={() => navigate(button.ruta + "?app=cadnaa")}>CadnaA</NavDropdown.Item>
								<NavDropdown.Item onClick={() => navigate(button.ruta + "?app=noisemodelling")}>Noise Modelling</NavDropdown.Item>
							</NavDropdown>
						))}
					</Nav>
					<Nav>
						{isLoadingUser ? (
							<Spinner animation="border"/>
						) : user ? (
							<NavDropdown title={user.username} id="user-dropdown" align="end">
								<NavDropdown.Item onClick={() => navigate("/perfil")}>Perfil</NavDropdown.Item>
								<NavDropdown.Item onClick={logout}>Cerrar sesión</NavDropdown.Item>
							</NavDropdown>
						) : (
							<Button onClick={() => navigate("/login")}>Log in</Button>
						)}
					</Nav>
        		</Navbar.Collapse>
      		</Container>
    	</Navbar>
  	);
}

export default NavigationBar;
