import React, { useState, useRef, useEffect } from 'react';
import { useParams, useLocation as useRouterLocation } from 'react-router-dom';
import PageShell from '../components/PageShell';
import Map, { MapHandle } from '../components/Map';
import AttractionCard from '../components/AttractionCard';
import ActivityCard from '../components/ActivityCard';
import Lightbox from '../components/Lightbox';
import { useLocation } from '../hooks/useLocation';
import type { Attraction } from '../types';

interface LocationPageProps {
  slugProp?: string;
}

const LocationPage: React.FC<LocationPageProps> = ({ slugProp }) => {
  const params = useParams<{ location: string }>();
  const activeSlug = slugProp || params.location || '';
  const { hash } = useRouterLocation(); 

  const { data, loading, error } = useLocation(activeSlug);
  
  // Estados locales
  const [selected, setSelected] = useState<Attraction | null>(null);
  const mapRef = useRef<MapHandle | null>(null);

  // Estados para la Galería (Lightbox)
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Scroll automático SOLO inicial (si vienes de un link externo)
  useEffect(() => {
    if (!loading && data && hash) {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, [loading, data, hash]);

  // Funciones para la Galería
  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const handleNextImage = () => {
    if (!data) return;
    setCurrentImageIndex((prev) => (prev + 1) % data.gallery.images.length);
  };

  const handlePrevImage = () => {
    if (!data) return;
    setCurrentImageIndex((prev) => (prev - 1 + data.gallery.images.length) % data.gallery.images.length);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600 font-medium">Cargando experiencia...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
        <div className="text-red-500 text-6xl mb-4"><i className="fas fa-exclamation-circle"></i></div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Ups, algo salió mal</h2>
        <p className="text-gray-600">{error || 'No pudimos encontrar esta localidad.'}</p>
        <a href="/" className="mt-6 px-6 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700 transition">Volver al Inicio</a>
      </div>
    );
  }

  const { accentColor, attractions, activities, gallery, mapCenter } = data;

  return (
    <PageShell data={data}>
      
      {/* SECCIÓN DE ATRACCIONES */}
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
                  // FIX: Seleccionamos y movemos el mapa, PERO SIN SCROLL
                  setSelected(a); 
                  if (mapRef.current && mapCenter) {
                    mapRef.current.openPopupAt?.(a.coordinates.lat, a.coordinates.lng);
                  }
                }} 
                accentColor={accentColor} 
              />
            ))}
          </div>

          {/* DETALLE ATRACCIÓN */}
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
                    <img src={selected.images[0]} alt={selected.title} className="w-full h-64 object-cover rounded mb-4 bg-gray-200" />
                  ) : (
                    <div className="w-full h-64 bg-gray-200 rounded mb-4 flex items-center justify-center text-gray-500">Sin imagen disponible</div>
                  )}
                  <p className="text-gray-700 leading-relaxed">{selected.description}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded h-fit">
                  <div className="space-y-3 mb-6">
                    <div className="text-sm"><span className="font-bold block text-gray-800">Teléfono:</span> {selected.phone || 'No disponible'}</div>
                    <div className="text-sm"><span className="font-bold block text-gray-800">Email:</span> {selected.email || 'No disponible'}</div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    {selected.phone && (
                      <a href={`tel:${selected.phone}`} className="w-full py-2 bg-white border border-gray-300 rounded text-center hover:bg-gray-100 text-sm font-medium transition">
                        <i className="fas fa-phone mr-2"></i> Llamar
                      </a>
                    )}
                    <button 
                      className={`w-full py-2 text-white rounded text-sm font-medium transition shadow-sm ${accentColor === 'orange' ? 'bg-orange-500 hover:bg-orange-600' : accentColor === 'cyan' ? 'bg-cyan-500 hover:bg-cyan-600' : 'bg-green-600 hover:bg-green-700'}`}
                      onClick={() => {
                          // AQUÍ SÍ dejamos el scroll porque es un botón explícito de "Ver en Mapa"
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
                      // FIX: Solo mueve el mapa, sin scroll
                      mapRef.current?.flyTo?.(a.coordinates.lat, a.coordinates.lng);
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
                      // FIX: Solo mueve el mapa, sin scroll
                      mapRef.current?.flyTo?.(a.coordinates.lat, a.coordinates.lng);
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

      {/* SECCIÓN DE GALERÍA (Tu diseño mejorado) */}
      <section id="galeria" className="py-20 bg-gray-50 scroll-mt-24">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">{gallery.title}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {gallery.images.map((image, index) => (
                <div 
                    key={index} 
                    onClick={() => openLightbox(index)}
                    className="group relative aspect-square overflow-hidden rounded-xl shadow-md cursor-pointer transform transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <img 
                    src={image} 
                    alt={`Galería ${index + 1}`} 
                    loading="lazy" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <i className="fas fa-search-plus text-white text-3xl drop-shadow-lg"></i>
                  </div>
                </div>
              ))}
            </div>
          </div>
      </section>   

      {/* SECCIÓN DE MAPA (Tu diseño Premium, sin scroll automático) */}
      <section id="mapa-ubicacion" className="py-20 bg-slate-900 text-white scroll-mt-24">
        <div className="container mx-auto px-6">
            
            <div className="text-center mb-10">
                <h2 className="text-4xl font-extrabold mb-4 tracking-tight">Ubicación y Puntos de Interés</h2>
                <p className="text-slate-400 max-w-2xl mx-auto text-lg">Explora la geografía única de esta zona y encuentra fácilmente todas las atracciones en nuestro mapa interactivo.</p>
                <div className="w-24 h-1 bg-cyan-500 mx-auto rounded-full mt-6"></div>
            </div>

            <div className="relative z-0 rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-800 bg-slate-800">
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
                            // FIX: Eliminado scroll hacia arriba al tocar el mapa
                        }} 
                        height="h-[500px] md:h-[600px]" 
                    />
                ) : (
                    <div className="w-full h-[500px] flex items-center justify-center bg-slate-800 text-slate-500">
                        Cargando mapa...
                    </div>
                )}
            </div>
        </div>
      </section>

      {/* Lightbox */}
      <Lightbox 
        images={gallery.images} 
        isOpen={lightboxOpen} 
        onClose={() => setLightboxOpen(false)} 
        currentIndex={currentImageIndex}
        onNext={handleNextImage}
        onPrev={handlePrevImage}
      />

    </PageShell>
  );
};

export default LocationPage;