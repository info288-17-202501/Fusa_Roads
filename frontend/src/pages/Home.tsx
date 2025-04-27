import Card from 'react-bootstrap/Card';
import FusaLogo from "../assets/fusa_logo.png"
import { useNavigate } from "react-router-dom";
import { Button } from 'react-bootstrap';


function Home() {
    const navigate = useNavigate();

    const handleNavigate = (ruta: string) => {
        const route = ruta;
        navigate(route);
        //window.scrollTo(0, 0);
    };

	return (
    	<>
			<div className="d-flex justify-content-center align-items-center vh-100">
				<Card className='py-5 col-3'>
					<img src={FusaLogo} className='col-8 mx-auto mb-4'/>
					<Button className='col-8 mx-auto mb-3' variant='primary' onClick={() => handleNavigate("/secciones-calles")}>Secciones calles</Button>

				</Card>
			</div>
    	</>
  	)
}

export default Home
