import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import type { Attraction } from '../types';

// Since we are loading Leaflet via a script tag, we need to declare it for TypeScript
declare const L: any;

interface MapProps {
  center: [number, number];
  attractions: Attraction[];
  onSelect?: (attraction: Attraction) => void;
  height?: string; // Tailwind class like 'h-96' or custom value
}

export type MapHandle = {
  flyTo?: (lat: number, lng: number, zoom?: number) => void;
  openPopupAt?: (lat: number, lng: number) => void;
};

const Map = forwardRef<MapHandle, MapProps>(({ center, attractions, onSelect, height = 'h-96' }, ref) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markerRefs = useRef<Array<{ marker: any; attraction: Attraction }>>([]);

  useEffect(() => {
    if (mapContainer.current && !mapInstance.current) {
      // Initialize map
      mapInstance.current = L.map(mapContainer.current).setView(center, 11);

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapInstance.current);
    }

    // Clear existing markers
    if (mapInstance.current) {
      markerRefs.current.forEach(m => {
        try { mapInstance.current.removeLayer(m.marker); } catch (e) { /* ignore */ }
      });
      markerRefs.current = [];

      // Add markers for attractions
      attractions.forEach(attraction => {
        const marker = L.marker([attraction.coordinates.lat, attraction.coordinates.lng])
          .addTo(mapInstance.current)
          .bindPopup(`<b>${attraction.title}</b><br>${attraction.description}`);

        // Call provided onSelect callback when marker is clicked
        if (onSelect) {
          marker.on('click', () => onSelect(attraction));
        }

        markerRefs.current.push({ marker, attraction });
      });
    }
  }, [center, attractions, onSelect]);

  // Expose methods to parent
  useImperativeHandle(ref, () => ({
    flyTo: (lat: number, lng: number, zoom = 13) => {
      if (mapInstance.current) {
        mapInstance.current.setView([lat, lng], zoom, { animate: true });
      }
    },
    openPopupAt: (lat: number, lng: number) => {
      if (!mapInstance.current) return;
      const found = markerRefs.current.find(m => m.attraction.coordinates.lat === lat && m.attraction.coordinates.lng === lng);
      if (found) {
        found.marker.openPopup();
        mapInstance.current.setView([lat, lng], 13, { animate: true });
      }
    }
  }), [markerRefs.current]);

  return <div ref={mapContainer} className={`w-full ${height}`} />;
});

export default Map;