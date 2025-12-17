import React, { useState, useEffect } from 'react';
import { getDetailPages, getDetailPageById, saveDetailPage, deleteDetailPage } from '../../services/content';
import { DetailPageContent } from '../../types';

interface Props {
  locationId: number;
}

const DetailPagesManager: React.FC<Props> = ({ locationId }) => {
  const [pages, setPages] = useState<any[]>([]);
  const [editingPage, setEditingPage] = useState<Partial<DetailPageContent> | null>(null);

  useEffect(() => {
    load();
  }, [locationId]);

  const load = async () => {
    const data = await getDetailPages(locationId);
    setPages(data);
  };

  const handleEdit = async (id: number) => {
    const fullPage = await getDetailPageById(id);
    setEditingPage(fullPage);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPage) return;
    await saveDetailPage({ ...editingPage, locationId } as any);
    setEditingPage(null);
    load();
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Eliminar página?')) {
      await deleteDetailPage(id);
      load();
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <div className="flex justify-between mb-6">
        <h3 className="text-lg font-bold">Páginas de Contenido</h3>
        <button onClick={() => setEditingPage({ title: '', slug: '', content: '' })} className="bg-cyan-600 text-white px-4 py-2 rounded">+ Nueva Página</button>
      </div>

      <table className="w-full text-sm text-left">
        <thead className="bg-gray-50 uppercase text-xs">
          <tr>
            <th className="px-4 py-2">Título</th>
            <th className="px-4 py-2">Slug (URL)</th>
            <th className="px-4 py-2 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pages.map(page => (
            <tr key={page.id} className="border-b">
              <td className="px-4 py-3 font-medium">{page.title}</td>
              <td className="px-4 py-3 text-gray-500">/{page.slug}</td>
              <td className="px-4 py-3 text-right space-x-2">
                <button onClick={() => handleEdit(page.id)} className="text-blue-600">Editar</button>
                <button onClick={() => handleDelete(page.id)} className="text-red-600">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingPage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded w-full max-w-4xl h-[90vh] flex flex-col">
            <h3 className="text-lg font-bold mb-4">{editingPage.id ? 'Editar' : 'Nueva'} Página</h3>
            <form onSubmit={handleSave} className="flex-1 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold">Título</label>
                  <input className="w-full border p-2 rounded" value={editingPage.title} onChange={e => setEditingPage({...editingPage, title: e.target.value})} required />
                </div>
                <div>
                  <label className="block text-sm font-bold">Slug (URL amigable)</label>
                  <input className="w-full border p-2 rounded" value={editingPage.slug} onChange={e => setEditingPage({...editingPage, slug: e.target.value})} required />
                </div>
              </div>
              <div className="flex-1 flex flex-col">
                <label className="block text-sm font-bold mb-1">Contenido (HTML)</label>
                <textarea 
                  className="w-full border p-4 rounded flex-1 font-mono text-sm bg-gray-50" 
                  value={editingPage.content as string} 
                  onChange={e => setEditingPage({...editingPage, content: e.target.value})} 
                  placeholder="<h1>Escribe tu HTML aquí...</h1>"
                  required 
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setEditingPage(null)} className="px-4 py-2 text-gray-600">Cancelar</button>
                <button type="submit" className="px-6 py-2 bg-cyan-600 text-white rounded font-bold">Guardar Contenido</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailPagesManager;