import { faBrain, faComputer, faEye, faFileAlt, faMapLocationDot, faRoad, faVideo } from '@fortawesome/free-solid-svg-icons';

export const menuItems = [
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
	    "url": "/pmr"
	},
	{
	    "icono": faEye,
	    "nombre": "Visor de mapas de proyectos",
	    "descripcion": "Visualiza los mapas de ruido generados por cada proyecto en una interfaz geoespacial.",
	    "url": "/visor-mapas-de-ruido"
	}
]