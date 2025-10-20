import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { BUTA_RANQUIL_DATA, CHOS_MALAL_DATA } from '../constants';
import type { LocationPageData } from '../types';
import PageShell from '../components/PageShell';
import ActivityCard from '../components/ActivityCard';
import AttractionCard from '../components/AttractionCard';

const locationDataMap: Record<string, LocationPageData> = {
  'buta-ranquil': BUTA_RANQUIL_DATA,
  'chos-malal': CHOS_MALAL_DATA,
};

const DetailPage: React.FC = () => {
  const { location, page } = useParams<{ location: string; page: string }>();

  if (!location || !page) {
    return <Navigate to="/" />;
  }

  const data = locationDataMap[location];
  if (!data) {
    return <Navigate to="/" />;
  }
  
  const pageContent = data.detailPages[page];

  return (
    <PageShell data={data}>
      <div className="container mx-auto px-6 py-8">
        {pageContent ? (
          <>
            <h1 className="text-4xl font-bold text-gray-800 mb-8">{pageContent.title}</h1>
            {/* Render richer content for certain slugs */}
            {page === 'actividades' && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {data.activities.items.map((act, i) => (
                  <ActivityCard key={i} activity={act} accentColor={data.accentColor} />
                ))}
              </div>
            )}
            {page === 'atracciones' && (
              <div className="grid md:grid-cols-3 gap-6">
                {data.attractions.items.map((at, i) => (
                  <AttractionCard key={i} attraction={at} accentColor={data.accentColor} />
                ))}
              </div>
            )}
            {page === 'galeria' && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {data.gallery.images.map((img, i) => (
                  <div key={i} className="overflow-hidden rounded-lg shadow-md">
                    <img src={img} alt={`Gallery ${i}`} loading="lazy" className="w-full h-48 object-cover bg-gray-100" />
                  </div>
                ))}
              </div>
            )}

            {/* Fallback to original content if not one of the known slugs */}
            {!['actividades','atracciones','galeria'].includes(page || '') && (
              <div className="prose lg:prose-xl max-w-none text-gray-600">
                {pageContent.content}
              </div>
            )}
          </>
        ) : (
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Contenido no disponible</h1>
            <p className="text-gray-600">Este contenido estará disponible próximamente. ¡Vuelve a visitarnos!</p>
          </div>
        )}
      </div>
    </PageShell>
  );
};

export default DetailPage;