import { ProcesoProyecto } from "./types";

export const procesosProyecto: ProcesoProyecto[] = [
    { id: 1, nombre: 'proceso1', estado: { creado: false, iniciado: false, audioIA: false, videoIA: false, integrado: false } },
    { id: 2, nombre: 'proceso2', estado: { creado: true, iniciado: false, audioIA: false, videoIA: false, integrado: false } },
    { id: 3, nombre: 'proceso3', estado: { creado: true, iniciado: true, audioIA: false, videoIA: false, integrado: false } },
    { id: 4, nombre: 'proceso4', estado: { creado: true, iniciado: true, audioIA: true, videoIA: false, integrado: false } },
    { id: 5, nombre: 'proceso5', estado: { creado: true, iniciado: true, audioIA: true, videoIA: true, integrado: false } },
    { id: 6, nombre: 'proceso6', estado: { creado: true, iniciado: true, audioIA: true, videoIA: true, integrado: true } },
    { id: 7, nombre: 'proceso7', estado: { creado: true, iniciado: false, audioIA: false, videoIA: false, integrado: false } },
    { id: 8, nombre: 'proceso8', estado: { creado: true, iniciado: true, audioIA: false, videoIA: true, integrado: false } },
    { id: 9, nombre: 'proceso9', estado: { creado: true, iniciado: true, audioIA: true, videoIA: false, integrado: true } },
    { id: 10, nombre: 'proceso10', estado: { creado: true, iniciado: true, audioIA: true, videoIA: true, integrado: false } },
    { id: 11, nombre: 'proceso11', estado: { creado: false, iniciado: false, audioIA: false, videoIA: false, integrado: false } }
];
