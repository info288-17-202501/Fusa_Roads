import Card from 'react-bootstrap/Card';
import { useNavigate } from "react-router-dom";
import { Col, Container, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { menuItems } from './resources/menuItems';  

function MenuCentral() {
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
					{menuItems.map((item) => (
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
    	</>
  	)
}

export default MenuCentral
