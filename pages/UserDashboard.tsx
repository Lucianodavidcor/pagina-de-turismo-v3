import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import { HOME_NAV_LINKS } from '../constants';
import { getPublicPosts, deletePost, ForumPost } from '../services/forum';
import { Link } from 'react-router-dom';

const UserDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [myPosts, setMyPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
        fetchMyPosts();
    }
  }, [user]);

  const fetchMyPosts = async () => {
    try {
        setLoading(true);
        // Traemos todos los posts públicos y filtramos los míos
        const allPosts = await getPublicPosts();
        const mine = allPosts.filter(p => p.userId === user?.id);
        setMyPosts(mine);
    } catch (error) {
        console.error("Error al cargar reseñas", error);
    } finally {
        setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
      if(!confirm('¿Eliminar esta reseña?')) return;
      try {
          await deletePost(id);
          setMyPosts(prev => prev.filter(p => p.id !== id));
      } catch (error) {
          alert('Error al eliminar');
      }
  };

  if (!user) return <div className="p-10 text-center">Debes iniciar sesión.</div>;

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      <Header navLinks={HOME_NAV_LINKS} />

      <main className="container mx-auto px-6 py-12 flex-grow">
        
        {/* Encabezado del Perfil */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8 flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-4xl text-white font-bold">
                {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-gray-800">Hola, {user.name}</h1>
                <p className="text-gray-500">{user.email}</p>
                <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-cyan-50 text-cyan-700 text-xs font-bold border border-cyan-100">
                    {user.role === 'USER' ? 'Viajero' : user.role}
                </div>
            </div>
            <button onClick={logout} className="bg-red-50 text-red-600 px-6 py-2 rounded-lg font-bold hover:bg-red-100 transition border border-red-100">
                Cerrar Sesión
            </button>
        </div>

        {/* Sección de Reseñas */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-l-4 border-cyan-500 pl-4">Mis Reseñas Publicadas</h2>
        
        {loading ? (
            <div className="text-center py-10 text-gray-400">Cargando tus experiencias...</div>
        ) : myPosts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
                <i className="far fa-edit text-5xl text-gray-300 mb-4"></i>
                <p className="text-gray-600 text-lg mb-2">Aún no has publicado reseñas aprobadas.</p>
                <p className="text-sm text-gray-400 mb-6">Si enviaste una recientemente, puede estar en revisión.</p>
                <Link to="/foro" className="bg-cyan-600 text-white px-6 py-2 rounded-lg hover:bg-cyan-700 transition">
                    Escribir mi primera reseña
                </Link>
            </div>
        ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {myPosts.map(post => (
                    <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition flex flex-col">
                        <div className="p-6 flex-1">
                            <div className="flex justify-between items-start mb-3">
                                <span className="bg-cyan-50 text-cyan-700 text-xs font-bold px-2 py-1 rounded border border-cyan-100">
                                    {post.location_name || `Loc ID: ${post.location_id}`}
                                </span>
                                <div className="text-yellow-400 text-xs">
                                    {[...Array(5)].map((_, i) => <i key={i} className={`fas fa-star ${i < post.rating ? '' : 'text-gray-200'}`}></i>)}
                                </div>
                            </div>
                            <p className="text-gray-600 text-sm italic mb-4 line-clamp-4">"{post.text}"</p>
                            <p className="text-xs text-gray-400 text-right">{new Date(post.created_at).toLocaleDateString()}</p>
                        </div>
                        
                        <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex justify-between items-center">
                            <span className="text-xs text-green-600 font-bold flex items-center gap-1">
                                <i className="fas fa-check-circle"></i> Publicada
                            </span>
                            <button 
                                onClick={() => handleDelete(post.id)}
                                className="text-red-500 hover:text-red-700 text-sm font-medium transition flex items-center gap-1"
                            >
                                <i className="fas fa-trash-alt"></i> Borrar
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        )}

      </main>
    </div>
  );
};

export default UserDashboard;