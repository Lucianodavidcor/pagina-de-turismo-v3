import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { HOME_NAV_LINKS } from '../constants';
import { useAuth } from '../context/AuthContext';
import { getAllLocations } from '../services/locations';
import { uploadImages } from '../services/content';
import { createPost, getPublicPosts, deletePost, ForumPost } from '../services/forum'; // Importar deletePost
import type { LocationData } from '../types';

const ForumPage: React.FC = () => {
  const { user } = useAuth(); // Obtenemos el usuario actual
  
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [loading, setLoading] = useState(true);

  const [newPost, setNewPost] = useState({ rating: 5, text: '', locationId: 0, images: [] as string[] });
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [locsData, postsData] = await Promise.all([
        getAllLocations(),
        getPublicPosts()
      ]);
      setLocations(locsData);
      setPosts(postsData);
    } catch (error) {
      console.error("Error cargando foro:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setUploading(true);
    try {
      const urls = await uploadImages(e.target.files);
      setNewPost(prev => ({ ...prev, images: [...prev.images, ...urls] }));
    } catch (error) {
      alert('Error al subir imagen');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (indexToRemove: number) => {
      setNewPost(prev => ({
          ...prev,
          images: prev.images.filter((_, idx) => idx !== indexToRemove)
      }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
        setMsg({ type: 'error', text: 'Debes iniciar sesión para publicar.' });
        return;
    }
    if (newPost.locationId === 0) {
        setMsg({ type: 'error', text: 'Por favor selecciona una localidad.' });
        return;
    }

    try {
      await createPost({
        location_id: newPost.locationId,
        rating: newPost.rating,
        text: newPost.text,
        images: newPost.images
      });
      
      setMsg({ type: 'success', text: '¡Reseña enviada! Está pendiente de aprobación.' });
      setNewPost({ rating: 5, text: '', locationId: 0, images: [] }); 
      setHoverRating(0);
    } catch (error) {
      setMsg({ type: 'error', text: 'Ocurrió un error al enviar tu reseña.' });
    }
  };

  // --- FUNCIÓN DE BORRADO ---
  const handleDeletePost = async (id: number) => {
      if (!window.confirm('¿Estás seguro de que quieres eliminar esta reseña?')) return;
      try {
          await deletePost(id);
          setPosts(prev => prev.filter(p => p.id !== id)); // Actualizar UI
          alert('Reseña eliminada correctamente.');
      } catch (error) {
          alert('No se pudo eliminar la reseña.');
      }
  };

  // Helper para verificar permisos de borrado
  const canDelete = (post: ForumPost) => {
      if (!user) return false;
      if (user.role === 'SUPERADMIN') return true; // Superadmin borra todo
      if (user.id === post.userId) return true; // Dueño borra lo suyo
      // Admin borra posts de su localidad
      if (user.role === 'ADMIN' && user.locationId === post.location_id) return true;
      return false;
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans flex flex-col">
      <Header navLinks={HOME_NAV_LINKS} />

      {/* --- HERO SECTION --- */}
      <div className="bg-gradient-to-r from-cyan-700 to-blue-800 text-white pt-24 pb-32 px-6 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <div className="relative z-10 max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">Comunidad de Viajeros</h1>
            <p className="text-lg md:text-xl text-cyan-100 font-light">Descubre secretos, comparte tus historias y ayuda a otros a explorar la Patagonia.</p>
          </div>
      </div>

      <main className="container mx-auto px-6 -mt-20 relative z-20 pb-20 flex-1 max-w-5xl">
        
        {/* --- FORMULARIO DE PUBLICACIÓN --- */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-16 animate-fade-in-up">
            <div className="bg-gray-50 px-8 py-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <span className="bg-cyan-100 text-cyan-600 w-8 h-8 rounded-full flex items-center justify-center text-sm"><i className="fas fa-pen"></i></span>
                    Escribe tu Reseña
                </h3>
                {!user && <span className="text-xs font-semibold text-orange-500 bg-orange-50 px-3 py-1 rounded-full">Requiere Login</span>}
            </div>

            <div className="p-8">
                {msg.text && (
                    <div className={`p-4 rounded-lg mb-6 flex items-center gap-3 ${msg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                        <i className={`fas ${msg.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} text-xl`}></i>
                        <span className="font-medium">{msg.text}</span>
                    </div>
                )}

                {!user ? (
                    <div className="text-center py-10">
                        <div className="mb-4 text-gray-300 text-5xl"><i className="fas fa-user-lock"></i></div>
                        <p className="text-gray-500 mb-6">Inicia sesión para compartir tus experiencias con la comunidad.</p>
                        <a href="/login" className="inline-block bg-cyan-600 text-white font-bold py-3 px-8 rounded-full hover:bg-cyan-700 transition shadow-lg hover:shadow-cyan-200">Iniciar Sesión</a>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Destino</label>
                                <div className="relative">
                                    <select className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none appearance-none bg-white transition"
                                        value={newPost.locationId} onChange={(e) => setNewPost({...newPost, locationId: Number(e.target.value)})} required>
                                        <option value={0}>Selecciona una localidad...</option>
                                        {locations.map(loc => <option key={loc.id} value={loc.id}>{loc.name}</option>)}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500"><i className="fas fa-chevron-down text-xs"></i></div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Calificación</label>
                                <div className="flex items-center gap-1 h-[46px]">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button key={star} type="button" onMouseEnter={() => setHoverRating(star)} onMouseLeave={() => setHoverRating(0)} onClick={() => setNewPost({...newPost, rating: star})}
                                            className="text-3xl transition-transform transform hover:scale-125 focus:outline-none px-1">
                                            <i className={`fas fa-star transition-colors ${star <= (hoverRating || newPost.rating) ? 'text-yellow-400' : 'text-gray-200'}`}></i>
                                        </button>
                                    ))}
                                    <span className="ml-3 text-sm font-medium text-gray-400 bg-gray-100 px-2 py-1 rounded">{hoverRating || newPost.rating} / 5</span>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Tu Experiencia</label>
                            <textarea className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none h-32 resize-none transition" placeholder="¿Qué fue lo que más te gustó?" value={newPost.text} onChange={(e) => setNewPost({...newPost, text: e.target.value})} required></textarea>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Fotos del Viaje</label>
                            <div className="flex flex-wrap gap-4">
                                <label className={`w-32 h-32 flex flex-col items-center justify-center border-2 border-dashed rounded-xl cursor-pointer transition-all ${uploading ? 'bg-gray-100 border-gray-300' : 'border-cyan-300 bg-cyan-50 hover:bg-cyan-100'}`}>
                                    {uploading ? <div className="animate-spin text-cyan-600 text-2xl"><i className="fas fa-circle-notch"></i></div> : <><i className="fas fa-camera text-2xl text-cyan-600 mb-2"></i><span className="text-xs font-bold text-cyan-700">Agregar</span></>}
                                    <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
                                </label>
                                {newPost.images.map((url, i) => (
                                    <div key={i} className="relative w-32 h-32 group animate-fade-in">
                                        <img src={url} className="w-full h-full object-cover rounded-xl shadow-sm" alt="preview" />
                                        <button type="button" onClick={() => removeImage(i)} className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-md opacity-0 group-hover:opacity-100 transition-opacity"><i className="fas fa-times"></i></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="pt-4 border-t border-gray-100">
                            <button type="submit" className="w-full sm:w-auto float-right bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-3 px-8 rounded-xl hover:shadow-lg hover:from-cyan-600 transition transform active:scale-95 flex items-center gap-2 justify-center">
                                <i className="fas fa-paper-plane"></i> Publicar Reseña
                            </button>
                            <div className="clear-both"></div>
                        </div>
                    </form>
                )}
            </div>
        </div>

        {/* --- LISTA DE RESEÑAS --- */}
        <div>
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-800">Opiniones Recientes</h2>
                <div className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm border border-gray-100">Mostrando {posts.length} reseñas</div>
            </div>

            {loading ? (
                <div className="grid gap-6">{[1, 2, 3].map(i => <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-pulse h-40"></div>)}</div>
            ) : posts.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                    <i className="far fa-comment-dots text-6xl text-gray-200 mb-4"></i>
                    <p className="text-gray-500 text-lg">Aún no hay reseñas aprobadas.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {posts.map((post) => (
                        <div key={post.id} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 flex flex-col md:flex-row gap-6 group relative">
                            
                            {/* Botón Borrar (Solo visible si tienes permiso) */}
                            {canDelete(post) && (
                                <button 
                                    onClick={() => handleDeletePost(post.id)}
                                    className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors p-2"
                                    title="Eliminar Reseña"
                                >
                                    <i className="fas fa-trash-alt"></i>
                                </button>
                            )}

                            {/* Columna Usuario */}
                            <div className="flex flex-row md:flex-col items-center md:items-start gap-4 md:w-48 flex-shrink-0">
                                <div className="w-16 h-16 rounded-full p-1 bg-gradient-to-tr from-cyan-400 to-blue-500">
                                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                                        {post.avatar_url ? <img src={post.avatar_url} className="w-full h-full object-cover" alt={post.author}/> : <span className="text-2xl font-bold text-gray-400">{post.author.charAt(0).toUpperCase()}</span>}
                                    </div>
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 leading-tight">{post.author}</p>
                                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1"><i className="far fa-calendar-alt"></i> {new Date(post.created_at).toLocaleDateString()}</p>
                                </div>
                            </div>
                            
                            {/* Columna Contenido */}
                            <div className="flex-1 relative">
                                <div className="absolute -top-2 -left-2 text-6xl text-gray-100 font-serif opacity-50 select-none">"</div>
                                <div className="flex flex-wrap justify-between items-center mb-4 relative z-10 pr-8"> {/* pr-8 para no tapar botón borrar */}
                                    <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-blue-100">
                                        <i className="fas fa-map-marker-alt"></i> {post.location_name || 'Neuquén'}
                                    </span>
                                    <div className="flex text-yellow-400 text-sm bg-yellow-50 px-2 py-1 rounded-lg">
                                        {[...Array(5)].map((_, i) => <i key={i} className={`fas fa-star ${i < post.rating ? '' : 'text-gray-200'}`}></i>)}
                                    </div>
                                </div>
                                <p className="text-gray-600 leading-relaxed mb-6 relative z-10">{post.text}</p>
                                {post.images && post.images.length > 0 && (
                                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                        {post.images.map((img, i) => (
                                            <div key={i} className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border border-gray-200 cursor-pointer hover:opacity-90 transition">
                                                <img src={img} className="w-full h-full object-cover" alt="Review shot" />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ForumPage;