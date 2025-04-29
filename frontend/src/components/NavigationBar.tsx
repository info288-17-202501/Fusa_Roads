import { Container, Nav, Navbar } from "react-bootstrap";
import FusaLogo from "../assets/fusa_logo.png";

function NavigationBar() {
  	return (
    	<Navbar expand="lg" style={{ backgroundColor: "#eee" }} data-bs-theme="light">
      		<Container>
       			<Navbar.Brand href="/home">
          			<img src={FusaLogo} height="50" alt="FusaLogo.png" />
        		</Navbar.Brand>
        		<Navbar.Toggle aria-controls="navbar-responsive" />
        		<Navbar.Collapse id="navbar-responsive">
					<Nav className="me-auto">
						<Nav.Link href="/home">Home</Nav.Link>
						<Nav.Link href="/videos">Videos</Nav.Link>
						<Nav.Link href="/secciones-calles">Secciones Calles</Nav.Link>
						<Nav.Link disabled href="/modelos-ia">Modelos IA</Nav.Link>
						<Nav.Link disabled href="/proyectos-ia">PIA</Nav.Link>
						<Nav.Link disabled href="/monitor-procesos">Monitor de Procesos</Nav.Link>
						<Nav.Link disabled href="/proyecto-mapa-de-ruido">PMR</Nav.Link>
						<Nav.Link disabled href="/visor-mapas-de-ruido">Visor de Mapas</Nav.Link>
					</Nav>
        		</Navbar.Collapse>
      		</Container>
    	</Navbar>
  	);
}

export default NavigationBar;
