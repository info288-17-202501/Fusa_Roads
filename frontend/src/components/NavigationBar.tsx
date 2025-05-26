import { Container, Nav, Navbar, Button } from "react-bootstrap";
import FusaLogo from "../resources/fusa_logo.png";
import { useLocation } from "react-router-dom";

const NavButtons = [
	{ ruta: "/home", etiqueta: "Home", disabled: false },
	{ ruta: "/videos", etiqueta: "Videos", disabled: false },
	{ ruta: "/secciones-calles", etiqueta: "Secciones Calles", disabled: false },
	{ ruta: "/modelos-ia", etiqueta: "Modelos IA", disabled: false },
	{ ruta: "/proyectos-ia", etiqueta: "PIA", disabled: true },
	{ ruta: "/monitor-procesos", etiqueta: "Monitor de Procesos", disabled: false },
	{ ruta: "/proyecto-mapa-de-ruido", etiqueta: "PMR", disabled: true },
	{ ruta: "/visor-mapas-de-ruido", etiqueta: "Visor de Mapas", disabled: true }
];
  

function NavigationBar() {
	const location = useLocation();
	const currentPath = location.pathname;

  	return (
    	<Navbar expand="lg" style={{ backgroundColor: "#eee" }} data-bs-theme="light">
      		<Container> {/* className="d-flex align-items-end" para que los botones del nav se peguen abajo */}
       			<Navbar.Brand href="/home">
          			<img src={FusaLogo} height="55" alt="FusaLogo.png" />
        		</Navbar.Brand>
        		<Navbar.Toggle aria-controls="navbar-responsive" />
        		<Navbar.Collapse id="navbar-responsive">
					<Nav className="me-auto"> {/* mx-auto para que los botones del nav se centren */}
						{NavButtons.map((button) => (
							<Nav.Link
								href={button.ruta}
								disabled={button.disabled}
								className="rounded-5 me-auto"
								style={{backgroundColor: currentPath === button.ruta ? "#ddd" : ""}}
							>
								{button.etiqueta}
							</Nav.Link>
						))}
					</Nav>
					<Button>Log in</Button>
        		</Navbar.Collapse>
      		</Container>
    	</Navbar>
  	);
}

export default NavigationBar;
