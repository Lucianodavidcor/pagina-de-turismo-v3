import React, { useState, useEffect } from 'react';
import { getPendingPosts, getPublicPosts, moderatePost, deletePost, ForumPost } from '../../services/forum';

interface Props {
  locationId?: number | null;
}

const ForumModeration: React.FC<Props> = ({ locationId }) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'approved'>('pending');
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPosts();
  }, [locationId, activeTab]);

  const loadPosts = async () => {
    setLoading(true);
    setPosts([]);
    try {
      let data = [];
      if (activeTab === 'pending') {
        data = await getPendingPosts(locationId || undefined);
      } else {
        data = await getPublicPosts(locationId || undefined);
      }
      setPosts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleModerate = async (id: number, status: 'APPROVED' | 'REJECTED') => {
    try {
      await moderatePost(id, status);
      setPosts(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      alert('Error al moderar el post');
    }
  };

  const handleDelete = async (id: number) => {
      if(!confirm('¿Eliminar definitivamente este post de la base de datos?')) return;
      try {
          await deletePost(id);
          setPosts(prev => prev.filter(p => p.id !== id));
      } catch (error) {
          alert('Error al eliminar post');
      }
  }

  return (
    <div className="bg-white p-6 rounded shadow border border-gray-100">
      
      {/* Header con Pestañas */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800">Gestión del Foro</h3>
        <button onClick={loadPosts} className="text-cyan-600 hover:text-cyan-800 text-sm">
            <i className="fas fa-sync-alt mr-1"></i> Recargar
        </button>
      </div>

      <div className="flex gap-2 mb-6 border-b">
          <button 
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 text-sm font-bold border-b-2 transition-colors ${activeTab === 'pending' ? 'border-cyan-600 text-cyan-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            Pendientes de Revisión
          </button>
          <button 
            onClick={() => setActiveTab('approved')}
            className={`px-4 py-2 text-sm font-bold border-b-2 transition-colors ${activeTab === 'approved' ? 'border-cyan-600 text-cyan-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            Publicadas / Historial
          </button>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-500">Cargando reseñas...</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded border border-gray-200 border-dashed">
            <i className="far fa-folder-open text-4xl text-gray-300 mb-3"></i>
            <p className="text-gray-600">No hay reseñas en esta sección.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map(post => (
            <div key={post.id} className="border p-4 rounded-lg bg-gray-50 flex flex-col md:flex-row gap-4 animate-fade-in relative group hover:bg-white hover:shadow-sm transition">
              
              {/* Información */}
              <div className="md:w-1/4">
                <p className="font-bold text-gray-900">{post.author}</p>
                <p className="text-xs text-gray-500 mb-2">{new Date(post.created_at).toLocaleDateString()}</p>
                <span className="text-xs font-bold bg-white border px-2 py-1 rounded text-cyan-700">
                    {post.location_name || `Loc ID: ${post.location_id}`}
                </span>
                <div className="text-yellow-500 text-xs mt-2">
                    {[...Array(5)].map((_, i) => <i key={i} className={`fas fa-star ${i < post.rating ? '' : 'text-gray-300'}`}></i>)}
                </div>
              </div>

              {/* Contenido */}
              <div className="flex-1">
                <p className="text-gray-700 text-sm mb-3 italic">"{post.text}"</p>
                {post.images.length > 0 && (
                    <div className="flex gap-2">
                        {post.images.map((img, i) => (
                            <a key={i} href={img} target="_blank" rel="noreferrer">
                                <img src={img} className="w-12 h-12 object-cover rounded border hover:scale-110 transition" />
                            </a>
                        ))}
                    </div>
                )}
              </div>

              {/* Acciones Diferentes según la pestaña */}
              <div className="flex md:flex-col justify-center gap-2 min-w-[120px]">
                
                {activeTab === 'pending' ? (
                    <>
                        <button 
                            onClick={() => handleModerate(post.id, 'APPROVED')}
                            className="bg-green-600 text-white px-3 py-1.5 rounded text-xs font-bold hover:bg-green-700 flex items-center justify-center gap-2"
                        >
                            <i className="fas fa-check"></i> Aprobar
                        </button>
                        <button 
                            onClick={() => handleModerate(post.id, 'REJECTED')}
                            className="bg-orange-500 text-white px-3 py-1.5 rounded text-xs font-bold hover:bg-orange-600 flex items-center justify-center gap-2"
                        >
                            <i className="fas fa-ban"></i> Rechazar
                        </button>
                    </>
                ) : (
                    <button 
                        onClick={() => handleDelete(post.id)}
                        className="bg-red-100 text-red-600 border border-red-200 px-3 py-1.5 rounded text-xs font-bold hover:bg-red-600 hover:text-white transition flex items-center justify-center gap-2"
                    >
                        <i className="fas fa-trash-alt"></i> Eliminar
                    </button>
                )}

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ForumModeration;