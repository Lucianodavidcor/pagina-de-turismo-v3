import React from 'react';
import PageShell from '../components/PageShell';
import Map, { MapHandle } from '../components/Map';
import AttractionCard from '../components/AttractionCard';
import ActivityCard from '../components/ActivityCard';
import type { LocationPageData, Attraction, Activity } from '../types';

interface LocationPageProps {
  data: LocationPageData;
}

const LocationPage: React.FC<LocationPageProps> = ({ data }) => {
    const { name, hero, navLinks, bookingButton, accentColor, attractions, activities, gallery, mapCenter } = data;
  const [selected, setSelected] = React.useState<Attraction | null>(null);
  const mapRef = React.useRef<MapHandle | null>(null);
  
    return (
      <PageShell data={data}>
        {/* Attractions Section */}
        <section id="atracciones" className="py-12 bg-gray-50 scroll-mt-16">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">{attractions.title}</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {attractions.items.map((item, index) => (
                <AttractionCard key={index} attraction={item} selected={selected?.title === item.title} onClick={(a) => { setSelected(a); if (mapRef.current) mapRef.current.openPopupAt?.(a.coordinates.lat, a.coordinates.lng); }} accentColor={accentColor} />
              ))}
            </div>
            {selected && (
              <div className="mt-8 bg-white p-6 rounded-lg shadow">
                <h3 className="text-2xl font-bold mb-4">{selected.title}</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <img src={selected.images[0]} alt={selected.title} loading="lazy" className="w-full h-64 object-cover rounded mb-4 bg-gray-100" />
                    <p className="text-gray-700">{selected.description}</p>
                  </div>
                  <div className="p-4">
                    <div className="text-sm text-gray-700 mb-4">
                      <div><strong>Tel:</strong> {selected.phone ?? 'No disponible'}</div>
                      <div><strong>Email:</strong> {selected.email ?? 'No disponible'}</div>
                    </div>
                    <div className="flex flex-col gap-2">
                      {selected.phone && <a href={`tel:${selected.phone}`} className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 text-center">Llamar</a>}
                      {selected.email && <a href={`mailto:${selected.email}`} className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 text-center">Enviar email</a>}
                      <button className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600" onClick={() => { if (mapRef.current) mapRef.current.flyTo?.(selected.coordinates.lat, selected.coordinates.lng, 13); }}>Ver en el mapa</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

      {/* Hotels Section */}
      {data.hotels && (
        <section id="hoteles" className="py-12 bg-white scroll-mt-16">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">{data.hotels.title}</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {data.hotels.items.map((h, i) => (
                <div key={i} className="bg-white rounded-lg shadow p-4">
                  <img src={h.images[0]} alt={h.title} loading="lazy" className="w-full h-40 object-cover rounded mb-3 bg-gray-100" />
                  <h3 className="font-semibold text-lg">{h.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{h.description}</p>
                  <div className="text-sm text-gray-700 mb-3">
                    <div><strong>Tel:</strong> {h.phone ?? 'No disponible'}</div>
                    <div><strong>Email:</strong> {h.email ?? 'No disponible'}</div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { if (mapRef.current) { mapRef.current.flyTo?.(h.coordinates.lat, h.coordinates.lng, 13); mapRef.current.openPopupAt?.(h.coordinates.lat, h.coordinates.lng); } }} className="px-3 py-2 bg-blue-500 text-white rounded">Ver en mapa</button>
                    <a href={`https://www.google.com/maps/search/?api=1&query=${h.coordinates.lat},${h.coordinates.lng}`} target="_blank" rel="noreferrer" className="px-3 py-2 bg-gray-100 rounded">Abrir Google Maps</a>
                    {h.phone && <a href={`tel:${h.phone}`} className="px-3 py-2 bg-gray-100 rounded">Llamar</a>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Restaurants Section */}
      {data.restaurants && (
        <section id="restaurantes" className="py-12 bg-gray-50 scroll-mt-16">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">{data.restaurants.title}</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {data.restaurants.items.map((r, i) => (
                <div key={i} className="bg-white rounded-lg shadow p-4">
                  <img src={r.images[0]} alt={r.title} loading="lazy" className="w-full h-40 object-cover rounded mb-3 bg-gray-100" />
                  <h3 className="font-semibold text-lg">{r.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{r.description}</p>
                  <div className="text-sm text-gray-700 mb-3">
                    <div><strong>Tel:</strong> {r.phone ?? 'No disponible'}</div>
                    <div><strong>Email:</strong> {r.email ?? 'No disponible'}</div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { if (mapRef.current) { mapRef.current.flyTo?.(r.coordinates.lat, r.coordinates.lng, 13); mapRef.current.openPopupAt?.(r.coordinates.lat, r.coordinates.lng); } }} className="px-3 py-2 bg-blue-500 text-white rounded">Ver en mapa</button>
                    <a href={`https://www.google.com/maps/search/?api=1&query=${r.coordinates.lat},${r.coordinates.lng}`} target="_blank" rel="noreferrer" className="px-3 py-2 bg-gray-100 rounded">Abrir Google Maps</a>
                    {r.phone && <a href={`tel:${r.phone}`} className="px-3 py-2 bg-gray-100 rounded">Llamar</a>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

        {/* Activities Section */}
        <section id="actividades" className="py-20 scroll-mt-16">
            <div className="container mx-auto px-6">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">{activities.title}</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {activities.items.map((activity, index) => (
                        <ActivityCard key={index} activity={activity} accentColor={accentColor} />
                    ))}
                </div>
            </div>
        </section>
  
        {/* Gallery Section */}
        <section id="galeria" className="py-20 bg-gray-50 scroll-mt-16">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">{gallery.title}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {gallery.images.map((image, index) => (
                <div key={index} className="overflow-hidden rounded-lg shadow-md aspect-w-1 aspect-h-1">
                  <img src={image} alt={`${name} Gallery Image ${index + 1}`} loading="lazy" className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300 bg-gray-100" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="container mx-auto px-6 py-8">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Map ref={mapRef} center={mapCenter} attractions={attractions.items} onSelect={(a) => setSelected(a)} height="h-80" />
          </div>
        </section>

        {/* Detailed list below the map */}
        <section className="py-8 bg-gray-50">
          <div className="container mx-auto px-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Listado de ubicaciones</h2>
            <p className="text-sm text-gray-600 mb-6">Hacé click en un marcador del mapa para ver más detalles o seleccioná una tarjeta.</p>

            <div className="grid md:grid-cols-3 gap-6">
              {attractions.items.map((item, idx) => (
                <AttractionCard key={idx} attraction={item} selected={selected?.title === item.title} onClick={(a) => { setSelected(a); if (mapRef.current) mapRef.current.openPopupAt?.(a.coordinates.lat, a.coordinates.lng); }} />
              ))}
            </div>
          </div>
        </section>
    </PageShell>
  );
  };
  
  export default LocationPage;
