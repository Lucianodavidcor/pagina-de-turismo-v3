import React, { useState, useEffect } from 'react';
import { getAllLocations, updateLocation } from '../../services/locations';
import { uploadImages } from '../../services/content'; // <--- IMPORTANTE: Reutilizamos el servicio
import type { LocationData } from '../../types';

interface Props {
  locationId: number;
}

const EditInfoLocalidad: React.FC<Props> = ({ locationId }) => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Estados para el Modal de Edición
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLoc, setEditingLoc] = useState<Partial<LocationData> | null>(null);
  
  // Estado para la subida de imagen
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadLocationData();
  }, [locationId]);

  const loadLocationData = async () => {
    setLoading(true);
    try {
      const allLocs = await getAllLocations();
      const myLoc = allLocs.find(l => l.id === locationId);
      
      if (myLoc) {
        setLocation(myLoc);
      } else {
        setError('No se encontró la información de tu localidad.');
      }
    } catch (err) {
      setError('Error al cargar los datos de la localidad.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = () => {
    if (!location) return;
    setEditingLoc(JSON.parse(JSON.stringify(location))); 
    setIsModalOpen(true);
    setSuccessMsg('');
  };

  // --- LÓGICA DE SUBIDA DE IMAGEN (Adaptada de ForumPage) ---
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setUploading(true);
    try {
        // Reutilizamos el servicio 'uploadImages' existente
        const urls = await uploadImages(e.target.files);
        
        if (urls.length > 0 && editingLoc && editingLoc.hero) {
            // Actualizamos el estado con la nueva URL (usamos la primera imagen subida)
            setEditingLoc({
                ...editingLoc,
                hero: {
                    ...editingLoc.hero,
                    image: urls[0]
                }
            });
        }
    } catch (error) {
        console.error("Error upload:", error);
        alert('Error al subir la imagen. Intenta nuevamente.');
    } finally {
        setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLoc || !location) return;

    try {
      await updateLocation(location.id, editingLoc);
      setSuccessMsg('¡Información actualizada correctamente!');
      setIsModalOpen(false);
      loadLocationData(); 
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al guardar los cambios.');
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-500">Cargando información...</div>;
  if (error) return <div className="p-10 text-center text-red-500 font-bold">{error}</div>;
  if (!location) return null;

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h3 className="text-2xl font-bold text-gray-800">Mi Localidad: <span className="text-cyan-600">{location.name}</span></h3>
           <p className="text-gray-500 text-sm">Gestiona la información principal que ven los turistas.</p>
        </div>
        
        {successMsg && (
            <div className="bg-green-100 text-green-700 px-4 py-2 rounded shadow-sm animate-fade-in">
                <i className="fas fa-check-circle mr-2"></i>{successMsg}
            </div>
        )}

        <button 
          onClick={openEditModal} 
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg shadow hover:bg-blue-700 transition flex items-center gap-2"
        >
          <i className="fas fa-pen"></i> Editar Información
        </button>
      </div>

      {/* TARJETA DE VISTA PREVIA */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="relative h-64 md:h-80 group">
            <img src={location.hero.image} alt={location.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-8">
                <div className="text-white">
                    <span className="bg-cyan-500 text-xs font-bold px-2 py-1 rounded mb-2 inline-block">PORTADA ACTUAL</span>
                    <h2 className="text-4xl font-bold mb-2 shadow-black drop-shadow-lg">{location.hero.title}</h2>
                    <p className="text-lg opacity-90 shadow-black drop-shadow-md">{location.hero.subtitle}</p>
                </div>
            </div>
        </div>
        
        <div className="p-8 grid md:grid-cols-2 gap-8 bg-gray-50/50">
            <div className="space-y-4">
                <h4 className="font-bold text-gray-400 text-xs uppercase tracking-wider border-b pb-2">Configuración General</h4>
                <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Color de Acento:</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        location.accentColor === 'cyan' ? 'bg-cyan-100 text-cyan-800' :
                        location.accentColor === 'orange' ? 'bg-orange-100 text-orange-800' :
                        'bg-green-100 text-green-800'
                    }`}>{location.accentColor}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">URL Slug:</span>
                    <code className="bg-gray-200 px-2 py-1 rounded text-sm text-blue-600 font-mono">/{location.slug}</code>
                </div>
            </div>
            <div className="space-y-4">
                <h4 className="font-bold text-gray-400 text-xs uppercase tracking-wider border-b pb-2">Geolocalización</h4>
                <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-center gap-4 shadow-sm">
                    <div className="bg-cyan-50 p-3 rounded-full text-cyan-600 text-xl"><i className="fas fa-map-marked-alt"></i></div>
                    <div>
                        <div className="text-xs text-gray-500 uppercase font-bold">Coordenadas</div>
                        <div className="font-mono text-gray-800 mt-1">{location.mapCenter.lat}, {location.mapCenter.lng}</div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* --- MODAL DE EDICIÓN --- */}
      {isModalOpen && editingLoc && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[2000] p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in-up">
                
                <div className="p-6 border-b bg-gray-50 flex justify-between items-center sticky top-0 z-10">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <i className="fas fa-edit text-cyan-600"></i> Editar {location.name}
                    </h3>
                    <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                        <i className="fas fa-times text-xl"></i>
                    </button>
                </div>

                <form onSubmit={handleSave} className="p-6 space-y-6">
                    
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold mb-2 text-gray-700">Nombre Visible</label>
                            <input 
                                className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none" 
                                value={editingLoc.name} 
                                onChange={e => setEditingLoc({...editingLoc, name: e.target.value})} 
                                required 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-2 text-gray-700">Slug (URL)</label>
                            <input 
                                className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none bg-gray-50 cursor-not-allowed" 
                                value={editingLoc.slug} 
                                readOnly
                                title="El slug no se debe cambiar para evitar romper enlaces"
                            />
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div>
                            <label className="block text-sm font-bold mb-2 text-gray-700">Color de Acento</label>
                            <select 
                                className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none" 
                                value={editingLoc.accentColor} 
                                onChange={e => setEditingLoc({...editingLoc, accentColor: e.target.value as any})}
                            >
                                <option value="orange">Naranja (Aventura)</option>
                                <option value="cyan">Cyan (Agua/Nieve)</option>
                                <option value="green">Verde (Naturaleza)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-2 text-gray-700">Botón de Reserva</label>
                            <select 
                                className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none" 
                                value={editingLoc.bookingButton ? 'yes' : 'no'} 
                                onChange={e => setEditingLoc({...editingLoc, bookingButton: e.target.value === 'yes'})}
                            >
                                <option value="no">Ocultar</option>
                                <option value="yes">Mostrar</option>
                            </select>
                        </div>
                    </div>

                    {/* SECCIÓN HERO CON SUBIDA DE IMAGEN */}
                    <div className="border-t pt-4">
                        <h4 className="font-bold mb-4 text-cyan-700 text-sm uppercase tracking-wider flex items-center gap-2">
                            <i className="fas fa-image"></i> Portada (Hero Section)
                        </h4>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">TÍTULO PRINCIPAL</label>
                                <input 
                                    className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-cyan-500" 
                                    value={editingLoc.hero?.title} 
                                    onChange={e => setEditingLoc({...editingLoc, hero: {...editingLoc.hero!, title: e.target.value}})} 
                                    required 
                                />
                            </div>
                            
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">IMAGEN DE FONDO</label>
                                <div className="flex gap-2 items-center">
                                    {/* Input de URL (editable manualmente si se quiere) */}
                                    <input 
                                        className="flex-1 border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-cyan-500 font-mono text-sm" 
                                        value={editingLoc.hero?.image} 
                                        onChange={e => setEditingLoc({...editingLoc, hero: {...editingLoc.hero!, image: e.target.value}})} 
                                        placeholder="https://..."
                                        required 
                                    />
                                    
                                    {/* Botón de Subida */}
                                    <label className={`cursor-pointer px-4 py-2.5 rounded-lg border border-gray-300 bg-gray-50 hover:bg-gray-100 transition flex items-center gap-2 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                        {uploading ? (
                                            <i className="fas fa-circle-notch animate-spin text-cyan-600"></i>
                                        ) : (
                                            <i className="fas fa-cloud-upload-alt text-gray-600"></i>
                                        )}
                                        <span className="text-sm font-bold text-gray-700 hidden sm:inline">
                                            {uploading ? 'Subiendo...' : 'Subir'}
                                        </span>
                                        <input 
                                            type="file" 
                                            accept="image/*" 
                                            className="hidden" 
                                            onChange={handleImageUpload}
                                            disabled={uploading}
                                        />
                                    </label>

                                    {/* Previsualización Miniatura */}
                                    {editingLoc.hero?.image && (
                                        <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200 shadow-sm flex-shrink-0">
                                            <img src={editingLoc.hero.image} alt="Prev" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                </div>
                                <p className="text-xs text-gray-400 mt-1">Pega una URL o sube un archivo desde tu dispositivo.</p>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">SUBTÍTULO</label>
                                <input 
                                    className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-cyan-500" 
                                    value={editingLoc.hero?.subtitle} 
                                    onChange={e => setEditingLoc({...editingLoc, hero: {...editingLoc.hero!, subtitle: e.target.value}})} 
                                />
                            </div>
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <h4 className="font-bold mb-4 text-cyan-700 text-sm uppercase tracking-wider flex items-center gap-2">
                            <i className="fas fa-map-marker-alt"></i> Centro del Mapa
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">LATITUD</label>
                                <input 
                                    type="number" step="any" 
                                    className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-cyan-500" 
                                    value={editingLoc.mapCenter?.lat} 
                                    onChange={e => setEditingLoc({...editingLoc, mapCenter: {...editingLoc.mapCenter!, lat: parseFloat(e.target.value)}})} 
                                    required 
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">LONGITUD</label>
                                <input 
                                    type="number" step="any" 
                                    className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-cyan-500" 
                                    value={editingLoc.mapCenter?.lng} 
                                    onChange={e => setEditingLoc({...editingLoc, mapCenter: {...editingLoc.mapCenter!, lng: parseFloat(e.target.value)}})} 
                                    required 
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t bg-white sticky bottom-0">
                        <button 
                            type="button" 
                            onClick={() => setIsModalOpen(false)} 
                            className="px-5 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition"
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit" 
                            disabled={uploading}
                            className={`px-6 py-2.5 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 font-bold shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <i className="fas fa-save mr-2"></i> Guardar Cambios
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default EditInfoLocalidad;