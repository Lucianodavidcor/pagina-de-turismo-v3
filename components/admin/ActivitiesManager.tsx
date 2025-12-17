import React, { useState, useEffect } from 'react';
import { getActivities, saveActivity, deleteActivity } from '../../services/content';
import { Activity } from '../../types';

interface Props {
  locationId: number;
}

const ActivitiesManager: React.FC<Props> = ({ locationId }) => {
  const [items, setItems] = useState<Activity[]>([]);
  const [editingItem, setEditingItem] = useState<Partial<Activity> | null>(null);

  useEffect(() => {
    load();
  }, [locationId]);

  const load = async () => {
    const data = await getActivities(locationId);
    setItems(data);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    await saveActivity({ ...editingItem, locationId } as Activity);
    setEditingItem(null);
    load();
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Eliminar actividad?')) {
      await deleteActivity(id);
      load();
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <div className="flex justify-between mb-6">
        <h3 className="text-lg font-bold">Actividades</h3>
        <button onClick={() => setEditingItem({ iconClass: 'fa-solid fa-person-hiking' })} className="bg-cyan-600 text-white px-4 py-2 rounded">+ Nueva Actividad</button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map(item => (
          <div key={item.id} className="border p-4 rounded flex items-start gap-4">
            <div className="text-3xl text-cyan-600"><i className={item.iconClass}></i></div>
            <div className="flex-1">
              <h4 className="font-bold">{item.title}</h4>
              <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
              <div className="mt-2 flex gap-2 text-sm">
                <button onClick={() => setEditingItem(item)} className="text-blue-600">Editar</button>
                <button onClick={() => handleDelete(item.id)} className="text-red-600">Eliminar</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">{editingItem.id ? 'Editar' : 'Nueva'} Actividad</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-bold">Título</label>
                <input className="w-full border p-2 rounded" value={editingItem.title || ''} onChange={e => setEditingItem({...editingItem, title: e.target.value})} required />
              </div>
              <div>
                <label className="block text-sm font-bold">Descripción</label>
                <textarea className="w-full border p-2 rounded h-24" value={editingItem.description || ''} onChange={e => setEditingItem({...editingItem, description: e.target.value})} required />
              </div>
              <div>
                <label className="block text-sm font-bold">Icono (FontAwesome Class)</label>
                <input className="w-full border p-2 rounded" placeholder="fa-solid fa-camera" value={editingItem.iconClass || ''} onChange={e => setEditingItem({...editingItem, iconClass: e.target.value})} />
                <div className="text-xs text-gray-500 mt-1">Ej: fa-solid fa-hiking, fa-solid fa-utensils</div>
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setEditingItem(null)} className="px-4 py-2 text-gray-600">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-cyan-600 text-white rounded">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivitiesManager;