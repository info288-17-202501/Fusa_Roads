// resources/api.ts
import { Proceso } from './types';

const API_BASE_URL = 'http://localhost:8004';

export const fetchProcesos = async (): Promise<Proceso[]> => {
  try {
    console.log('Intentando conectar a:', `${API_BASE_URL}/estadopia/`);
    
    const response = await fetch(`${API_BASE_URL}/estadopia/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Agregar timeout personalizado
      signal: AbortSignal.timeout(10000) // 10 segundos
    });
    
    console.log('Respuesta recibida:', response.status, response.statusText);
    
    if (!response.ok) {
      throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
    }
    
    const data: Proceso[] = await response.json();
    console.log('Datos recibidos:', data);
    
    // Filtrar procesos: solo mostrar los que tienen fecha_inicio Y al menos un estado
    const procesosFiltrados = data.filter(proceso => 
      proceso.fecha_inicio && 
      proceso.estados && 
      proceso.estados.length > 0
    );
    
    console.log('Procesos filtrados:', procesosFiltrados);
    return procesosFiltrados;
  } catch (error) {
    console.error('Error detallado:', error);
    
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('No se puede conectar al servidor. Verifica que:\n• El servidor esté ejecutándose en http://localhost:8004\n• No haya problemas de CORS\n• Tu conexión de red esté funcionando');
    }
    
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Timeout: El servidor tardó demasiado en responder');
    }
    
    throw error;
  }
};
