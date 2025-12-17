import React, { useEffect } from 'react';

interface Props {
  images: string[];
  isOpen: boolean;
  onClose: () => void;
  currentIndex: number;
  onNext?: () => void;
  onPrev?: () => void;
}

const Lightbox: React.FC<Props> = ({ images, isOpen, onClose, currentIndex, onNext, onPrev }) => {
  // Manejo de teclado (ESC para cerrar, Flechas para mover)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && onNext) onNext();
      if (e.key === 'ArrowLeft' && onPrev) onPrev();
    };

    if (isOpen) {
        document.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden'; // Evita que la página de fondo se mueva
    }
    
    return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, onNext, onPrev]);

  if (!isOpen || !images[currentIndex]) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center animate-fade-in" onClick={onClose}>
      
      {/* Botón Cerrar */}
      <button 
        onClick={onClose} 
        className="absolute top-5 right-5 text-white/70 hover:text-white text-5xl z-50 transition p-2 focus:outline-none hover:rotate-90 duration-300"
      >
        &times;
      </button>

      {/* Flecha Izquierda */}
      {onPrev && images.length > 1 && (
          <button 
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-white/20 text-white rounded-full p-4 transition hover:scale-110 hidden md:flex items-center justify-center w-12 h-12"
          >
            <i className="fas fa-chevron-left"></i>
          </button>
      )}

      {/* Imagen Principal */}
      <div 
        className="max-w-7xl max-h-[90vh] relative px-4 flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()} // Click en la imagen no cierra
      >
        <img 
            src={images[currentIndex]} 
            alt={`Galería ${currentIndex + 1}`} 
            className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl border border-white/10" 
        />
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/60 px-4 py-1 rounded-full text-white/80 text-xs tracking-widest backdrop-blur-sm">
            {currentIndex + 1} / {images.length}
        </div>
      </div>

      {/* Flecha Derecha */}
      {onNext && images.length > 1 && (
          <button 
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-white/20 text-white rounded-full p-4 transition hover:scale-110 hidden md:flex items-center justify-center w-12 h-12"
          >
            <i className="fas fa-chevron-right"></i>
          </button>
      )}
    </div>
  );
};

export default Lightbox;