import React, { useRef, useState, useEffect } from 'react';
import { Container, Row, Col, Image, Button, Card, ListGroup } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";

type Point = { x: number; y: number };

function PuntosVideo() {
    const navigate = useNavigate();
    const imageRef = useRef<HTMLImageElement>(null);
    const [linePoints, setLinePoints] = useState<Point[]>([]);
    const [polygonPoints, setPolygonPoints] = useState<Point[]>([]);
    const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
    const [rotation, setRotation] = useState(0);

    const handleRotate = () => {
        setRotation((prev) => (prev + 90) % 360);
    };

    useEffect(() => {
        const img = imageRef.current;
        if (img && img.complete) {
            setImageSize({ width: img.offsetWidth, height: img.offsetHeight });
        }
    }, []);

    const handleClick = (e: React.MouseEvent) => {
        const img = imageRef.current;
        if (!img) return;

        const rect = img.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;

        // A veces si se apreta el borde de la img da un negativo asi que se pasa a 0 
        x = Math.max(x, 0);
        y = Math.max(y, 0);

        if (linePoints.length < 2) {
            setLinePoints([...linePoints, { x, y }]);
        } else if (polygonPoints.length < 4) {
            setPolygonPoints([...polygonPoints, { x, y }]);
        }
    };

    const removePoint = (index: number, type: 'line' | 'polygon') => {
        if (type === 'line') {
            const newPoints = [...linePoints];
            newPoints.splice(index, 1);
            setLinePoints(newPoints);
        } else {
            const newPoints = [...polygonPoints];
            newPoints.splice(index, 1);
            setPolygonPoints(newPoints);
        }
    };

    const drawPolygonPath = (points: Point[]) => {
        return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ') + (points.length >= 3 ? ' Z' : '');
    };

    return (
        <Container fluid className="my-4">
            <Row>
                {/* Columna izquierda */}
                <Col md={2}>
                    <Card className="mb-3">
                        <Card.Body>
                            <Card.Title>Información</Card.Title>
                            <Card.Text>
                                Imagen: <strong>VID_2(720P_60FPS).jpg</strong><br />
                                Resolución: <strong>1250x720</strong>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Columna central */}
                <Col md={7} className="d-flex flex-column align-items-center">
                    <Card className="text-center mb-3 w-100">
                        <Card.Body>
                            <Card.Title>Estás seleccionando puntos de la imagen</Card.Title>
                        </Card.Body>
                    </Card>

                    {/* Contenedor con posición relativa */}
                    <div
                        style={{
                            position: 'relative',
                            display: 'inline-block',
                            maxWidth: '100%',
                        }}
                        onClick={handleClick}
                    >
                        <Image
                            src="VID_2(720P_60FPS).jpg"
                            alt="Imagen clickeable"
                            ref={imageRef}
                            onLoad={(e) => {
                                const img = e.currentTarget;
                                setImageSize({ width: img.offsetWidth, height: img.offsetHeight });
                            }}
                            fluid
                            style={{ cursor: 'crosshair' }}
                        />

                        

                        {/* SVG para dibujar líneas/polígonos */}
                        <svg
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                pointerEvents: 'none'
                            }}
                            width={imageSize.width}
                            height={imageSize.height}
                        >
                            {/* Línea */}
                            {linePoints.length === 2 && (
                                <line
                                    x1={linePoints[0].x}
                                    y1={linePoints[0].y}
                                    x2={linePoints[1].x}
                                    y2={linePoints[1].y}
                                    stroke="green"
                                    strokeWidth="2"
                                />
                            )}

                            {/* Polígono */}
                            {polygonPoints.length >= 2 && (
                                <path
                                    d={drawPolygonPath(polygonPoints)}
                                    fill="rgba(0,0,255,0.2)"
                                    stroke="blue"
                                    strokeWidth="2"
                                />
                            )}
                        </svg>

                        {/* Etiquetas para puntos */}
                        {[...linePoints, ...polygonPoints].map((p, i) => (
                            <div
                                key={i}
                                style={{
                                    position: 'absolute',
                                    left: p.x + 6,
                                    top: p.y - 6,
                                    background: 'white',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                    padding: '2px 4px',
                                    fontSize: '0.75rem'
                                }}
                            >
                                P{i + 1}
                            </div>
                        ))}
                    </div>
                </Col>

                {/* Columna derecha */}
                <Col md={3}>
                    <Card className="mb-3">
                        <Card.Body>
                            <Card.Title>Línea</Card.Title>
                            <ListGroup variant="flush">
                                {linePoints.map((p, i) => (
                                    <ListGroup.Item key={i} className="d-flex justify-content-between align-items-center">
                                        <span>P{i + 1}: ({p.x.toFixed(1)}, {p.y.toFixed(1)})</span>
                                        <Button variant="danger" size="sm" onClick={() => removePoint(i, 'line')}>✕</Button>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Card.Body>
                    </Card>

                    <Card>
                        <Card.Body>
                            <Card.Title>Polígono</Card.Title>
                            <ListGroup variant="flush">
                                {polygonPoints.map((p, i) => (
                                    <ListGroup.Item key={i} className="d-flex justify-content-between align-items-center">
                                        <span>P{i + 1 + linePoints.length}: ({p.x.toFixed(1)}, {p.y.toFixed(1)})</span>
                                        <Button variant="danger" size="sm" onClick={() => removePoint(i, 'polygon')}>✕</Button>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default PuntosVideo;
