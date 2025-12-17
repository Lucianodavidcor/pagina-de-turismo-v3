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
  const detailSectionRef = useRef<HTMLDivElement>(null);

  // Estados Lightbox
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // --- LÓGICA DE NAVEGACIÓN ENTRE ATRACCIONES ---
  const currentAttractionIndex = data?.attractions.items.findIndex(item => item.title === selected?.title) ?? -1;
  const isInsideAttractionsList = currentAttractionIndex !== -1;

  const navigateAttraction = (direction: 'next' | 'prev') => {
    if (!data || !isInsideAttractionsList) return;
    
    const list = data.attractions.items;
    const listLength = list.length;
    let newIndex;

    if (direction === 'next') {
        newIndex = (currentAttractionIndex + 1) % listLength;
    } else {
        newIndex = (currentAttractionIndex - 1 + listLength) % listLength;
    }

    const newItem = list[newIndex];
    setSelected(newItem);
    mapRef.current?.flyTo?.(newItem.coordinates.lat, newItem.coordinates.lng);
  };

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

  useEffect(() => {
    if (selected && detailSectionRef.current) {
        setTimeout(() => {
            detailSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    }
  }, [selected]);


  // Funciones de Galería
  const openMainGallery = (index: number) => {
    if (!data) return;
    setLightboxImages(data.gallery.images);
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const openAttractionGallery = (images: string[], index: number = 0) => {
    setLightboxImages(images); 
    setCurrentImageIndex(index); 
    setLightboxOpen(true);
  }

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % lightboxImages.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + lightboxImages.length) % lightboxImages.length);
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

  const getButtonStyle = (type: 'solid' | 'outline') => {
    const base = "w-full py-3 rounded-lg text-sm font-bold transition-all duration-300 flex items-center justify-center shadow-sm hover:shadow-md";
    const colors = {
        cyan: { solid: 'bg-cyan-600 hover:bg-cyan-700 text-white', outline: 'border-2 border-cyan-600 text-cyan-700 hover:bg-cyan-50' },
        orange: { solid: 'bg-orange-600 hover:bg-orange-700 text-white', outline: 'border-2 border-orange-600 text-orange-700 hover:bg-orange-50' },
        green: { solid: 'bg-green-600 hover:bg-green-700 text-white', outline: 'border-2 border-green-600 text-green-700 hover:bg-green-50' },
    }[accentColor] || { solid: 'bg-gray-800 text-white', outline: 'border-gray-800 text-gray-800' };

    return `${base} ${type === 'solid' ? colors.solid : colors.outline}`;
  };


  return (
    <PageShell data={data}>
      
      {/* SECCIÓN DE ATRACCIONES */}
      <section id="atracciones" className="py-16 bg-gray-50 scroll-mt-24 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-gradient-to-b from-gray-100/50 to-transparent opacity-70 pointer-events-none"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
             <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-3">{attractions.title}</h2>
             <p className="text-lg text-gray-600 max-w-2xl mx-auto">Los imperdibles que definen la esencia de este destino.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {attractions.items.map((item, index) => (
              <AttractionCard 
                key={item.id || index} 
                attraction={item} 
                selected={selected?.title === item.title} 
                onClick={(a) => { 
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
            <div 
                ref={detailSectionRef}
                className="mt-16 bg-white rounded-[2rem] shadow-2xl border border-gray-100/80 overflow-hidden animate-fade-in-up relative scroll-mt-32 ring-1 ring-black/5"
            >
              <div className="grid md:grid-cols-5 relative">
                
                {/* COLUMNA IZQUIERDA */}
                <div className="md:col-span-3 p-8 md:p-10 flex flex-col h-full">
                   
                   {/* HEADER CON NAVEGACIÓN */}
                   <div className="flex flex-col-reverse md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                      <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight tracking-tight">
                        {selected.title}
                      </h3>
                      
                      {/* TOOLBAR */}
                      <div className="flex items-center gap-2 bg-gray-100 p-1.5 rounded-full self-end md:self-auto">
                        {isInsideAttractionsList && (
                            <button 
                                onClick={() => navigateAttraction('prev')}
                                className="w-10 h-10 flex items-center justify-center rounded-full bg-white hover:bg-gray-200 text-gray-600 hover:text-gray-900 shadow-sm transition-all focus:outline-none group"
                                title="Atracción Anterior"
                            >
                                <i className="fas fa-chevron-left transform group-hover:-translate-x-0.5 transition-transform"></i>
                            </button>
                        )}
                        {isInsideAttractionsList && (
                             <div className="w-px h-6 bg-gray-300 mx-1"></div>
                        )}
                        {isInsideAttractionsList && (
                            <button 
                                onClick={() => navigateAttraction('next')}
                                className="w-10 h-10 flex items-center justify-center rounded-full bg-white hover:bg-gray-200 text-gray-600 hover:text-gray-900 shadow-sm transition-all focus:outline-none group"
                                title="Siguiente Atracción"
                            >
                                <i className="fas fa-chevron-right transform group-hover:translate-x-0.5 transition-transform"></i>
                            </button>
                        )}
                        <button 
                            onClick={() => setSelected(null)} 
                            className="w-10 h-10 flex items-center justify-center rounded-full bg-red-100 hover:bg-red-200 text-red-500 hover:text-red-700 transition-colors ml-2 focus:outline-none"
                            title="Cerrar Detalle"
                        >
                            <i className="fas fa-times text-lg"></i>
                        </button>
                      </div>
                   </div>

                   {/* IMAGEN PRINCIPAL */}
                   <div 
                     className="group relative h-[350px] md:h-[450px] w-full rounded-2xl overflow-hidden cursor-pointer shadow-lg mb-4 bg-gray-100"
                     onClick={() => selected.images.length > 0 && openAttractionGallery(selected.images, 0)}
                   >
                      {selected.images.length > 0 ? (
                        <>
                          <img 
                            src={selected.images[0]} 
                            alt={selected.title} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                          />
                          {selected.images.length > 1 && (
                            <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 pointer-events-none">
                                <i className="fas fa-camera"></i>
                                <span>1 / {selected.images.length}</span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                              <div className="bg-white/90 text-gray-800 px-4 py-2 rounded-full flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0 shadow-lg backdrop-blur-sm">
                                <i className="fas fa-expand text-lg"></i>
                                <span className="font-bold text-sm">Ver Galería</span>
                              </div>
                          </div>
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 font-medium bg-gray-50">
                            <i className="fas fa-image text-4xl mb-2 opacity-50"></i>
                            <span>Sin imagen disponible</span>
                        </div>
                      )}
                   </div>

                   {/* MINIATURAS */}
                   {selected.images.length > 1 && (
                     <div className="grid grid-cols-5 gap-3 mb-8">
                        {selected.images.slice(0, 5).map((img, idx) => (
                           <div 
                             key={idx}
                             onClick={() => openAttractionGallery(selected.images, idx)}
                             className={`
                               relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-200
                               ${idx === 0 ? `border-${accentColor}-500 ring-2 ring-${accentColor}-100` : 'border-transparent hover:border-gray-300'}
                             `}
                           >
                             <img src={img} alt={`Vista ${idx}`} className="w-full h-full object-cover" />
                             {idx === 4 && selected.images.length > 5 && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-bold text-sm">
                                   +{selected.images.length - 5}
                                </div>
                             )}
                           </div>
                        ))}
                     </div>
                   )}

                   <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed animate-fade-in">
                     <p>{selected.description}</p>
                   </div>
                </div>
                
                {/* COLUMNA DERECHA */}
                <div className="md:col-span-2 bg-gray-50/80 p-8 md:p-10 border-t md:border-t-0 md:border-l border-gray-100 flex flex-col justify-center">
                  
                  {(selected.phone || selected.email) && (
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 animate-fade-in">
                      <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                        <i className={`fas fa-info-circle mr-3 text-${accentColor}-600`}></i>
                        Información Útil
                      </h4>
                      <div className="space-y-4">
                        {selected.phone && (
                           <div className="flex items-start">
                             <i className="fas fa-phone-alt mt-1 mr-3 text-gray-400 w-5"></i>
                             <div>
                               <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Teléfono</span>
                               <span className="text-gray-800 font-medium">{selected.phone}</span>
                             </div>
                           </div>
                        )}
                         {selected.email && (
                           <div className="flex items-start">
                             <i className="fas fa-envelope mt-1 mr-3 text-gray-400 w-5"></i>
                             <div>
                               <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Email</span>
                               <span className="text-gray-800 font-medium break-all">{selected.email}</span>
                             </div>
                           </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex flex-col gap-4 animate-fade-in" style={{ animationDelay: '100ms' }}>
                    {selected.phone && (
                      <a href={`tel:${selected.phone}`} className={getButtonStyle('outline')}>
                        <i className="fas fa-phone mr-3"></i> Llamar ahora
                      </a>
                    )}
                    <button 
                      className={getButtonStyle('solid')}
                      onClick={() => {
                          mapRef.current?.flyTo?.(selected.coordinates.lat, selected.coordinates.lng);
                          document.getElementById('mapa-ubicacion')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      <i className="fas fa-map-marker-alt mr-3 animate-bounce-slow"></i> Ver ubicación en Mapa
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
        <section id="hoteles" className="py-16 bg-white scroll-mt-24">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">{data.hotels.title}</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {data.hotels.items.map((h, i) => (
                <AttractionCard 
                  key={h.id || i} 
                  attraction={h} 
                  accentColor={accentColor} 
                  onClick={(a) => {
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
        <section id="restaurantes" className="py-16 bg-gray-50 scroll-mt-24">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">{data.restaurants.title}</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {data.restaurants.items.map((r, i) => (
                <AttractionCard 
                  key={r.id || i} 
                  attraction={r} 
                  accentColor={accentColor} 
                  onClick={(a) => {
                      mapRef.current?.flyTo?.(a.coordinates.lat, a.coordinates.lng);
                  }} 
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* --- SECCIÓN DE ACTIVIDADES (RENOVADA) --- */}
      <section id="actividades" className="py-24 bg-gradient-to-b from-white to-gray-50 scroll-mt-24 relative overflow-hidden">
          
          {/* Elementos Decorativos de Fondo (Blobs) */}
          <div className={`absolute top-0 right-0 w-[500px] h-[500px] bg-${accentColor}-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob`}></div>
          <div className={`absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000`}></div>

          <div className="container mx-auto px-6 relative z-10">
              
              <div className="text-center mb-16">
                  <div className={`inline-block px-4 py-1 rounded-full bg-${accentColor}-50 text-${accentColor}-600 text-sm font-bold tracking-wide mb-4`}>
                    EXPERIENCIAS ÚNICAS
                  </div>
                  <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-6">
                      {activities.title}
                  </h2>
                  <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
                      No solo visites, <span className={`text-${accentColor}-600 font-semibold`}>vive el lugar</span>. Descubre las actividades mejor valoradas por los viajeros.
                  </p>
              </div>

              {/* Grid Mejorada: Más espacio, menos columnas (4 en lugar de 6) para que luzcan las fotos */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                  {activities.items.map((act, i) => (
                      <div 
                        key={act.id || i}
                        className="transform transition-all duration-300 hover:-translate-y-2"
                      >
                          {/* Wrapper para añadir sombra extra al hover sin tocar el componente interno */}
                          <div className="h-full rounded-xl hover:shadow-2xl transition-shadow duration-300 bg-white">
                             <ActivityCard activity={act} accentColor={accentColor} />
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* SECCIÓN DE MAPA */}
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
                        }} 
                        height="h-[500px] md:h-[600px]" 
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-500">
                        Cargando mapa...
                    </div>
                )}
            </div>
        </div>
      </section>

      {/* SECCIÓN DE GALERÍA */}
      <section id="galeria" className="py-20 bg-gray-50 scroll-mt-24">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">{gallery.title}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {gallery.images.map((image, index) => (
                <div 
                    key={index} 
                    onClick={() => openMainGallery(index)} 
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

      {/* Lightbox */}
      <Lightbox 
        images={lightboxImages} 
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