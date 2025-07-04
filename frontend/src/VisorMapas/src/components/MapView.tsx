import { useEffect, useRef, useState } from 'react';
import { Card, Form } from 'react-bootstrap';
import L from 'leaflet';
import Papa from 'papaparse';
import 'leaflet/dist/leaflet.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './MapView.css';


const icons: Record<string, L.Icon> = {
  comercio: new L.Icon({
    iconUrl: '/images/store.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  }),
  hospital: new L.Icon({
    iconUrl: 'images/hospital.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  }),
  fuel: new L.Icon({
    iconUrl: 'images/charging-station.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  }),
  educacion: new L.Icon({
    iconUrl: 'images/escuela.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  }),
  semaforo: new L.Icon({
    iconUrl: 'images/semaforo.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  }),
  sensor: new L.Icon({
    iconUrl: 'images/camara.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  }),
  pia: new L.Icon({
    iconUrl: 'images/ML.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  }),
};

interface Location {
  name: string;
  type: string;
  lat: number;
  lng: number;
  info: string;
}

function fixCoordinate(coord: string): number {
  if (!coord) return NaN;
  const cleaned = coord.replace(/[^\d.-]/g, '').replace(/(\..*?)\./g, '$1');
  return parseFloat(cleaned.replace(',', '.'));
}

export function MapView() {
  const [showPia, setShowPia] = useState(true);
  const [showSensors, setShowSensors] = useState(true);
  const [locations, setLocations] = useState<Location[]>([]);
  const [visibleTypes, setVisibleTypes] = useState<string[]>([]);
  const [project, setProject] = useState('valdivia');
  const [subProject, setSubProject] = useState('prd1');

  const mapRef = useRef<L.Map | null>(null);
  const markerGroupRef = useRef<L.LayerGroup | null>(null);
  const prevProjectRef = useRef<string | null>(null);
  const piaRef = useRef<Location[]>([]);

  const categories = [
    { type: 'hospital', label: 'Hospitales', icon: '🏥' },
    { type: 'fuel', label: 'Estaciones de Servicio', icon: '⛽' },
    { type: 'comercio', label: 'Comercios', icon: '🛍️' },
    { type: 'educacion', label: 'Educación', icon: '🏫' },
    { type: 'semaforo', label: 'Semáforo', icon: '🚦' }
  ];

  const projectCenters: Record<string, [number, number]> = {
    valdivia: [-39.814, -73.245],
    santiago: [-33.4489, -70.6693],
    temuco: [-38.7359, -72.5904],
  };
  
  useEffect(() => {
    const fetchCSV = (url: string, defaultType: string): Promise<Location[]> => {
      return fetch(url)
        .then((response) => response.text())
        .then((csvText) => {
          return new Promise<Location[]>((resolve) => {
            Papa.parse(csvText, {
              header: true,
              skipEmptyLines: true,
              complete: (result: { data: any[] }) => {
                const parsed: Location[] = result.data.map((row: any) => {
                  const lat = fixCoordinate(row['_lat']);
                  const lng = fixCoordinate(row['_lon']);
                  if (isNaN(lat) || isNaN(lng)) return null;

                  let type =
                    (row['_tags_shop'] || row['_tags_amenity'] || defaultType)
                      .toLowerCase()
                      .trim();

                  if (['hospital', 'clinic', 'veterinary', 'dentist'].includes(type)) {
                    type = 'hospital';
                  }
                  if (['supermarket', 'mall'].includes(type)) {
                    type = 'comercio';
                  }
                  if (['fuel'].includes(type)) {
                    type = 'fuel';
                  }
                  if (['school', 'college', 'university'].includes(type)) {
                    type = 'educacion';
                  }
                  if (['traffic_signals'].includes(type)) {
                    type = 'semaforo';
                  }

                  return {
                    name: row['_tags_name'] || row['_tags_name:es'] || 'Sin nombre',
                    type,
                    lat,
                    lng,
                    info: `
                      <b>${row['_tags_name'] || row['_tags_name:es'] || 'Establecimiento'}</b><br/>
                      Dirección: ${row['_tags_addr:street'] || ''} ${row['_tags_addr:housenumber'] || ''}<br/>
                      Ciudad: ${row['_tags_addr:city'] || ''}<br/>
                      Página web: ${
                        row['_tags_website']
                          ? `<a href="${row['_tags_website']}" target="_blank">${row['_tags_website']}</a>`
                          : 'N/D'
                      }
                    `,
                  };
                }).filter((item): item is Location => item !== null);

                resolve(parsed);
              },
            });
          });
        });
    };

    Promise.all([
      fetchCSV(`/data/${project}/comercios.csv`, 'comercio'),
      fetchCSV(`/data/${project}/salud.csv`, 'hospital'),
      fetchCSV(`/data/${project}/bencineras.csv`, 'fuel'),
      fetchCSV(`/data/${project}/educacion.csv`, 'educacion'),
      fetchCSV(`/data/${project}/semaforos.csv`, 'semaforo'),
    ]).then(([comerciosData, saludData, bencineraData, educacionData, semaforoData]) => {
      const sensores: Location[] = [];
      const pias: Location[] = [];
      
      for (let i = 0; i < 4 && i < semaforoData.length; i++) {
        const semaforo = semaforoData[i];
      
        const lat = semaforo.lat + (i % 2 === 0 ? 0.00000012 : -0.00000012);
        const lng = semaforo.lng + (i % 2 === 1 ? 0.00000012 : -0.00000012);
      
        sensores.push({
          name: `Sensor ${i + 1}`,
          type: 'sensor',
          lat,
          lng,
          info: `
            <b>📹 Sensor ${i + 1}</b><br/>
            Latitud: ${lat.toFixed(8)}<br/>
            Longitud: ${lng.toFixed(8)}<br/>
            Tipo de cámara: Full HD<br/>
            Tipo de micrófono: Direccional<br/>
            Nombre del video: video_sensor_${i + 1}.mp4<br/>
            Duración del video: 60 segundos<br/>
            FPS: 30<br/>
            Resolución: 1920x1080
          `,
        });
      
        pias.push({
          name: `Proyecto IA (PIA) ${i + 1}`,
          type: 'pia',
          lat: lat + 0.00045,
          lng: lng + 0.00045,
          info: `
            <b>Proyecto IA (PIA) ${i + 1}</b><br/>
            Vehículos totales: 1500<br/>
            Autos: 900<br/>
            Camiones: 200<br/>
            Buses: 100<br/>
            Motos: 300
          `,
        });
      }
      
      piaRef.current = pias;
      
      setLocations([
        ...comerciosData,
        ...saludData,
        ...bencineraData,
        ...educacionData,
        ...semaforoData,
        ...sensores,
      ]);
    });
    
  }, [project]);

  useEffect(() => {
    const center = projectCenters[project] || [-39.814, -73.245];
  
    if (!mapRef.current) {
      mapRef.current = L.map('map').setView(center, 13);
  
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(mapRef.current);
  
      markerGroupRef.current = L.layerGroup().addTo(mapRef.current);
      prevProjectRef.current = project;
    }
  
    if (prevProjectRef.current !== project) {
      mapRef.current!.setView(center, 13);
      prevProjectRef.current = project;
    }

    const extendedVisibleTypes = showSensors ? [...visibleTypes, 'sensor'] : visibleTypes;

    const markerGroup = markerGroupRef.current!;
    markerGroup.clearLayers();

    locations.forEach((loc) => {
      if (!extendedVisibleTypes.includes(loc.type)) return;
      const icon = icons[loc.type] || icons['comercio'];
      L.marker([loc.lat, loc.lng], { icon })
        .addTo(markerGroup)
        .bindPopup(loc.info);
    });

    if (showPia && piaRef.current.length > 0) {
      piaRef.current.forEach((pia) => {
        const icon = icons['pia'];
        L.marker([pia.lat, pia.lng], { icon })
          .addTo(markerGroup)
          .bindPopup(pia.info);
      });
    }

  }, [locations, visibleTypes, project, showPia, showSensors]);
  
  return (
    <div className="position-relative">
      {/* Panel lateral con React Bootstrap */}
      <Card 
        className="position-absolute shadow"
        style={{
          zIndex: 1000,
          top: 15,
          left: 15,
          width: '280px',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >

        <Card.Body>
          {/* Selector de ciudad */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Ciudad</Form.Label>
            <Form.Select
              value={project}
              onChange={(e) => setProject(e.target.value)}
              className="mb-2"
            >
              <option value="valdivia">Valdivia</option>
              <option value="santiago">Santiago</option>
              <option value="temuco">Temuco</option>
            </Form.Select>
          </Form.Group>

          {/* Grupo: Sensores */}
          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              id="sensores-check"
              label={
                <span>
                  <span style={{ fontSize: '20px', marginRight: '8px' }}>📹</span>
                  <strong>Sensores</strong>
                </span>
              }
              checked={showSensors}
              onChange={(e) => setShowSensors(e.target.checked)}
              className="mb-2"
            />
          </Form.Group>

          <hr />

          {/* Grupo: Proyecto IA (PIA) */}
          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              id="pia-check"
              label={<strong>Proyecto IA (PIA)</strong>}
              checked={showPia}
              onChange={(e) => setShowPia(e.target.checked)}
              className="mb-2"
            />

            <Form.Select
              value={subProject}
              onChange={(e) => setSubProject(e.target.value)}
              className="fw-bold"
            >
              <option value="prd1">PRD1</option>
              <option value="prd2">PRD2</option>
              <option value="prd3">PRD3</option>
            </Form.Select>
          </Form.Group>

          <hr />

          {/* Checkboxes de categorías */}
          <Form.Group>
            <Form.Label className="fw-bold mb-2">Categorías</Form.Label>
            {categories.map(({ type, label, icon }) => (
              <Form.Check
                key={type}
                type="checkbox"
                id={`category-${type}`}
                label={
                  <span>
                    <span style={{ fontSize: '18px', marginRight: '8px' }}>{icon}</span>
                    {label}
                  </span>
                }
                checked={visibleTypes.includes(type)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setVisibleTypes((prev) => [...prev, type]);
                  } else {
                    setVisibleTypes((prev) => prev.filter((t) => t !== type));
                  }
                }}
                className="mb-2"
              />
            ))}
          </Form.Group>
        </Card.Body>
      </Card>

      {/* Mapa */}
      <div id="map" style={{ height: '100vh' }} />
    </div>
  );
}