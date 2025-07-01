import VideoCard from "./components/VideoCard"
import { Button, Col, Container, FormControl, InputGroup, Pagination, Row } from 'react-bootstrap';
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faSearch } from "@fortawesome/free-solid-svg-icons";

const ITEMS_PER_PAGE = 9;

function Videos() {
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [videos, setVideos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Cargar videos al montar componente
    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const res = await fetch('http://localhost:8002/mongo/datos', { method: 'GET' });
                const data = await res.json();

                const processedData = data.map((video: any) => ({
                    id: video._id,
                    name: video.nombre_video,
                    date: video.fecha_de_registro_manual,
                    image: `http://localhost:8002/minio/stream-thumbnail?ruta_miniatura_minio=${video.ruta_miniatura_minio}&minio_bucket=${video.minio_bucket}`,
                }));

                setVideos(processedData);
                setLoading(false);
            } catch (error) {
                console.error("Error cargando los videos:", error);
                setLoading(false);
            }
        };
        fetchVideos();
    }, []);

    const filteredVideos = videos.filter((video) =>
        video.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const totalPages = Math.ceil(filteredVideos.length / ITEMS_PER_PAGE);
    const paginatedVideos = filteredVideos.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

    const handleEdit = (id: number) => {
        alert(`Editar video con ID ${id}`);
    };

    const handleDelete = (id: number) => {
        alert(`Eliminar video con ID ${id}`);
    };
    return (
        <>
            <Container className="w-75 my-5">
                <h1 className="d-flex justify-content-center mb-4">Videos</h1>
                <div className="d-flex gap-3 mb-3">
                    <InputGroup className='w-25' style={{ minWidth: 66 }}>
                        <FormControl
                            type="text"
                            placeholder="Buscar..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setPage(1);
                            }}
                            className='border-end-0'
                            style={{ outline: 'none', boxShadow: 'none', border: '1px solid rgb(222, 226, 230)' }}
                        />
                        <InputGroup.Text className='bg-transparent border-start-0'>
                            <FontAwesomeIcon icon={faSearch} />
                        </InputGroup.Text>
                    </InputGroup>

                    <Button className="d-flex gap-2">
                        <FontAwesomeIcon className="my-auto" icon={faCirclePlus} />
                        Nuevo
                    </Button>
                </div>

                {loading ? (
                    <p className="text-center">Cargando videos...</p>
                ) : (
                    <>
                        <Row className="g-4 justify-content-center justify-content-md-between">
                            {paginatedVideos.map((video) => (
                                <Col lg={4} md={6} xs={10}>
                                    <VideoCard
                                        image={video.image}
                                        name={video.name}
                                        date={video.date}
                                        onEdit={() => handleEdit(video.id)}
                                        onDelete={() => handleDelete(video.id)}
                                    />
                                </Col>
                            ))}
                        </Row>

                        <Pagination className="mt-4 justify-content-center">
                            <Pagination.Prev disabled={page == 1 ? true : false} onClick={() => setPage(page - 1)} />
                            {[...Array(totalPages)].map((_, idx) => (
                                <Pagination.Item
                                    key={idx}
                                    active={page === idx + 1}
                                    onClick={() => setPage(idx + 1)}
                                >
                                    {idx + 1}
                                </Pagination.Item>
                            ))}
                            <Pagination.Next disabled={page == totalPages ? true : false} onClick={() => setPage(page + 1)} />
                        </Pagination>
                    </>
                )}
            </Container>
        </>
    )
}

export default Videos
