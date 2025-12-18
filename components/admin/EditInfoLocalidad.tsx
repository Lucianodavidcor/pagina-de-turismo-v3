import React, { useState, useEffect } from 'react';
import { getAllLocations, updateLocation } from '../../services/locations';
import { uploadImages } from '../../services/content';
import type { LocationData } from '../../types';
import LocationPicker from '../ui/LocationPicker';

interface Props {
  locationId: number;
}

const EditInfoLocalidad: React.FC<Props> = ({ locationId }) => {
  // --- ESTADOS DE DATOS ---
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // --- ESTADOS DE INTERFAZ ---
  const [isEditing, setIsEditing] = useState(false);
  const [editingLoc, setEditingLoc] = useState<Partial<LocationData> | null>(null);
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
        setEditingLoc(JSON.parse(JSON.stringify(myLoc)));
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

  // --- HANDLERS ---
  
  const toggleEditing = () => {
    if (isEditing) {
        if (location) setEditingLoc(JSON.parse(JSON.stringify(location)));
        setIsEditing(false);
        setSuccessMsg('');
    } else {
        if (location) setEditingLoc(JSON.parse(JSON.stringify(location)));
        setIsEditing(true);
        setSuccessMsg('');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setUploading(true);
    try {
        const urls = await uploadImages(e.target.files);
        if (urls.length > 0 && editingLoc && editingLoc.hero) {
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

  const handleMapUpdate = (lat: number, lng: number) => {
      if (editingLoc && editingLoc.mapCenter) {
          setEditingLoc({
              ...editingLoc,
              mapCenter: {
                  ...editingLoc.mapCenter,
                  lat: parseFloat(lat.toFixed(6)),
                  lng: parseFloat(lng.toFixed(6))
              }
          });
      }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLoc || !location) return;

    try {
      setUploading(true);
      await updateLocation(location.id, editingLoc);
      
      setLocation(editingLoc as LocationData);
      setSuccessMsg('¡Información actualizada correctamente!');
      setIsEditing(false);
      
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al guardar los cambios.');
    } finally {
        setUploading(false);
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-500 animate-pulse">Cargando información...</div>;
  if (error) return <div className="p-10 text-center text-red-500 font-bold bg-red-50 rounded-lg">{error}</div>;
  if (!location || !editingLoc) return null;

  return (
    <div className="space-y-6 animate-fade-in relative">
      
      {/* HEADER & CONTROLES */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-4">
        <div>
           <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                Mi Localidad: <span className="text-cyan-600">{location.name}</span>
           </h3>
           <p className="text-gray-500 text-sm">
               {isEditing ? 'Edita los campos abajo y guarda los cambios.' : 'Vista previa de cómo los turistas ven tu información.'}
           </p>
        </div>
        
        <div className="flex items-center gap-3">
            {successMsg && !isEditing && (
                <div className="bg-green-100 text-green-700 px-4 py-2 rounded text-sm font-medium animate-fade-in">
                    <i className="fas fa-check-circle mr-2"></i>Guardado
                </div>
            )}

            <button 
                onClick={toggleEditing} 
                className={`px-5 py-2.5 rounded-lg shadow-sm font-medium transition flex items-center gap-2 ${
                    isEditing 
                    ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50' 
                    : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md'
                }`}
            >
                {isEditing ? (
                    <><i className="fas fa-times"></i> Cancelar</>
                ) : (
                    <><i className="fas fa-pen"></i> Editar Info</>
                )}
            </button>
        </div>
      </div>

      {/* --- CONTENIDO --- */}
      
      {!isEditing ? (
        // ================= VISTA DE LECTURA =================
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden animate-fade-in">
            <div className="relative h-64 md:h-80 group">
                <img src={location.hero.image} alt={location.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-8">
                    <div className="text-white drop-shadow-md">
                        <span className="bg-cyan-500/90 text-[10px] font-bold px-2 py-1 rounded mb-2 inline-block backdrop-blur-sm">PORTADA ACTUAL</span>
                        <h2 className="text-4xl font-bold mb-1">{location.hero.title}</h2>
                        <p className="text-lg opacity-90">{location.hero.subtitle}</p>
                    </div>
                </div>
            </div>
            
            <div className="p-8 grid md:grid-cols-2 gap-8 bg-gray-50/30">
                <div className="space-y-5">
                    <h4 className="font-bold text-gray-400 text-xs uppercase tracking-wider border-b pb-2">Configuración General</h4>
                    
                    <div className="grid grid-cols-[120px_1fr] gap-4 items-center">
                        <span className="text-gray-500 text-sm font-medium">Color Marca:</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase w-fit ${
                            location.accentColor === 'cyan' ? 'bg-cyan-100 text-cyan-800' :
                            location.accentColor === 'orange' ? 'bg-orange-100 text-orange-800' :
                            'bg-green-100 text-green-800'
                        }`}>{location.accentColor}</span>
                    </div>

                    <div className="grid grid-cols-[120px_1fr] gap-4 items-center">
                        <span className="text-gray-500 text-sm font-medium">URL Slug:</span>
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm text-gray-600 font-mono">/{location.slug}</code>
                    </div>
                </div>

                <div className="space-y-5">
                    <h4 className="font-bold text-gray-400 text-xs uppercase tracking-wider border-b pb-2">Geolocalización Actual</h4>
                    <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-center gap-4 shadow-sm">
                        <div className="bg-cyan-50 p-3 rounded-full text-cyan-600 text-xl"><i className="fas fa-map-marked-alt"></i></div>
                        <div>
                            <div className="text-xs text-gray-500 uppercase font-bold">Coordenadas</div>
                            <div className="font-mono text-gray-800 mt-1 text-sm">
                                {location.mapCenter.lat}, {location.mapCenter.lng}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

      ) : (
        // ================= VISTA DE EDICIÓN =================
        <form onSubmit={handleSave} className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden animate-fade-in relative">
            
            {/* NUEVO BANNER MEJORADO */}
            <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-6 py-3 flex justify-between items-center shadow-md">
                <div className="flex items-center gap-3">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                    </span>
                    <span className="text-sm font-bold tracking-wide uppercase">Modo Edición Activo</span>
                </div>
                <span className="text-xs text-cyan-100 font-medium hidden sm:inline">Tienes cambios sin guardar</span>
            </div>

            <div className="p-6 md:p-8 space-y-10">
                
                {/* 1. SECCIÓN PRINCIPAL */}
                <section>
                    <h4 className="text-sm font-bold text-gray-800 mb-6 flex items-center gap-3 pb-2 border-b border-gray-100">
                        <span className="w-8 h-8 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center text-sm font-bold shadow-sm">1</span>
                        Información Básica
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-2">NOMBRE VISIBLE</label>
                            <input 
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none transition bg-gray-50 focus:bg-white" 
                                value={editingLoc.name} 
                                onChange={e => setEditingLoc({...editingLoc, name: e.target.value})} 
                                required 
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-2">COLOR DE ACENTO</label>
                            <div className="relative">
                                <select 
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none bg-gray-50 focus:bg-white transition appearance-none" 
                                    value={editingLoc.accentColor} 
                                    onChange={e => setEditingLoc({...editingLoc, accentColor: e.target.value as any})}
                                >
                                    <option value="orange">Naranja (Aventura)</option>
                                    <option value="cyan">Cyan (Agua/Nieve)</option>
                                    <option value="green">Verde (Naturaleza)</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500">
                                    <i className="fas fa-chevron-down text-xs"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2. SECCIÓN HERO - URL REMOVIDA, SOLO UPLOAD */}
                <section>
                    <h4 className="text-sm font-bold text-gray-800 mb-6 flex items-center gap-3 pb-2 border-b border-gray-100">
                        <span className="w-8 h-8 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center text-sm font-bold shadow-sm">2</span>
                        Portada y Textos
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-2">TÍTULO GRANDE</label>
                            <input 
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none transition bg-gray-50 focus:bg-white" 
                                value={editingLoc.hero?.title} 
                                onChange={e => setEditingLoc({...editingLoc, hero: {...editingLoc.hero!, title: e.target.value}})} 
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-2">SUBTÍTULO</label>
                            <input 
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none transition bg-gray-50 focus:bg-white" 
                                value={editingLoc.hero?.subtitle} 
                                onChange={e => setEditingLoc({...editingLoc, hero: {...editingLoc.hero!, subtitle: e.target.value}})} 
                            />
                        </div>
                    </div>

                    {/* ZONA DE CARGA MEJORADA - SIN INPUT URL */}
                    <div className="bg-blue-50/50 rounded-xl p-6 border-2 border-dashed border-blue-200 hover:border-blue-400 transition-colors group">
                        <label className="block text-xs font-bold text-blue-800 mb-4 uppercase tracking-wider">Imagen de Fondo Actual</label>
                        <div className="flex flex-col sm:flex-row gap-6 items-center">
                            {/* Preview */}
                            <div className="w-full sm:w-40 h-28 rounded-lg bg-gray-200 overflow-hidden shadow-md border border-gray-200 relative">
                                <img src={editingLoc.hero?.image} alt="Preview" className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" />
                            </div>

                            {/* Controles de subida */}
                            <div className="flex-1 w-full text-center sm:text-left">
                                <p className="text-sm text-gray-600 mb-3">
                                    Sube una nueva imagen para reemplazar la actual. Se recomienda formato horizontal (1920x1080).
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3 items-center">
                                    <label className={`cursor-pointer inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-cyan-50 hover:text-cyan-700 hover:border-cyan-200 transition shadow-sm w-full sm:w-auto ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                                        {uploading ? <i className="fas fa-circle-notch animate-spin text-cyan-600"></i> : <i className="fas fa-cloud-upload-alt text-cyan-600 text-lg"></i>} 
                                        {uploading ? 'Subiendo...' : 'Seleccionar Archivo'}
                                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                                    </label>
                                    <span className="text-xs text-gray-400">JPG, PNG o WEBP (Max 5MB)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. MAPA INTERACTIVO */}
                <section>
                    <h4 className="text-sm font-bold text-gray-800 mb-6 flex items-center gap-3 pb-2 border-b border-gray-100">
                        <span className="w-8 h-8 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center text-sm font-bold shadow-sm">3</span>
                        Ubicación Geográfica
                    </h4>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                        {/* MAPA */}
                        <div className="order-2 lg:order-1">
                            <label className="block text-xs font-bold text-gray-500 mb-2 flex justify-between">
                                <span>SELECCIONA EN EL MAPA</span>
                                <span className="text-cyan-600 font-normal normal-case text-xs bg-cyan-50 px-2 py-0.5 rounded-full">
                                    <i className="fas fa-mouse-pointer mr-1"></i> Click para mover
                                </span>
                            </label>
                            <LocationPicker 
                                initialLat={editingLoc.mapCenter?.lat || 0}
                                initialLng={editingLoc.mapCenter?.lng || 0}
                                onLocationSelect={handleMapUpdate}
                            />
                        </div>

                        {/* INPUTS MANUALES */}
                        <div className="order-1 lg:order-2 space-y-6">
                            <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
                                <h5 className="text-sm font-bold text-gray-700 mb-2">Ajuste Fino</h5>
                                <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                                    Las coordenadas se actualizan automáticamente al tocar el mapa. Usa estos campos solo si necesitas precisión decimal exacta.
                                </p>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 mb-1">LATITUD</label>
                                        <input 
                                            type="number" step="any"
                                            className="w-full bg-white border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none font-mono text-sm text-gray-700" 
                                            value={editingLoc.mapCenter?.lat} 
                                            onChange={e => setEditingLoc({...editingLoc, mapCenter: {...editingLoc.mapCenter!, lat: parseFloat(e.target.value)}})} 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 mb-1">LONGITUD</label>
                                        <input 
                                            type="number" step="any"
                                            className="w-full bg-white border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none font-mono text-sm text-gray-700" 
                                            value={editingLoc.mapCenter?.lng} 
                                            onChange={e => setEditingLoc({...editingLoc, mapCenter: {...editingLoc.mapCenter!, lng: parseFloat(e.target.value)}})} 
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

            </div>

            {/* ACTION BAR */}
            <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3 sticky bottom-0 z-10 shadow-inner backdrop-blur-sm bg-gray-50/90">
                <button 
                    type="button"
                    onClick={toggleEditing}
                    className="px-6 py-2.5 text-gray-600 font-medium hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    disabled={uploading}
                >
                    Cancelar
                </button>
                <button 
                    type="submit"
                    disabled={uploading}
                    className={`px-8 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold rounded-lg shadow-lg hover:shadow-cyan-500/30 transition transform hover:-translate-y-0.5 active:scale-95 flex items-center gap-2 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {uploading ? (
                        <>Procesando...</>
                    ) : (
                        <><i className="fas fa-save"></i> Guardar Cambios</>
                    )}
                </button>
            </div>
        </form>
      )}
    </div>
  );
};

export default EditInfoLocalidad;