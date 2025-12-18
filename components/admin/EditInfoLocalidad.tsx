import React, { useState, useEffect } from 'react';
import { getAllLocations, updateLocation } from '../../services/locations';
import { uploadImages } from '../../services/content';
import type { LocationData } from '../../types';
import LocationPicker from '../ui/LocationPicker'; // <--- Importamos el nuevo componente

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
        // Pre-cargamos los datos de edición
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
        // Cancelar: revertir cambios
        if (location) setEditingLoc(JSON.parse(JSON.stringify(location)));
        setIsEditing(false);
        setSuccessMsg('');
    } else {
        // Habilitar: asegurar copia fresca
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

  // Handler específico para el mapa
  const handleMapUpdate = (lat: number, lng: number) => {
      if (editingLoc && editingLoc.mapCenter) {
          setEditingLoc({
              ...editingLoc,
              mapCenter: {
                  ...editingLoc.mapCenter,
                  lat: parseFloat(lat.toFixed(6)), // Redondear para limpieza visual
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
                {isEditing && <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded border border-yellow-200 uppercase">Modo Edición</span>}
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

      {/* --- CONTENIDO PRINCIPAL --- */}
      
      {!isEditing ? (
        // ================= VISTA DE LECTURA =================
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden animate-fade-in">
            {/* Hero Image Preview */}
            <div className="relative h-64 md:h-80 group">
                <img src={location.hero.image} alt={location.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-8">
                    <div className="text-white drop-shadow-md">
                        <span className="bg-cyan-500/90 text-[10px] font-bold px-2 py-1 rounded mb-2 inline-block backdrop-blur-sm">HERO SECTION</span>
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
                        <span className="text-gray-500 text-sm font-medium">Botón Reserva:</span>
                        <span className={`text-sm font-semibold flex items-center gap-2 ${location.bookingButton ? 'text-green-600' : 'text-gray-400'}`}>
                            <i className={`fas ${location.bookingButton ? 'fa-check-circle' : 'fa-ban'}`}></i>
                            {location.bookingButton ? 'Visible' : 'Oculto'}
                        </span>
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
        <form onSubmit={handleSave} className="bg-white rounded-xl shadow-xl border-2 border-cyan-500 overflow-hidden animate-fade-in relative">
            
            <div className="bg-cyan-50 text-cyan-800 text-xs font-bold text-center py-1 uppercase tracking-widest">
                Modo Edición Activo
            </div>

            <div className="p-6 md:p-8 space-y-8">
                
                {/* 1. SECCIÓN PRINCIPAL */}
                <section>
                    <h4 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center text-xs font-bold">1</span>
                        Información Básica
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">NOMBRE VISIBLE</label>
                            <input 
                                className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none transition" 
                                value={editingLoc.name} 
                                onChange={e => setEditingLoc({...editingLoc, name: e.target.value})} 
                                required 
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">COLOR DE ACENTO</label>
                            <select 
                                className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none bg-white transition" 
                                value={editingLoc.accentColor} 
                                onChange={e => setEditingLoc({...editingLoc, accentColor: e.target.value as any})}
                            >
                                <option value="orange">Naranja (Aventura)</option>
                                <option value="cyan">Cyan (Agua/Nieve)</option>
                                <option value="green">Verde (Naturaleza)</option>
                            </select>
                        </div>
                    </div>
                </section>

                <hr className="border-gray-100" />

                {/* 2. SECCIÓN HERO */}
                <section>
                    <h4 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center text-xs font-bold">2</span>
                        Portada y Textos
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">TÍTULO GRANDE</label>
                            <input 
                                className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none" 
                                value={editingLoc.hero?.title} 
                                onChange={e => setEditingLoc({...editingLoc, hero: {...editingLoc.hero!, title: e.target.value}})} 
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">SUBTÍTULO</label>
                            <input 
                                className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none" 
                                value={editingLoc.hero?.subtitle} 
                                onChange={e => setEditingLoc({...editingLoc, hero: {...editingLoc.hero!, subtitle: e.target.value}})} 
                            />
                        </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4 border border-dashed border-gray-300 transition hover:bg-gray-100/50">
                        <label className="block text-xs font-bold text-gray-500 mb-3">IMAGEN DE FONDO</label>
                        <div className="flex gap-4 items-center">
                            <div className="w-24 h-24 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0 border shadow-sm group relative">
                                <img src={editingLoc.hero?.image} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1">
                                <input 
                                    className="w-full border border-gray-300 p-2 rounded mb-2 text-sm font-mono focus:ring-2 focus:ring-cyan-500 outline-none" 
                                    value={editingLoc.hero?.image} 
                                    onChange={e => setEditingLoc({...editingLoc, hero: {...editingLoc.hero!, image: e.target.value}})} 
                                    placeholder="URL de la imagen..."
                                />
                                <label className={`cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50 text-gray-600 transition ${uploading ? 'opacity-50' : ''}`}>
                                    {uploading ? <i className="fas fa-spinner animate-spin"></i> : <i className="fas fa-upload"></i>} 
                                    {uploading ? 'Subiendo...' : 'Subir archivo nuevo'}
                                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                                </label>
                            </div>
                        </div>
                    </div>
                </section>

                <hr className="border-gray-100" />

                {/* 3. MAPA INTERACTIVO */}
                <section>
                    <h4 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center text-xs font-bold">3</span>
                        Ubicación Geográfica
                    </h4>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                        {/* MAPA */}
                        <div className="order-2 lg:order-1">
                            <label className="block text-xs font-bold text-gray-500 mb-2 flex justify-between">
                                <span>SELECCIONA EN EL MAPA</span>
                                <span className="text-cyan-600 font-normal normal-case"><i className="fas fa-mouse-pointer"></i> Click para mover</span>
                            </label>
                            {/* Renderizamos el componente LocationPicker pasándole las coords actuales */}
                            <LocationPicker 
                                initialLat={editingLoc.mapCenter?.lat || 0}
                                initialLng={editingLoc.mapCenter?.lng || 0}
                                onLocationSelect={handleMapUpdate}
                            />
                        </div>

                        {/* INPUTS MANUALES */}
                        <div className="order-1 lg:order-2 space-y-5">
                            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-800">
                                <i className="fas fa-info-circle mr-2 text-blue-500"></i>
                                Puedes arrastrar el mapa y hacer clic en la ubicación exacta, o ingresar las coordenadas manualmente abajo.
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">LATITUD</label>
                                    <input 
                                        type="number" step="any"
                                        className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none font-mono text-sm" 
                                        value={editingLoc.mapCenter?.lat} 
                                        onChange={e => setEditingLoc({...editingLoc, mapCenter: {...editingLoc.mapCenter!, lat: parseFloat(e.target.value)}})} 
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">LONGITUD</label>
                                    <input 
                                        type="number" step="any"
                                        className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none font-mono text-sm" 
                                        value={editingLoc.mapCenter?.lng} 
                                        onChange={e => setEditingLoc({...editingLoc, mapCenter: {...editingLoc.mapCenter!, lng: parseFloat(e.target.value)}})} 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

            </div>

            {/* ACTION BAR */}
            <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3 sticky bottom-0 z-10 shadow-inner">
                <button 
                    type="button"
                    onClick={toggleEditing}
                    className="px-5 py-2.5 text-gray-600 font-medium hover:text-red-500 transition"
                    disabled={uploading}
                >
                    Cancelar
                </button>
                <button 
                    type="submit"
                    disabled={uploading}
                    className={`px-8 py-2.5 bg-cyan-600 text-white font-bold rounded-lg shadow hover:bg-cyan-700 transition transform active:scale-95 flex items-center gap-2 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
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