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
      alert('Error al guardar');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar?')) return;
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
      setEditingItem({
        ...editingItem,
        images: [...(editingItem.images || []), ...newUrls]
      });
    } catch (error) {
      alert('Error subiendo imágenes');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <div className="flex justify-between mb-4">
        <h3 className="text-lg font-bold">Atracciones y Alojamientos</h3>
        <button 
          onClick={() => setEditingItem({ type: 'attraction', images: [] })}
          className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700"
        >
          + Crear Nuevo
        </button>
      </div>

      {loading ? <p>Cargando...</p> : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map(item => (
            <div key={item.id} className="border p-4 rounded relative">
              <img src={item.images[0] || 'https://via.placeholder.com/150'} className="w-full h-32 object-cover rounded mb-2 bg-gray-100" />
              <div className="font-bold">{item.title}</div>
              <div className="text-xs text-gray-500 uppercase">{item.type}</div>
              <div className="mt-2 flex gap-2">
                <button onClick={() => setEditingItem(item)} className="text-blue-600 text-sm">Editar</button>
                <button onClick={() => handleDelete(item.id)} className="text-red-600 text-sm">Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">{editingItem.id ? 'Editar' : 'Crear'} Item</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold">Tipo</label>
                  <select 
                    className="w-full border p-2 rounded"
                    value={editingItem.type}
                    onChange={e => setEditingItem({...editingItem, type: e.target.value as any})}
                  >
                    <option value="attraction">Atracción</option>
                    <option value="hotel">Hotel / Alojamiento</option>
                    <option value="restaurant">Restaurante</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold">Título</label>
                  <input className="w-full border p-2 rounded" value={editingItem.title || ''} onChange={e => setEditingItem({...editingItem, title: e.target.value})} required />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold">Descripción</label>
                <textarea className="w-full border p-2 rounded h-24" value={editingItem.description || ''} onChange={e => setEditingItem({...editingItem, description: e.target.value})} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold">Teléfono</label>
                  <input className="w-full border p-2 rounded" value={editingItem.phone || ''} onChange={e => setEditingItem({...editingItem, phone: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold">Email</label>
                  <input className="w-full border p-2 rounded" value={editingItem.email || ''} onChange={e => setEditingItem({...editingItem, email: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold">Latitud</label>
                  <input type="number" step="any" className="w-full border p-2 rounded" value={editingItem.coordinates?.lat || ''} 
                    onChange={e => setEditingItem({...editingItem, coordinates: { lat: parseFloat(e.target.value), lng: editingItem.coordinates?.lng || 0 }})} required />
                </div>
                <div>
                  <label className="block text-sm font-bold">Longitud</label>
                  <input type="number" step="any" className="w-full border p-2 rounded" value={editingItem.coordinates?.lng || ''} 
                    onChange={e => setEditingItem({...editingItem, coordinates: { lat: editingItem.coordinates?.lat || 0, lng: parseFloat(e.target.value) }})} required />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">Imágenes</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {editingItem.images?.map((url, idx) => (
                    <div key={idx} className="relative w-20 h-20">
                      <img src={url} className="w-full h-full object-cover rounded" />
                      <button type="button" onClick={() => setEditingItem({...editingItem, images: editingItem.images?.filter((_, i) => i !== idx)})} 
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">×</button>
                    </div>
                  ))}
                </div>
                <input type="file" multiple onChange={handleImageUpload} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100"/>
                {uploading && <span className="text-xs text-blue-500">Subiendo...</span>}
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={() => setEditingItem(null)} className="px-4 py-2 text-gray-600">Cancelar</button>
                <button type="submit" className="px-6 py-2 bg-cyan-600 text-white rounded font-bold">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttractionsManager;