
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { HOME_NAV_LINKS, FORUM_POSTS } from '../constants';

const HomePage: React.FC = () => {
  return (
    <div className="bg-white">
      <Header navLinks={HOME_NAV_LINKS} isHome={true} />

      {/* Hero Section */}
      <section className="relative h-screen bg-cover bg-center text-white" style={{ backgroundImage: "url('https://picsum.photos/seed/neuquen-main/1920/1080')" }}>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">Descubre el Corazón de Neuquén: <br /> Buta Ranquil y Chos Malal</h1>
          <p className="text-lg md:text-xl mb-8 max-w-3xl">Explora la belleza natural y la rica historia de dos joyas de la Patagonia.</p>
          <div>
            <Link to="/buta-ranquil" className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-8 rounded-md transition-transform transform hover:scale-105 mr-4">
              Explorar Buta Ranquil
            </Link>
            <Link to="/chos-malal" className="bg-white hover:bg-gray-200 text-gray-800 font-bold py-3 px-8 rounded-md transition-transform transform hover:scale-105">
              Explorar Chos Malal
            </Link>
          </div>
        </div>
      </section>

      {/* Destinos Imperdibles */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Destinos Imperdibles</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="relative rounded-lg overflow-hidden shadow-lg transform hover:-translate-y-2 transition-transform duration-300">
              <img src="https://picsum.photos/seed/buta-ranquil-card/600/400" alt="Buta Ranquil" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40"></div>
              <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                <h3 className="text-3xl font-bold mb-2">Buta Ranquil</h3>
                <p className="mb-4">Naturaleza en estado puro.</p>
                <Link to="/buta-ranquil" className="bg-cyan-500 text-white font-semibold py-2 px-4 rounded-md self-start hover:bg-cyan-600 transition-colors">
                  Explorar Buta Ranquil
                </Link>
              </div>
            </div>
            <div className="relative rounded-lg overflow-hidden shadow-lg transform hover:-translate-y-2 transition-transform duration-300">
              <img src="https://picsum.photos/seed/chos-malal-card/600/400" alt="Chos Malal" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40"></div>
              <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                <h3 className="text-3xl font-bold mb-2">Chos Malal</h3>
                <p className="mb-4">Donde la historia y el paisaje se encuentran.</p>
                <Link to="/chos-malal" className="bg-cyan-500 text-white font-semibold py-2 px-4 rounded-md self-start hover:bg-cyan-600 transition-colors">
                  Explorar Chos Malal
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Galería de Aventuras */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Galería de Aventuras</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="overflow-hidden rounded-lg shadow-md aspect-w-1 aspect-h-1">
                <img src={`https://picsum.photos/seed/galeria${i}/400/400`} alt={`Aventura ${i + 1}`} className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300" />
              </div>
            ))}
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
