export type ProcesoProyecto = {
    id: number;
    nombre: string;
    estado: { 
        creado: boolean;
        iniciado: boolean;
        audioIA: boolean;
        videoIA: boolean;
        integrado: boolean;
    }
};