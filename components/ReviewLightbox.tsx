import React, { useEffect, useState } from 'react';
// Importamos la interfaz del servicio para mantener la consistencia de tipos
import { ForumPost } from '../services/forum'; 

interface Props {
  post: ForumPost | null;
  isOpen: boolean;
  onClose: () => void;
}

const ReviewLightbox: React.FC<Props> = ({ post, isOpen, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen, post]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && post?.images && post.images.length > 1) {
        setCurrentIndex(prev => (prev + 1) % post.images.length);
      }
      if (e.key === 'ArrowLeft' && post?.images && post.images.length > 1) {
        setCurrentIndex(prev => (prev - 1 + post.images.length) % post.images.length);
      }
    };

    if (isOpen) document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, post]);

  if (!isOpen || !post) return null;

  const hasImages = post.images && post.images.length > 0;

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 md:p-10 animate-fade-in" onClick={onClose}>
      
      {/* Botón Cerrar Global */}
      <button onClick={onClose} className="absolute top-5 right-5 text-white/70 hover:text-white text-4xl z-[110] transition-all hover:rotate-90">
        &times;
      </button>

      {/* CONTENEDOR PRINCIPAL: Altura y ancho constantes */}
      <div 
        className="bg-white w-full max-w-6xl h-[85vh] md:h-[80vh] rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-2xl animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* LADO IZQUIERDO: IMÁGENES (RELLENO TOTAL) */}
        <div className="flex-1 bg-gray-900 flex items-center justify-center relative min-h-[40%] md:min-h-0 h-full overflow-hidden">
          {hasImages ? (
            <>
              {/* CAMBIO CLAVE: object-cover 
                Esto hace que la imagen rellene todo el div, recortando los bordes excedentes 
                pero manteniendo la proporción (estilo Instagram).
              */}
              <img 
                src={post.images[currentIndex]} 
                alt="Review" 
                className="w-full h-full object-cover select-none transition-all duration-500"
              />
              
              {/* Gradiente sutil inferior para ver mejor los controles sobre la imagen */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>

              {/* Controles de Navegación */}
              {post.images.length > 1 && (
                <>
                  <button 
                    onClick={() => setCurrentIndex(prev => (prev - 1 + post.images.length) % post.images.length)}
                    className="absolute left-4 bg-white/10 hover:bg-white/30 backdrop-blur-md text-white w-12 h-12 rounded-full flex items-center justify-center transition-all z-10 border border-white/20"
                  >
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  <button 
                    onClick={() => setCurrentIndex(prev => (prev + 1) % post.images.length)}
                    className="absolute right-4 bg-white/10 hover:bg-white/30 backdrop-blur-md text-white w-12 h-12 rounded-full flex items-center justify-center transition-all z-10 border border-white/20"
                  >
                    <i className="fas fa-chevron-right"></i>
                  </button>
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] text-white font-bold tracking-[0.2em]">
                    {currentIndex + 1} / {post.images.length}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="text-gray-500 flex flex-col items-center gap-2">
              <i className="fas fa-image text-5xl opacity-20"></i>
              <span className="text-xs uppercase font-bold tracking-widest">Sin fotos</span>
            </div>
          )}
        </div>

        {/* LADO DERECHO: SIDEBAR DE INFORMACIÓN (Ancho Fijo) */}
        <div className="w-full md:w-[420px] h-full flex flex-col bg-white border-l border-gray-100 shrink-0">
          
          {/* Header del Sidebar */}
          <div className="p-6 border-b border-gray-50 flex items-center gap-4 shrink-0">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 shadow-md">
              <div className="w-full h-full rounded-full bg-white overflow-hidden flex items-center justify-center">
                {post.avatar_url ? (
                  <img src={post.avatar_url} className="w-full h-full object-cover" alt={post.author} />
                ) : (
                  <span className="font-extrabold text-gray-300">{post.author.charAt(0)}</span>
                )}
              </div>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 leading-none mb-1">{post.author}</h4>
              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                {post.created_at ? new Date(post.created_at).toLocaleDateString() : 'Reciente'}
              </p>
            </div>
          </div>

          {/* Cuerpo con Scroll Interno */}
          <div className="p-8 space-y-8 flex-1 overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center">
              <span className="bg-cyan-50 text-cyan-700 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border border-cyan-100">
                <i className="fas fa-map-marker-alt mr-1.5 text-cyan-500"></i> {post.location_name || 'Neuquén'}
              </span>
              <div className="flex text-yellow-400 text-sm bg-yellow-50 px-2 py-1 rounded-md">
                {[...Array(5)].map((_, i) => (
                  <i key={i} className={`fas fa-star ${i < post.rating ? '' : 'text-gray-200'}`}></i>
                ))}
              </div>
            </div>

            <div className="relative">
              <i className="fas fa-quote-left text-4xl text-gray-100 absolute -top-6 -left-2 -z-10"></i>
              <p className="text-gray-700 leading-loose text-base italic font-medium relative z-10">
                {post.text}
              </p>
            </div>
          </div>

          {/* Footer del Sidebar (Solo Móvil) */}
          <div className="p-4 bg-gray-50 mt-auto md:hidden shrink-0">
            <button onClick={onClose} className="w-full py-4 bg-cyan-600 text-white font-black rounded-xl text-xs uppercase tracking-widest transition active:scale-95 shadow-lg shadow-cyan-200">
              Cerrar Detalle
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ReviewLightbox;