import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { HOME_NAV_LINKS } from '../constants';
// Imports de Servicios y Contexto
import { getAllLocations, getGalleryByLocationId } from '../services/locations';
import { getPublicPosts, createPost, ForumPost } from '../services/forum';
import { uploadImages } from '../services/content';
import { useAuth } from '../context/AuthContext';
import type { LocationData } from '../types';

const HomePage: React.FC = () => {
  const { user } = useAuth();
  
  // Estados de Datos
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [adventureImages, setAdventureImages] = useState<string[]>([]);
  const [forumPosts, setForumPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados del Formulario (Home)
  const [newPost, setNewPost] = useState({ text: '', rating: 5, locationId: 0, images: [] as string[] });
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      
      // 1. Cargar Localidades y Posts del Foro en paralelo
      const [locs, posts] = await Promise.all([
        getAllLocations(),
        getPublicPosts()
      ]);
      
      setLocations(locs);
      // Tomamos solo las últimas 3 reseñas para el Home
      setForumPosts(posts.slice(0, 3));

      // 2. Cargar Galería Random (Aventuras)
      if (locs.length > 0) {
        const galleryPromises = locs.map(loc => getGalleryByLocationId(loc.id));
        const galleries = await Promise.all(galleryPromises);
        const allImages = galleries.flat();
        const shuffled = allImages.sort(() => 0.5 - Math.random());
        setAdventureImages(shuffled.slice(0, 8));
      }

    } catch (error) {
      console.error("Error cargando home:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- Lógica del Formulario ---

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
        setMsg({ type: 'error', text: 'Inicia sesión para publicar.' });
        return;
    }
    if (newPost.locationId === 0) {
        setMsg({ type: 'error', text: 'Selecciona una localidad.' });
        return;
    }
    if (!newPost.text.trim()) {
        setMsg({ type: 'error', text: 'Escribe una reseña.' });
        return;
    }

    try {
      await createPost({
        location_id: newPost.locationId,
        rating: newPost.rating,
        text: newPost.text,
        images: newPost.images
      });
      setMsg({ type: 'success', text: '¡Enviado! Tu reseña está pendiente de revisión.' });
      setNewPost({ text: '', rating: 5, locationId: 0, images: [] }); // Reset
    } catch (error) {
      setMsg({ type: 'error', text: 'Error al enviar la reseña.' });
    }
  };

  return (
    <div className="bg-white">
      <Header navLinks={HOME_NAV_LINKS} isHome={true} />

      {/* Hero Section */}
      <section className="relative h-screen bg-cover bg-center text-white" style={{ backgroundImage: "url('https://vantravellers.com/wp-content/uploads/2017/06/Chilecito-Ruta-40-scaled.jpg')" }}>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">Descubre el Corazón de Neuquén: <br /> Turismo Norte</h1>
          <p className="text-lg md:text-xl mb-8 max-w-3xl">Explora la belleza natural y la rica historia de nuestras localidades.</p>
          <div className="flex flex-wrap justify-center gap-4">
             {locations.slice(0, 2).map(loc => (
                <Link key={loc.id} to={`/${loc.slug}`} className={`font-bold py-3 px-8 rounded-md transition-transform transform hover:scale-105 ${loc.accentColor === 'cyan' ? 'bg-cyan-500 hover:bg-cyan-600 text-white' : 'bg-white hover:bg-gray-200 text-gray-800'}`}>
                  Explorar {loc.name}
                </Link>
             ))}
          </div>
        </div>
      </section>

      {/* Destinos Imperdibles */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Destinos Imperdibles</h2>
          <div className="grid md:grid-cols-2 gap-8 w-full">
              {loading ? <div className="col-span-2 text-center">Cargando destinos...</div> : locations.map((loc) => (
                <div key={loc.id} className="relative rounded-lg overflow-hidden shadow-lg transform hover:-translate-y-2 transition-transform duration-300 h-96 group">
                  <img src={loc.hero.image} alt={loc.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors"></div>
                  <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                    <h3 className="text-3xl font-bold mb-2">{loc.name}</h3>
                    <p className="mb-4">{loc.hero.subtitle || 'Naturaleza pura'}</p>
                    <Link to={`/${loc.slug}`} className={`text-white font-semibold py-2 px-4 rounded-md self-start transition-colors ${
                      loc.accentColor === 'orange' ? 'bg-orange-500 hover:bg-orange-600' :
                      loc.accentColor === 'cyan' ? 'bg-cyan-500 hover:bg-cyan-600' :
                      'bg-green-600 hover:bg-green-700'
                    }`}>
                      Explorar {loc.name}
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* Galería de Aventuras */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Galería de Aventuras</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {adventureImages.length > 0 ? (
              adventureImages.map((img, i) => (
                <div key={i} className="overflow-hidden rounded-lg shadow-md aspect-square group">
                  <img src={img} alt={`Aventura ${i + 1}`} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300" />
                </div>
              ))
            ) : (
               [...Array(4)].map((_, i) => <div key={i} className="bg-gray-200 animate-pulse rounded-lg aspect-square"></div>)
            )}
          </div>
        </div>
      </section>

      {/* FORO DE VIAJEROS (DINÁMICO) */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 max-w-4xl">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Foro de Viajeros</h2>
          
          {/* Formulario de Publicación */}
          <div className="bg-white p-8 rounded-lg shadow-lg mb-12 relative overflow-hidden">
            {msg.text && (
                <div className={`absolute top-0 left-0 right-0 p-2 text-center text-sm font-bold ${msg.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                    {msg.text}
                </div>
            )}
            
            <h3 className="text-xl font-semibold mb-4 text-gray-700 mt-2">Compartí tu experiencia</h3>
            
            {!user ? (
                <div className="text-center py-6 bg-gray-50 rounded border border-dashed border-gray-300">
                    <p className="text-gray-500 mb-2">Inicia sesión para compartir tu historia.</p>
                    <Link to="/login" className="text-cyan-600 font-bold hover:underline">Ir al Login</Link>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div className="flex gap-4 mb-4">
                        {/* Selector Localidad */}
                        <select 
                            className="flex-1 border p-2 rounded focus:ring-2 focus:ring-cyan-500 outline-none bg-gray-50"
                            value={newPost.locationId}
                            onChange={(e) => setNewPost({...newPost, locationId: Number(e.target.value)})}
                            required
                        >
                            <option value={0}>Selecciona Localidad...</option>
                            {locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                        </select>

                        {/* Selector Estrellas */}
                        <div className="flex items-center gap-1 bg-gray-50 px-3 rounded border">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button key={star} type="button" onClick={() => setNewPost({...newPost, rating: star})} className={`text-xl ${star <= newPost.rating ? 'text-yellow-400' : 'text-gray-300'}`}>★</button>
                            ))}
                        </div>
                    </div>

                    <textarea 
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 mb-4" 
                        rows={4} 
                        placeholder="Escribe tu reseña aquí..."
                        value={newPost.text}
                        onChange={(e) => setNewPost({...newPost, text: e.target.value})}
                        required
                    ></textarea>

                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <label className="text-gray-600 hover:text-cyan-600 font-medium cursor-pointer flex items-center gap-2">
                                {uploading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-paperclip"></i>}
                                <span>{newPost.images.length > 0 ? `${newPost.images.length} fotos` : 'Subir Fotos'}</span>
                                <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                            </label>
                            {newPost.images.length > 0 && (
                                <div className="flex gap-1">
                                    {newPost.images.map((url, i) => <img key={i} src={url} className="w-8 h-8 rounded object-cover border" />)}
                                </div>
                            )}
                        </div>
                        <button type="submit" className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-6 rounded-md transition-colors shadow">
                            Publicar
                        </button>
                    </div>
                </form>
            )}
          </div>

          {/* Lista de Reseñas */}
          <div className="space-y-8">
            {forumPosts.length === 0 ? (
                <p className="text-center text-gray-500">No hay reseñas recientes. ¡Sé el primero en opinar!</p>
            ) : (
                forumPosts.map((post) => (
                <div key={post.id} className="bg-white p-6 rounded-lg shadow-lg flex flex-col sm:flex-row gap-6">
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-700 font-bold text-xl mb-2">
                            {post.avatar_url ? <img src={post.avatar_url} className="w-full h-full rounded-full object-cover"/> : post.author.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-xs text-gray-500">{new Date(post.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <div className="flex items-center gap-2">
                                    <p className="font-bold text-gray-800">{post.author}</p>
                                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">{post.location_name}</span>
                                </div>
                                <div className="text-yellow-400 text-sm">
                                    {[...Array(5)].map((_, i) => (
                                        <i key={i} className={`fas fa-star ${i < post.rating ? '' : 'text-gray-300'}`}></i>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <p className="text-gray-600 leading-relaxed mb-4">{post.text}</p>
                        {post.images && post.images.length > 0 && (
                            <div className="flex flex-wrap gap-4">
                                {post.images.map((img, i) => (
                                <img key={i} src={img} alt="Post" className="w-32 h-20 object-cover rounded-md cursor-pointer hover:opacity-90" />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                ))
            )}
            
            <div className="text-center mt-8">
                <Link to="/forum" className="text-cyan-600 font-semibold hover:underline">Ver todas las reseñas &rarr;</Link>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default HomePage;