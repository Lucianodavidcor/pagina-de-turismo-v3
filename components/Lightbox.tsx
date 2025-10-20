import React from 'react';

interface Props {
  src: string | null;
  onClose: () => void;
}

const Lightbox: React.FC<Props> = ({ src, onClose }) => {
  if (!src) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center" onClick={onClose}>
      <div className="max-w-4xl max-h-[80vh]">
        <img src={src} alt="lightbox" className="w-full h-auto rounded shadow-lg" />
      </div>
    </div>
  );
};

export default Lightbox;
