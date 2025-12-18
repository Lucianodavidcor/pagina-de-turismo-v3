import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet'; // <--- Agregamos useMap
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// --- CONFIGURACIÓN DE ICONOS (Igual que antes) ---
import iconMarker from 'leaflet/dist/images/marker-icon.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: iconMarker,
    iconRetinaUrl: iconRetina,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// --- COMPONENTE MÁGICO PARA CORREGIR EL GRIS ---
// Este componente accede a la instancia del mapa y fuerza un recálculo
const MapRevalidator = () => {
    const map = useMap();

    useEffect(() => {
        // Esperamos un poco (100ms) a que la animación de "fade-in" termine
        const timer = setTimeout(() => {
            map.invalidateSize();
        }, 100);

        return () => clearTimeout(timer);
    }, [map]);

    return null;
};

// --- Subcomponente para clicks ---
interface MapEventsProps {
    onSelect: (lat: number, lng: number) => void;
}

const MapClickHandler: React.FC<MapEventsProps> = ({ onSelect }) => {
    useMapEvents({
        click(e) {
            onSelect(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
};

// --- Componente Principal ---
interface LocationPickerProps {
    initialLat: number;
    initialLng: number;
    onLocationSelect: (lat: number, lng: number) => void;
}

const LocationPicker: React.FC<LocationPickerProps> = ({ initialLat, initialLng, onLocationSelect }) => {
    const [position, setPosition] = useState<[number, number]>([initialLat, initialLng]);

    useEffect(() => {
        setPosition([initialLat, initialLng]);
    }, [initialLat, initialLng]);

    const handleSelect = (lat: number, lng: number) => {
        setPosition([lat, lng]);
        onLocationSelect(lat, lng);
    };

    return (
        <div className="h-[350px] w-full rounded-xl overflow-hidden border-2 border-gray-200 shadow-inner z-0 relative bg-gray-100">
            <MapContainer 
                center={[initialLat, initialLng]} 
                zoom={13} 
                style={{ height: '100%', width: '100%' }}
                // Usamos una key única para forzar el re-render si cambian las coordenadas iniciales drásticamente
                key={`${initialLat}-${initialLng}`} 
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                <Marker position={position} />
                
                <MapClickHandler onSelect={handleSelect} />
                
                {/* 👇 AQUÍ ESTÁ LA SOLUCIÓN 👇 */}
                <MapRevalidator /> 
                
            </MapContainer>

            <div className="absolute bottom-3 left-3 bg-white/90 px-3 py-1.5 rounded-lg shadow-md text-xs font-bold text-gray-600 z-[400] pointer-events-none backdrop-blur-sm">
                <i className="fas fa-hand-pointer mr-1 text-cyan-600"></i> Haz clic para marcar la ubicación
            </div>
        </div>
    );
};

export default LocationPicker;