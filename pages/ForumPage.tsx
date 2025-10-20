import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { HOME_NAV_LINKS, FORUM_POSTS } from '../constants';

const ForumPage: React.FC = () => {
    return (
        <div className="bg-gray-50 min-h-screen">
            <Header navLinks={HOME_NAV_LINKS} isHome={false} />
            <main className='pt-20'>
                <section className="py-20">
                    <div className="container mx-auto px-6 max-w-4xl">
                        <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">Foro de Viajeros</h1>
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
            </main>
            <Footer />
        </div>
    );
};

export default ForumPage;