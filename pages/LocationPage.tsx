import React, { useState, useRef, useEffect } from 'react';
import { useParams, useLocation as useRouterLocation } from 'react-router-dom'; // <--- Importamos useLocation del router
import PageShell from '../components/PageShell';
import Map, { MapHandle } from '../components/Map';
import AttractionCard from '../components/AttractionCard';
import ActivityCard from '../components/ActivityCard';
import { useLocation } from '../hooks/useLocation'; // Tu hook personalizado
import type { Attraction } from '../types';

interface LocationPageProps {
  slugProp?: string;
}

const LocationPage: React.FC<LocationPageProps> = ({ slugProp }) => {
  // 1. Determinar el slug activo
  const params = useParams<{ location: string }>();
  const activeSlug = slugProp || params.location || '';
  
  // Obtenemos el hash de la URL (ej: #atracciones)
  const { hash } = useRouterLocation(); 

  // 2. Usar el Hook conectado a la API
  const { data, loading, error } = useLocation(activeSlug);
  
  // Estados locales
  const [selected, setSelected] = useState<Attraction | null>(null);
  const mapRef = useRef<MapHandle | null>(null);

  // --- EFECTO PARA SCROLL AUTOMÁTICO (FIX ANCLAJES) ---
  useEffect(() => {
    // Solo intentamos scrollear si ya cargaron los datos y hay un hash en la URL
    if (!loading && data && hash) {
      // Quitamos el '#' del string
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      
      if (element) {
        // Pequeño timeout para asegurar que el DOM se pintó
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, [loading, data, hash]); // Se ejecuta cuando cambia cualquiera de estos

  // 3. Manejo de Carga
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600 font-medium">Cargando experiencia...</p>
      </div>
    );
  }

  // 4. Manejo de Errores
  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
        <div className="text-red-500 text-6xl mb-4">
          <i className="fas fa-exclamation-circle"></i>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Ups, algo salió mal</h2>
        <p className="text-gray-600">{error || 'No pudimos encontrar esta localidad.'}</p>
        <a href="/" className="mt-6 px-6 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700 transition">
          Volver al Inicio
        </a>
      </div>
    );
  }

  // Desestructuración de datos seguros
  const { name, accentColor, attractions, activities, gallery, mapCenter } = data;

  return (
    <PageShell data={data}>
      
      {/* SECCIÓN DE ATRACCIONES */}
      {/* scroll-mt-24 asegura que el header sticky no tape el título al scrollear */}
      <section id="atracciones" className="py-12 bg-gray-50 scroll-mt-24">
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
                  if (mapRef.current && mapCenter) {
                    mapRef.current.openPopupAt?.(a.coordinates.lat, a.coordinates.lng);
                    // Opcional: scrollear al mapa para ver el detalle
                    document.getElementById('mapa-ubicacion')?.scrollIntoView({ behavior: 'smooth' });
                  }
                }} 
                accentColor={accentColor} 
              />
            ))}
          </div>

          {/* DETALLE DE LA ATRACCIÓN SELECCIONADA */}
          {selected && (
            <div className="mt-8 bg-white p-6 rounded-lg shadow-lg border border-gray-100 animate-fade-in">
              <h3 className="text-2xl font-bold mb-4 flex justify-between items-center">
                {selected.title}
                <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600">
                  <i className="fas fa-times"></i>
                </button>
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  {selected.images.length > 0 ? (
                    <img 
                      src={selected.images[0]} 
                      alt={selected.title} 
                      className="w-full h-64 object-cover rounded mb-4 bg-gray-200" 
                    />
                  ) : (
                    <div className="w-full h-64 bg-gray-200 rounded mb-4 flex items-center justify-center text-gray-500">
                      Sin imagen disponible
                    </div>
                  )}
                  <p className="text-gray-700 leading-relaxed">{selected.description}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded h-fit">
                  <div className="space-y-3 mb-6">
                    <div className="text-sm">
                        <span className="font-bold block text-gray-800">Teléfono:</span> 
                        {selected.phone || 'No disponible'}
                    </div>
                    <div className="text-sm">
                        <span className="font-bold block text-gray-800">Email:</span> 
                        {selected.email || 'No disponible'}
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    {selected.phone && (
                      <a href={`tel:${selected.phone}`} className="w-full py-2 bg-white border border-gray-300 rounded text-center hover:bg-gray-100 text-sm font-medium transition">
                        <i className="fas fa-phone mr-2"></i> Llamar
                      </a>
                    )}
                    <button 
                      className={`w-full py-2 text-white rounded text-sm font-medium transition shadow-sm ${
                        accentColor === 'orange' ? 'bg-orange-500 hover:bg-orange-600' :
                        accentColor === 'cyan' ? 'bg-cyan-500 hover:bg-cyan-600' :
                        'bg-green-600 hover:bg-green-700'
                      }`}
                      onClick={() => {
                          mapRef.current?.flyTo?.(selected.coordinates.lat, selected.coordinates.lng);
                          document.getElementById('mapa-ubicacion')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      <i className="fas fa-map-marker-alt mr-2"></i> Ver en Mapa
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* SECCIÓN DE HOTELES */}
      {data.hotels && data.hotels.items.length > 0 && (
        <section id="hoteles" className="py-12 bg-white scroll-mt-24">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">{data.hotels.title}</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {data.hotels.items.map((h, i) => (
                <AttractionCard 
                  key={h.id || i} 
                  attraction={h} 
                  accentColor={accentColor} 
                  onClick={(a) => {
                      mapRef.current?.flyTo?.(a.coordinates.lat, a.coordinates.lng);
                      document.getElementById('mapa-ubicacion')?.scrollIntoView({ behavior: 'smooth' });
                  }} 
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SECCIÓN DE RESTAURANTES */}
      {data.restaurants && data.restaurants.items.length > 0 && (
        <section id="restaurantes" className="py-12 bg-gray-50 scroll-mt-24">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">{data.restaurants.title}</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {data.restaurants.items.map((r, i) => (
                <AttractionCard 
                  key={r.id || i} 
                  attraction={r} 
                  accentColor={accentColor} 
                  onClick={(a) => {
                      mapRef.current?.flyTo?.(a.coordinates.lat, a.coordinates.lng);
                      document.getElementById('mapa-ubicacion')?.scrollIntoView({ behavior: 'smooth' });
                  }} 
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SECCIÓN DE ACTIVIDADES */}
      <section id="actividades" className="py-20 bg-white scroll-mt-24">
          <div className="container mx-auto px-6">
              <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">{activities.title}</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 justify-center">
                  {activities.items.map((act, i) => (
                      <ActivityCard key={act.id || i} activity={act} accentColor={accentColor} />
                  ))}
              </div>
          </div>
      </section>

      {/* SECCIÓN DE GALERÍA */}
      <section id="galeria" className="py-20 bg-gray-50 scroll-mt-24">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">{gallery.title}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {gallery.images.map((image, index) => (
                <div key={index} className="overflow-hidden rounded-lg shadow-md aspect-video group cursor-pointer">
                  <img 
                    src={image} 
                    alt={`${name} Gallery ${index + 1}`} 
                    loading="lazy" 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" 
                  />
                </div>
              ))}
            </div>
          </div>
      </section>

      {/* SECCIÓN DE MAPA (con ID para referencia) */}
      <section id="mapa-ubicacion" className="container mx-auto px-6 py-12 pb-20 scroll-mt-24">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Ubicación y Puntos de Interés</h2>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden h-[500px] border border-gray-200 relative z-0">
          {/* PROTECCIÓN CONTRA UNDEFINED */}
          {mapCenter ? (
            <Map 
              ref={mapRef} 
              center={[mapCenter.lat, mapCenter.lng]} 
              attractions={[
                ...attractions.items, 
                ...(data.hotels?.items || []), 
                ...(data.restaurants?.items || [])
              ]} 
              onSelect={(a) => {
                setSelected(a);
                document.getElementById('atracciones')?.scrollIntoView({ behavior: 'smooth' });
              }} 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500">
              Cargando mapa...
            </div>
          )}
        </div>
      </section>

    </PageShell>
  );
};

export default LocationPage;