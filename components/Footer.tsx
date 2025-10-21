
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-800 text-gray-300">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Turismo Neuquén
            </h3>
            <p className="text-sm">Descubrí la magia de cada rincón de nuestra provincia.</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Navegación</h4>
            <ul className="space-y-2">
              <li><Link to="/buta-ranquil" className="hover:text-cyan-400 transition-colors">Buta Ranquil</Link></li>
              <li><Link to="/chos-malal" className="hover:text-cyan-400 transition-colors">Chos Malal</Link></li>
              <li><Link to="/actividades" className="hover:text-cyan-400 transition-colors">Actividades</Link></li>
              <li><Link to="/foro" className="hover:text-cyan-400 transition-colors">Foro</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Contacto</h4>
            <p className="text-sm">info@turismoneuquen.gob.ar</p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors"><i className="fab fa-instagram"></i></a>
              <a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors"><i className="fab fa-twitter"></i></a>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-700 pt-6 text-center text-sm">
          <p>&copy; 2025 LofSoft. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;