import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Loader from '../components/ui/Loader'; // IMPORTANTE: Importamos el Loader
import { HOME_NAV_LINKS } from '../constants';
// Eliminamos imports de fetching directo (getAllLocations, etc) porque ahora lo hace el hook
import { createPost, ForumPost } from '../services/forum';
import { uploadImages } from '../services/content';
import { useAuth } from '../context/AuthContext';
// IMPORTANTE: Importamos el hook de caché
import { useHomeData } from '../hooks/useHomeData';

const HomePage: React.FC = () => {
  const { user } = useAuth();
  
  // --- LÓGICA DE CACHÉ Y CARGA ---
  // Reemplazamos los useState y useEffect antiguos por esta sola línea.
  // Al volver al home, 'loading' será false instantáneamente si ya hay datos.
  const { locations, forumPosts, adventureImages, loading } = useHomeData();

  // Estados locales solo para el formulario (esto no necesita caché)
  const [newPost, setNewPost] = useState({ text: '', rating: 5, locationId: 0, images: [] as string[] });
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [hoverRating, setHoverRating] = useState(0);

  // --- HANDLERS DEL FORMULARIO (Se mantienen igual) ---
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

  const removeImage = (index: number) => {
      setNewPost(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
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

    try {
      await createPost({
        location_id: newPost.locationId,
        rating: newPost.rating,
        text: newPost.text,
        images: newPost.images
      });
      setMsg({ type: 'success', text: '¡Enviado! Tu reseña está pendiente de revisión.' });
      setNewPost({ text: '', rating: 5, locationId: 0, images: [] });
      setHoverRating(0);
    } catch (error) {
      setMsg({ type: 'error', text: 'Error al enviar la reseña.' });
    }
  };

  // --- RENDERIZADO ---
  
  // 1. Si está cargando (y no hay caché), mostramos tu animación nueva
  if (loading) {
    return <Loader />;
  }

  // 2. Si ya cargó, mostramos tu diseño intacto
  return (
    <div className="bg-white font-sans">
      <Header navLinks={HOME_NAV_LINKS} isHome={true} />

      {/* Hero Section */}
      <section className="relative h-screen bg-cover bg-center text-white" style={{ backgroundImage: "url('https://vantravellers.com/wp-content/uploads/2017/06/Chilecito-Ruta-40-scaled.jpg')" }}>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4 drop-shadow-lg">Descubre el Corazón de Neuquén: <br /> Turismo Norte</h1>
          <p className="text-lg md:text-xl mb-8 max-w-3xl drop-shadow-md">Explora la belleza natural y la rica historia de nuestras localidades.</p>
          <div className="flex flex-wrap justify-center gap-4">
             {locations.slice(0, 2).map(loc => (
                <Link key={loc.id} to={`/${loc.slug}`} className={`font-bold py-3 px-8 rounded-full transition-transform transform hover:scale-105 shadow-lg ${loc.accentColor === 'cyan' ? 'bg-cyan-600 hover:bg-cyan-700 text-white' : 'bg-white hover:bg-gray-100 text-gray-900'}`}>
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
          <div className="grid md:grid-cols-2 gap-8 w-full max-w-6xl mx-auto">
              {/* Nota: loading ya se maneja arriba con el Loader, pero dejamos el map seguro */}
              {locations.map((loc) => (
                <div key={loc.id} className="relative rounded-2xl overflow-hidden shadow-xl transform hover:-translate-y-2 transition-transform duration-300 h-96 group cursor-pointer">
                  <img src={loc.hero.image} alt={loc.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/90 transition-colors"></div>
                  <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                    <h3 className="text-4xl font-bold mb-2">{loc.name}</h3>
                    <p className="mb-6 text-gray-200">{loc.hero.subtitle || 'Naturaleza pura'}</p>
                    <Link to={`/${loc.slug}`} className="bg-white/20 backdrop-blur-md border border-white/50 text-white font-semibold py-2 px-6 rounded-full self-start hover:bg-white hover:text-gray-900 transition-all">
                      Conocer más
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
                <div key={i} className="overflow-hidden rounded-xl shadow-md aspect-square group relative">
                  <img src={img} alt={`Aventura ${i + 1}`} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                </div>
              ))
            ) : (
               [...Array(4)].map((_, i) => <div key={i} className="bg-gray-200 animate-pulse rounded-xl aspect-square"></div>)
            )}
          </div>
        </div>
      </section>

      {/* FORO DE VIAJEROS */}
      <section className="py-24 bg-slate-50 relative overflow-hidden">
        {/* Decoración fondo */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-8 left-0 w-64 h-64 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

        <div className="container mx-auto px-6 max-w-5xl relative z-10">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">La Voz de los Viajeros</h2>
          <p className="text-center text-gray-500 mb-12 max-w-2xl mx-auto">Únete a nuestra comunidad y comparte tus mejores momentos en el norte neuquino.</p>
          
          {/* Formulario Estilizado */}
          <div className="bg-white p-8 rounded-2xl shadow-xl mb-16 border border-gray-100">
            {msg.text && (
                <div className={`p-3 mb-6 rounded text-center text-sm font-bold ${msg.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {msg.text}
                </div>
            )}
            
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600">
                    <i className="fas fa-comment-alt"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-800">Deja tu reseña</h3>
            </div>
            
            {!user ? (
                <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <p className="text-gray-500 mb-4">¿Ya visitaste alguno de nuestros destinos?</p>
                    <Link to="/login" className="inline-block bg-cyan-600 text-white font-bold py-2 px-6 rounded-full hover:bg-cyan-700 transition shadow">
                        Inicia Sesión para comentar
                    </Link>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        {/* Selector Localidad */}
                        <div className="relative">
                            <select 
                                className="w-full pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none appearance-none"
                                value={newPost.locationId}
                                onChange={(e) => setNewPost({...newPost, locationId: Number(e.target.value)})}
                                required
                            >
                                <option value={0}>Selecciona el destino...</option>
                                {locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                            </select>
                            <div className="absolute right-3 top-3.5 text-gray-400 pointer-events-none"><i className="fas fa-chevron-down"></i></div>
                        </div>

                        {/* Estrellas */}
                        <div className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded-xl border border-gray-200">
                            <span className="text-sm text-gray-500 font-medium">Calificación:</span>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button 
                                        key={star} type="button" 
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        onClick={() => setNewPost({...newPost, rating: star})} 
                                        className={`text-2xl transition-transform hover:scale-110 ${star <= (hoverRating || newPost.rating) ? 'text-yellow-400' : 'text-gray-200'}`}
                                    >★</button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <textarea 
                        className="w-full p-4 border border-gray-200 bg-gray-50 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:bg-white outline-none transition h-32 resize-none" 
                        placeholder="Cuéntanos tu experiencia..."
                        value={newPost.text}
                        onChange={(e) => setNewPost({...newPost, text: e.target.value})}
                        required
                    ></textarea>

                    <div className="flex justify-between items-end pt-2">
                        <div className="space-y-2">
                            <div className="flex gap-2">
                                {newPost.images.map((url, i) => (
                                    <div key={i} className="relative w-12 h-12">
                                        <img src={url} className="w-full h-full object-cover rounded-lg border" />
                                        <button type="button" onClick={() => removeImage(i)} className="absolute -top-1 -right-1 bg-red-500 text-white w-4 h-4 rounded-full flex items-center justify-center text-xs">×</button>
                                    </div>
                                ))}
                                <label className="w-12 h-12 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-cyan-500 hover:bg-cyan-50 transition text-gray-400 hover:text-cyan-600">
                                    {uploading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-camera"></i>}
                                    <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                                </label>
                            </div>
                        </div>
                        <button type="submit" className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-cyan-500/30 transition transform active:scale-95">
                            Publicar Reseña
                        </button>
                    </div>
                </form>
            )}
          </div>

          {/* Lista de Reseñas */}
          <div className="grid gap-6">
            {forumPosts.map((post) => (
                <div key={post.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition flex gap-4">
                    <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 p-0.5">
                            <div className="w-full h-full bg-white rounded-full flex items-center justify-center overflow-hidden">
                                {post.avatar_url ? <img src={post.avatar_url} className="w-full h-full object-cover"/> : <span className="font-bold text-gray-500">{post.author.charAt(0)}</span>}
                            </div>
                        </div>
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="font-bold text-gray-900">{post.author}</h4>
                                <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                                    <span>{new Date(post.created_at).toLocaleDateString()}</span>
                                    <span>•</span>
                                    <span className="text-cyan-600 font-semibold">{post.location_name}</span>
                                </div>
                            </div>
                            <div className="flex text-yellow-400 text-sm">
                                {[...Array(5)].map((_, i) => <i key={i} className={`fas fa-star ${i < post.rating ? '' : 'text-gray-200'}`}></i>)}
                            </div>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed mb-3">"{post.text}"</p>
                        {post.images?.length > 0 && (
                            <div className="flex gap-2">
                                {post.images.map((img, i) => (
                                    <img key={i} src={img} className="w-16 h-12 object-cover rounded-lg border border-gray-100" />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/foro" className="inline-flex items-center gap-2 text-cyan-700 font-bold hover:text-cyan-900 transition">
                Ver todas las experiencias <i className="fas fa-arrow-right"></i>
            </Link>
          </div>

        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default HomePage;