import React, { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import PageShell from '../components/PageShell';
import Map, { MapHandle } from '../components/Map';
import AttractionCard from '../components/AttractionCard';
import ActivityCard from '../components/ActivityCard';
import { useLocation } from '../hooks/useLocation'; // Importamos el hook nuevo
import type { Attraction } from '../types';

interface LocationPageProps {
  slugProp?: string;
}

const LocationPage: React.FC<LocationPageProps> = ({ slugProp }) => {
  // Obtenemos el slug de la URL o de la prop
  const params = useParams<{ location: string }>(); // En tu App.tsx la ruta puede ser /:location
  // Si la ruta es /buta-ranquil, params.location será undefined si no está configurada como ruta dinámica.
  // Pero como definiste rutas fijas en App.tsx, usaremos slugProp.
  
  const activeSlug = slugProp || params.location || '';

  const { data, loading, error } = useLocation(activeSlug);
  
  const [selected, setSelected] = useState<Attraction | null>(null);
  const mapRef = useRef<MapHandle | null>(null);

  if (loading) {
    return <div className="h-screen flex items-center justify-center text-xl text-gray-500">Cargando...</div>;
  }

  if (error || !data) {
    return <div className="h-screen flex items-center justify-center text-red-500">Error: {error}</div>;
  }

  const { name, accentColor, attractions, activities, gallery, mapCenter } = data;

  return (
    <PageShell data={data}>
      {/* SECCIÓN DE ATRACCIONES */}
      <section id="atracciones" className="py-12 bg-gray-50 scroll-mt-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">{attractions.title}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {attractions.items.map((item, index) => (
              <AttractionCard 
                key={item.id || index} 
                attraction={item} 
                selected={selected?.title === item.title} 
                onClick={(a) => { 
                  setSelected(a); 
                  if (mapRef.current) mapRef.current.openPopupAt?.(a.coordinates.lat, a.coordinates.lng); 
                }} 
                accentColor={accentColor} 
              />
            ))}
          </div>
          
          {/* DETALLE SELECCIONADO */}
          {selected && (
            <div className="mt-8 bg-white p-6 rounded-lg shadow animate-fade-in">
              <h3 className="text-2xl font-bold mb-4">{selected.title}</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <img src={selected.images[0]} alt={selected.title} className="w-full h-64 object-cover rounded mb-4 bg-gray-100" />
                  <p className="text-gray-700">{selected.description}</p>
                </div>
                <div className="p-4 flex flex-col gap-2">
                    {selected.phone && <a href={`tel:${selected.phone}`} className="btn-secondary">Llamar</a>}
                    <button className="px-4 py-2 bg-gray-800 text-white rounded" onClick={() => mapRef.current?.flyTo?.(selected.coordinates.lat, selected.coordinates.lng)}>
                        Ver en Mapa
                    </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* SECCIÓN DE HOTELES (Si existen) */}
      {data.hotels && data.hotels.items.length > 0 && (
        <section id="hoteles" className="py-12 bg-white scroll-mt-16">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">{data.hotels.title}</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {data.hotels.items.map((h, i) => (
                <AttractionCard key={i} attraction={h} accentColor={accentColor} onClick={(a) => mapRef.current?.flyTo?.(a.coordinates.lat, a.coordinates.lng)} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SECCIÓN DE ACTIVIDADES */}
      <section id="actividades" className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
              <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">{activities.title}</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
                  {activities.items.map((act, i) => (
                      <ActivityCard key={i} activity={act} accentColor={accentColor} />
                  ))}
              </div>
          </div>
      </section>

      {/* MAPA */}
      <section className="container mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow overflow-hidden h-96">
          <Map ref={mapRef} center={[mapCenter.lat, mapCenter.lng]} attractions={[...attractions.items, ...(data.hotels?.items || []), ...(data.restaurants?.items || [])]} onSelect={setSelected} />
        </div>
      </section>
    </PageShell>
  );
};

export default LocationPage;