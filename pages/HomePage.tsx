import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { HOME_NAV_LINKS, FORUM_POSTS } from '../constants';
import { getAllLocations, getGalleryByLocationId } from '../services/locations';
import type { LocationData } from '../types';

const HomePage: React.FC = () => {
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [adventureImages, setAdventureImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 1. Cargar Localidades
        const locs = await getAllLocations();
        setLocations(locs);

        // 2. Cargar y mezclar Galería Random
        if (locs.length > 0) {
          const galleryPromises = locs.map(l => getGalleryByLocationId(l.id));
          const allGalleries = await Promise.all(galleryPromises);
          const mixedImages = allGalleries.flat().sort(() => 0.5 - Math.random());
          setAdventureImages(mixedImages.slice(0, 8));
        }
      } catch (error) {
        console.error("Error cargando home:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-white">
      <Header navLinks={HOME_NAV_LINKS} isHome={true} />

      {/* Hero Section */}
      <section className="relative h-screen bg-cover bg-center text-white" style={{ backgroundImage: "url('https://vantravellers.com/wp-content/uploads/2017/06/Chilecito-Ruta-40-scaled.jpg')" }}>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">Descubre el Corazón de Neuquén: <br /> Turismo Norte</h1>
          <p className="text-lg md:text-xl mb-8 max-w-3xl">Explora la belleza natural y la rica historia de nuestras joyas patagónicas.</p>
          <div>
            {loading ? (
              <span className="text-gray-200">Cargando destinos...</span>
            ) : (
              locations.map(loc => (
                <Link
                  key={loc.id}
                  to={`/${loc.slug}`}
                  className={`
          font-bold py-3 px-8 rounded-md transition-transform transform hover:scale-105 mr-4 mb-4 inline-block
          ${loc.accentColor === 'cyan'
                      ? 'bg-cyan-500 hover:bg-cyan-600 text-white'  // Estilo para Cyan (Buta Ranquil)
                      : 'bg-white hover:bg-gray-200 text-gray-800'  // Estilo para el resto (Chos Malal)
                    }
        `}
                >
                  Explorar {loc.name}
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Destinos Imperdibles - AHORA OCUPA EL ANCHO COMPLETO */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Destinos Imperdibles</h2>

          {/* ELIMINADO: max-w-5xl mx-auto para que ocupe todo el ancho */}
          <div className="grid md:grid-cols-2 gap-8 w-full">

            {loading ? (
              <div className="col-span-2 text-center py-10">Cargando...</div>
            ) : (
              locations.map((loc) => (
                <div key={loc.id} className="relative rounded-lg overflow-hidden shadow-lg transform hover:-translate-y-2 transition-transform duration-300 h-96 group">
                  <img src={loc.hero.image} alt={loc.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors"></div>
                  <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                    <h3 className="text-3xl font-bold mb-2">{loc.name}</h3>
                    <p className="mb-4">{loc.hero.subtitle || 'Naturaleza pura'}</p>
                    <Link
                      to={`/${loc.slug}`}
                      className={`text-white font-semibold py-2 px-4 rounded-md self-start transition-colors ${loc.accentColor === 'orange' ? 'bg-orange-500 hover:bg-orange-600' :
                          loc.accentColor === 'cyan' ? 'bg-cyan-500 hover:bg-cyan-600' :
                            'bg-green-600 hover:bg-green-700'
                        }`}
                    >
                      Explorar {loc.name}
                    </Link>
                  </div>
                </div>
              ))
            )}

          </div>
        </div>
      </section>

      {/* Galería de Aventuras */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Galería de Aventuras</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(loading || adventureImages.length === 0)
              ? [...Array(8)].map((_, i) => (
                <div key={i} className="overflow-hidden rounded-lg shadow-md aspect-w-1 aspect-h-1 bg-gray-200 animate-pulse min-h-[200px]"></div>
              ))
              : adventureImages.map((imgUrl, i) => (
                <div key={i} className="overflow-hidden rounded-lg shadow-md aspect-square group">
                  <img src={imgUrl} alt={`Aventura ${i + 1}`} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300" />
                </div>
              ))
            }
          </div>
        </div>
      </section>

      {/* Foro de Viajeros */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 max-w-4xl">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Foro de Viajeros</h2>
          <div className="bg-white p-8 rounded-lg shadow-lg mb-12">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">Compartí tu experiencia</h3>
            <textarea className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500" rows={4} placeholder="Escribe tu reseña aquí..."></textarea>
            <div className="flex justify-between items-center mt-4">
              <button className="text-gray-600 hover:text-cyan-600 font-medium">
                <i className="fas fa-paperclip mr-2"></i>Subir Fotos
              </button>
              <button className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-6 rounded-md transition-colors">
                Publicar
              </button>
            </div>
          </div>
          <div className="space-y-8">
            {FORUM_POSTS.map((post, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg flex flex-col sm:flex-row gap-6">
                <img src={post.avatar} alt={post.author} className="w-16 h-16 rounded-full mx-auto sm:mx-0" />
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-bold text-gray-800">{post.author}</p>
                      <div className="text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <i key={i} className={`fa-star ${i < post.rating ? 'fas' : 'far'}`}></i>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed mb-4">{post.text}</p>
                  <div className="flex flex-wrap gap-4">
                    {post.images.map((img, i) => (
                      <img key={i} src={img} alt={`Imagen de ${post.author} ${i + 1}`} className="w-40 h-24 object-cover rounded-md" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;