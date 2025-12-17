import React, { useState, useEffect } from 'react';
import { getAttractions, saveAttraction, deleteAttraction, uploadImages } from '../../services/content';
import { Attraction } from '../../types';

interface Props {
  locationId: number;
}

const AttractionsManager: React.FC<Props> = ({ locationId }) => {
  const [items, setItems] = useState<Attraction[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<Attraction> | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadItems();
  }, [locationId]);

  const loadItems = async () => {
    setLoading(true);
    try {
      const data = await getAttractions(locationId);
      setItems(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    try {
      await saveAttraction({ ...editingItem, locationId } as Attraction);
      setEditingItem(null);
      loadItems();
    } catch (error) {
      alert('Error al guardar. Verifica los datos.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar este elemento?')) return;
    try {
      await deleteAttraction(id);
      loadItems();
    } catch (error) {
      alert('Error al eliminar');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length || !editingItem) return;
    setUploading(true);
    try {
      const newUrls = await uploadImages(e.target.files);
      setEditingItem(prev => ({
        ...prev,
        images: [...(prev?.images || []), ...newUrls]
      }));
    } catch (error) {
      console.error(error);
      alert('Error al subir la imagen.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800">Atracciones y Alojamiento</h3>
        <button 
          onClick={() => setEditingItem({ type: 'attraction', images: [] })}
          className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700 shadow-sm"
        >
          + Nuevo Item
        </button>
      </div>

      {loading ? <div className="text-center py-10">Cargando...</div> : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map(item => (
            <div key={item.id} className="border rounded-lg overflow-hidden hover:shadow-md transition bg-white">
              <div className="h-40 bg-gray-100 relative">
                {item.images[0] ? (
                    <img src={item.images[0]} className="w-full h-full object-cover" alt={item.title} />
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-400"><i className="fas fa-image text-3xl"></i></div>
                )}
                <span className="absolute top-2 right-2 bg-white/90 px-2 py-1 text-xs font-bold rounded uppercase">{item.type}</span>
              </div>
              <div className="p-4">
                <h4 className="font-bold text-lg mb-1">{item.title}</h4>
                <p className="text-sm text-gray-500 line-clamp-2 mb-3">{item.description}</p>
                <div className="flex justify-end gap-2 border-t pt-3">
                  <button onClick={() => setEditingItem(item)} className="text-blue-600 hover:bg-blue-50 px-3 py-1 rounded text-sm font-medium">Editar</button>
                  <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:bg-red-50 px-3 py-1 rounded text-sm font-medium">Borrar</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <h3 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">{editingItem.id ? 'Editar' : 'Crear'} Item</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1 text-gray-700">Tipo</label>
                  <select 
                    className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-cyan-500 outline-none"
                    value={editingItem.type}
                    onChange={e => setEditingItem({...editingItem, type: e.target.value as any})}
                  >
                    <option value="attraction">Atracción Turística</option>
                    <option value="hotel">Hotel / Alojamiento</option>
                    <option value="restaurant">Gastronomía</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1 text-gray-700">Título</label>
                  <input className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-cyan-500 outline-none" 
                    value={editingItem.title || ''} onChange={e => setEditingItem({...editingItem, title: e.target.value})} required />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold mb-1 text-gray-700">Descripción</label>
                <textarea className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-cyan-500 outline-none h-24" 
                    value={editingItem.description || ''} onChange={e => setEditingItem({...editingItem, description: e.target.value})} required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1 text-gray-700">Teléfono</label>
                  <input className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-cyan-500 outline-none" 
                    value={editingItem.phone || ''} onChange={e => setEditingItem({...editingItem, phone: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1 text-gray-700">Email</label>
                  <input className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-cyan-500 outline-none" 
                    value={editingItem.email || ''} onChange={e => setEditingItem({...editingItem, email: e.target.value})} />
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded border border-gray-200">
                <h4 className="font-bold text-sm mb-3 text-gray-600 uppercase">Ubicación en Mapa</h4>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                    <label className="block text-xs font-bold mb-1">Latitud</label>
                    <input type="number" step="any" className="w-full border p-2 rounded bg-white" placeholder="-37.1234"
                        value={editingItem.coordinates?.lat || ''} 
                        onChange={e => setEditingItem({...editingItem, coordinates: { lat: parseFloat(e.target.value), lng: editingItem.coordinates?.lng || 0 }})} required />
                    </div>
                    <div>
                    <label className="block text-xs font-bold mb-1">Longitud</label>
                    <input type="number" step="any" className="w-full border p-2 rounded bg-white" placeholder="-70.1234"
                        value={editingItem.coordinates?.lng || ''} 
                        onChange={e => setEditingItem({...editingItem, coordinates: { lat: editingItem.coordinates?.lat || 0, lng: parseFloat(e.target.value) }})} required />
                    </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700">Galería de Imágenes</label>
                <div className="flex flex-wrap gap-3 mb-3">
                  {editingItem.images?.map((url, idx) => (
                    <div key={idx} className="relative w-20 h-20 group">
                      <img src={url} className="w-full h-full object-cover rounded border" />
                      <button type="button" onClick={() => setEditingItem({...editingItem, images: editingItem.images?.filter((_, i) => i !== idx)})} 
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow hover:bg-red-600 transition">×</button>
                    </div>
                  ))}
                  <label className="w-20 h-20 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded cursor-pointer hover:bg-gray-50 hover:border-cyan-400 transition">
                      <i className="fas fa-cloud-upload-alt text-gray-400 text-xl"></i>
                      <span className="text-[10px] text-gray-500 mt-1">Subir</span>
                      <input type="file" multiple onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
                {uploading && <div className="text-xs text-blue-600 font-semibold animate-pulse">Subiendo imágenes a la nube...</div>}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => setEditingItem(null)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded transition">Cancelar</button>
                <button type="submit" className="px-6 py-2 bg-cyan-600 text-white rounded font-bold hover:bg-cyan-700 transition shadow">Guardar Cambios</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttractionsManager;