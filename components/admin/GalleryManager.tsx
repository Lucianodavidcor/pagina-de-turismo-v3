import React, { useState, useEffect } from 'react';
import { getGallery, saveGalleryImages, deleteGalleryImage, uploadImages } from '../../services/content';

interface GalleryItem {
  id: number;
  image_url: string;
  caption?: string;
}

interface Props {
  locationId: number;
}

const GalleryManager: React.FC<Props> = ({ locationId }) => {
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadGallery();
  }, [locationId]);

  const loadGallery = async () => {
    setLoading(true);
    try {
      const data = await getGallery(locationId);
      setImages(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar esta imagen de la galería?')) return;
    try {
      await deleteGalleryImage(id);
      setImages(prev => prev.filter(img => img.id !== id));
    } catch (error) {
      alert('Error al eliminar imagen');
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
    setUploading(true);
    try {
      // 1. Subir archivos a Cloudinary
      const urls = await uploadImages(e.target.files);
      
      if (urls.length > 0) {
        // 2. Guardar TODAS las URLs juntas en la base de datos (CORREGIDO)
        await saveGalleryImages(locationId, urls);
        
        // 3. Recargar galería para ver las nuevas fotos
        loadGallery();
      }
    } catch (error) {
      console.error(error);
      alert('Error al subir imágenes');
    } finally {
      setUploading(false);
      e.target.value = ''; // Limpiar input
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h3 className="text-xl font-bold text-gray-800">Galería de Imágenes</h3>
            <p className="text-sm text-gray-500">Estas fotos aparecerán en el carrusel principal de la localidad.</p>
        </div>
        
        <label className={`cursor-pointer bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700 shadow-sm flex items-center gap-2 transition ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
            {uploading ? (
                <>
                    <i className="fas fa-spinner fa-spin"></i> Subiendo...
                </>
            ) : (
                <>
                    <i className="fas fa-cloud-upload-alt"></i> Subir Fotos
                </>
            )}
            <input type="file" multiple accept="image/*" onChange={handleUpload} className="hidden" disabled={uploading} />
        </label>
      </div>

      {loading ? (
        <div className="py-12 text-center text-gray-400">Cargando galería...</div>
      ) : images.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {images.map((img) => (
            <div key={img.id} className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden shadow-sm border hover:shadow-md transition">
              <img src={img.image_url} alt="Galeria" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button 
                    onClick={() => handleDelete(img.id)}
                    className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition transform hover:scale-110 shadow-lg"
                    title="Eliminar imagen"
                >
                    <i className="fas fa-trash-alt"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
            <i className="fas fa-images text-4xl text-gray-300 mb-3"></i>
            <p className="text-gray-500">No hay imágenes en esta galería aún.</p>
            <p className="text-sm text-gray-400">Sube algunas fotos para mostrar la belleza del lugar.</p>
        </div>
      )}
    </div>
  );
};

export default GalleryManager;