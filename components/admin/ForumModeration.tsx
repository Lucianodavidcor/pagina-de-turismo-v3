import React, { useState, useEffect } from 'react';
import { getPendingPosts, moderatePost, ForumPost } from '../../services/forum';

interface Props {
  locationId?: number | null; // Si es null (superadmin global), trae todo. Si tiene ID, filtra.
}

const ForumModeration: React.FC<Props> = ({ locationId }) => {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPending();
  }, [locationId]);

  const loadPending = async () => {
    setLoading(true);
    try {
      const data = await getPendingPosts(locationId || undefined);
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
      // Quitar de la lista localmente
      setPosts(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      alert('Error al moderar el post');
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800">Moderación de Reseñas</h3>
        <button onClick={loadPending} className="text-cyan-600 hover:text-cyan-800 text-sm">
            <i className="fas fa-sync-alt mr-1"></i> Actualizar
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-500">Buscando reseñas pendientes...</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12 bg-green-50 rounded border border-green-100">
            <i className="fas fa-check-circle text-4xl text-green-400 mb-3"></i>
            <p className="text-green-800 font-medium">¡Todo al día!</p>
            <p className="text-green-600 text-sm">No hay reseñas pendientes de aprobación.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map(post => (
            <div key={post.id} className="border p-4 rounded-lg bg-gray-50 flex flex-col md:flex-row gap-4 animate-fade-in">
              {/* Info Usuario y Localidad */}
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
              <div className="flex-1 bg-white p-3 rounded border border-gray-200">
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

              {/* Botones de Acción */}
              <div className="flex md:flex-col justify-center gap-2">
                <button 
                    onClick={() => handleModerate(post.id, 'APPROVED')}
                    className="bg-green-600 text-white px-4 py-2 rounded text-sm font-bold hover:bg-green-700 transition flex items-center justify-center gap-2"
                >
                    <i className="fas fa-check"></i> Aprobar
                </button>
                <button 
                    onClick={() => handleModerate(post.id, 'REJECTED')}
                    className="bg-red-500 text-white px-4 py-2 rounded text-sm font-bold hover:bg-red-600 transition flex items-center justify-center gap-2"
                >
                    <i className="fas fa-times"></i> Rechazar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ForumModeration;