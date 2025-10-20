import React from 'react';
import type { Attraction } from '../types';
import Lightbox from './Lightbox';

interface Props {
  attraction: Attraction;
  selected?: boolean;
  onClick?: (a: Attraction) => void;
  accentColor?: 'orange' | 'cyan' | 'green';
}

const AttractionCard: React.FC<Props> = ({ attraction, selected = false, onClick, accentColor = 'orange' }) => {
  const [lightboxSrc, setLightboxSrc] = React.useState<string | null>(null);
  let ringClass = '';
  if (selected) {
    if (accentColor === 'cyan') ringClass = 'ring-2 ring-cyan-400';
    else if (accentColor === 'green') ringClass = 'ring-2 ring-green-400';
    else ringClass = 'ring-2 ring-orange-400';
  }
  return (
    <div onClick={() => onClick?.(attraction)} className={`bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 cursor-pointer ${ringClass}`}>
      <div className="relative">
        {/* CORRECCIÓN 1: Usa la primera imagen del arreglo */}
        <img src={attraction.images[0]} alt={attraction.title} loading="lazy" className="w-full h-44 object-cover bg-gray-100" />
        <div className="absolute bottom-2 left-2 bg-black/40 text-white px-3 py-1 rounded">{attraction.title}</div>
      </div>
      <div className="p-4">
        <p className="text-gray-600 text-sm mb-3 line-clamp-3">{attraction.description}</p>
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            <div><strong>Tel:</strong> {attraction.phone ?? 'No disponible'}</div>
            <div><strong>Email:</strong> {attraction.email ?? 'No disponible'}</div>
          </div>
          <div className="flex flex-col items-end gap-2">
            {attraction.phone && <a href={`tel:${attraction.phone}`} className="text-sm px-3 py-1 bg-gray-100 rounded hover:bg-gray-200">Llamar</a>}
            {attraction.email && <a href={`mailto:${attraction.email}`} className="text-sm px-3 py-1 bg-gray-100 rounded hover:bg-gray-200">Email</a>}
          </div>
        </div>
        {selected && (
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Fotos</h4>
            {/* CORRECCIÓN 2: Itera sobre el arreglo 'attraction.images' */}
            <div className="grid grid-cols-3 gap-2">
              {attraction.images.map((img, i) => (
                <img key={i} src={img} alt={`gal${i}`} loading="lazy" className="w-full h-20 object-cover rounded cursor-pointer bg-gray-100" onClick={(e) => { e.stopPropagation(); setLightboxSrc(img); }} />
              ))}
            </div>
            <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AttractionCard;