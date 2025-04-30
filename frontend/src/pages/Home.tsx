import Card from 'react-bootstrap/Card';
import { useNavigate } from "react-router-dom";
import { Col, Container, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBrain, faComputer, faEye, faFileAlt, faMapLocationDot, faRoad, faVideo } from '@fortawesome/free-solid-svg-icons';

const menu = [
	{
	  "icono": faVideo,
	  "nombre": "Videos",
	  "descripcion": "Sube y gestiona los videos utilizados para el análisis acústico.",
	  "url": "/videos"
	},
	{
	  "icono": faBrain,
	  "nombre": "Modelos IA",
	  "descripcion": "Configura modelos de inteligencia artificial para procesamiento de datos.",
	  "url": "/modelos-ia"
	},
	{
	  "icono": faRoad,
	  "nombre": "Secciones Calles",
	  "descripcion": "Define tramos de calles o ítems para el modelado de ruido con CadnaA o Noise Modelling.",
	  "url": "/secciones-calles"
	},
	{
	  "icono": faFileAlt,
	  "nombre": "Proyectos IA de Análisis (PIA)",
	  "descripcion": "Crea y configura proyectos de análisis acústico con IA.",
	  "url": "/proyectos-ia"
	},
	{
	  "icono": faComputer,
	  "nombre": "Monitor de procesos de PIA-DAG",
	  "descripcion": "Monitorea y gestiona los flujos de trabajo de cada proyecto PIA en forma de DAG.",
	  "url": "/monitor-procesos"
	},
	{
	  "icono": faMapLocationDot,
	  "nombre": "Proyecto mapa de ruido (PMR)",
	  "descripcion": "Configura los parámetros para generar mapas de ruido a partir de los análisis.",
	  "url": "/proyecto-mapa-de-ruido"
	},
	{
	  "icono": faEye,
	  "nombre": "Visor de mapas de proyectos",
	  "descripcion": "Visualiza los mapas de ruido generados por cada proyecto en una interfaz geoespacial.",
	  "url": "/visor-mapas-de-ruido"

	}
  ]
  

function Home() {
    const navigate = useNavigate();

    const handleNavigate = (ruta: string) => {
        const route = ruta;
        navigate(route);
        //window.scrollTo(0, 0);
    };

	return (
    	<>
			<Container className="w-75 my-5">
				<h1 className="d-flex justify-content-center mb-4">Panel Central</h1>	

				<Row className='gy-4 justify-content-center justify-content-md-between'>
					{menu.map((item) => (
						<Col lg={4} md={6} xs={10}>
							<Card
								style={{cursor:"pointer", transition: "transform 0.3s", transformOrigin: "center"}}
								className='h-100 p-3 bg-light shadow-sm'
								onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
  								onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
								onClick={() => handleNavigate(item.url)}
							>
								<span className='d-flex align-items-center gap-2 mb-3'>
									<FontAwesomeIcon fontSize="50" icon={item.icono}/>
									<Card.Title>{item.nombre}</Card.Title>
									{/* <h3 className=''>{item.nombre}</h3> */}
								</span>
								<Card.Body>{item.descripcion}</Card.Body>
							</Card>
						</Col>
					))}
				</Row>
			</Container>
			{/* <div className="d-flex justify-content-center align-items-center mt-5">
				<Card className='py-5 col-3'>
					<img src={FusaLogo} className='col-8 mx-auto mb-4'/>
					<Button className='col-8 mx-auto mb-3' variant='primary' onClick={() => handleNavigate("/secciones-calles")}>Secciones calles</Button>
					<Button className='col-8 mx-auto mb-3' variant='primary' onClick={() => handleNavigate("/videos")}>Videos</Button>
					<Button className='col-8 mx-auto mb-3' variant='primary' onClick={() => handleNavigate("/test")}>Boton de testeo de ramas</Button>

				</Card>
			</div> */}
    	</>
  	)
}

export default Home
