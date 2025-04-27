import { Card, Button } from 'react-bootstrap';

interface VideoCardProps {
    image: string;
    name: string;
    date: string;
    onEdit: () => void;
    onDelete: () => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ image, name, date, onEdit, onDelete }) => {
    return(
        <Card>
            <Card.Img variant="top" src={image}/>
            <Card.Body>
                <Card.Title>{name}</Card.Title>
                <Card.Text>{date}</Card.Text>
                <div className='d-flex justify-content-center gap-4'>
                    <Button variant='primary' onClick={onEdit}>Editar</Button>
                    <Button variant='danger' onClick={onDelete}>Eliminar</Button>
                </div>
            </Card.Body>
        </Card>
    )
}

export default VideoCard