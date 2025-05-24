import { useState, useEffect } from 'react';
import { Container, Card, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useUser } from './hooks/useUser';

const API_BASE_URL = 'http://localhost:8000';

interface ProfileData {
    name: string;
    lastname: string;
    username: string;
    email: string;
}

const UserProfile = () => {
    const { user: contextUser, isLoadingUser, setUser } = useUser();
    const navigate = useNavigate();

    const [profileData, setProfileData] = useState<ProfileData | null>(null);
    const [isLoadingProfile, setIsLoadingProfile] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isLoadingUser) return; // Espera que cargue el contexto

        if (!contextUser) { // Si el contexto dice que no existe usuario, no deberíamos estar aqui
            setError('No estás autenticado. Por favor, inicia sesión.');
            return;
        }

        const fetchUserProfile = async () => {
            setIsLoadingProfile(true);
            setError(null);
            const token = localStorage.getItem("access_token");

            if (!token) {
                setError('Token de autenticación no encontrado.');
                setIsLoadingProfile(false);
                setUser(null);
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/users/profile`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.status === 401) {
                    setError('Tu sesión ha expirado o es inválida. Por favor, inicia sesión de nuevo.');
                    localStorage.removeItem("access_token");
                    localStorage.removeItem("refresh_token");
                    setUser(null);
                    return;
                }

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.detail || `Error ${response.status}: ${response.statusText}`);
                }

                const data: ProfileData = await response.json();
                setProfileData(data);
            } catch (err: unknown) {
                if (err instanceof Error){
                    setError(err.message);
                    console.error("Error fetching profile:", err)
                } else {
                    setError("Ocurrió un problema desconocido.");
                    console.error("Error desconocido:", err)
                }
            } finally {
                setIsLoadingProfile(false);
            }
        };

        fetchUserProfile();

    }, [contextUser, isLoadingUser, navigate, setUser]);

    if (isLoadingUser) {
        return (
            <Container className="mt-5 text-center">
                <Spinner animation="border"/>
            </Container>
            
        );
    }

    if (error) {
        return (
            <Container className="mt-5">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }


    if (isLoadingProfile) {
        return (
             <Container className="mt-5 text-center">
                <Spinner animation="border"/>
                <p>Cargando perfil...</p>
            </Container>
        );
    }

    if (!profileData) {
        return (
            <Container className="mt-5">
                <Alert variant="info">Preparando información del perfil...</Alert>
            </Container>
        );
    }


    return (
        <Container className="mt-5 w-50">
            <Card>
                <Card.Header as="h2">Perfil de Usuario</Card.Header>
                <Card.Body>

                    <Card.Title>{profileData.username}</Card.Title>
                    <Card.Text>
                        <strong>Nombre:</strong> {profileData.name}
                    </Card.Text>
                    <Card.Text>
                        <strong>Apellido:</strong> {profileData.lastname}
                    </Card.Text>
                    <Card.Text>
                        <strong>Nombre de usuario:</strong> {profileData.username}
                    </Card.Text>
                    <Card.Text>
                        <strong>Email:</strong> {profileData.email}
                    </Card.Text>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default UserProfile;