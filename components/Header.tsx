import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import type { NavLink } from '../types';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  navLinks: NavLink[];
  showBookingButton?: boolean;
  isHome?: boolean;
  accentColor?: string;
  locationName?: string;
}

const Header: React.FC<HeaderProps> = ({ 
  navLinks, 
  isHome = false, 
  locationName 
}) => {
  const { user, isAdmin, logout } = useAuth();
  const location = useLocation();
  
  // Estado para detectar el scroll
  const [scrolled, setScrolled] = useState(false);
  // Estado para menú móvil
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Efecto de scroll para cambiar el estilo del header
  useEffect(() => {
    const handleScroll = () => {
      // Si bajamos más de 20px, activamos el modo "scrolled"
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lógica de estilos dinámicos
  // Si estamos en Home Y no hemos hecho scroll, es transparente. Si no, es blanco.
  const isTransparent = isHome && !scrolled;
  
  const headerBgClass = isTransparent 
    ? 'bg-transparent py-6' 
    : 'bg-white/95 backdrop-blur-md shadow-md py-3';

  const textColorClass = isTransparent 
    ? 'text-white hover:text-cyan-200' 
    : 'text-slate-600 hover:text-cyan-600';

  const logoColorClass = isTransparent ? 'text-white' : 'text-slate-800';
  
  const headerTitle = isHome ? 'Turismo Neuquén' : `Turismo ${locationName || ''}`;

  return (
    // FIX IMPORTANTE: z-50 para que SIEMPRE esté arriba del Foro y otros elementos
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${headerBgClass}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        
        {/* --- LOGO --- */}
        <Link to="/" className="flex items-center gap-2 group z-50 relative">
            <div className={`transition-transform duration-500 group-hover:rotate-12 ${isTransparent ? 'text-cyan-300' : 'text-cyan-600'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            </div>
            <span className={`text-xl font-extrabold tracking-tight transition-colors duration-300 ${logoColorClass}`}>
                {headerTitle}
            </span>
        </Link>

        {/* --- DESKTOP NAV --- */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
                key={link.label} 
                to={link.href} 
                className={`text-sm font-bold tracking-wide transition-all duration-300 relative group ${textColorClass} ${location.pathname === link.href ? 'text-cyan-500' : ''}`}
            >
              {link.label}
              {/* Animación de subrayado */}
              <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-500 transition-all duration-300 group-hover:w-full ${location.pathname === link.href ? 'w-full' : ''}`}></span>
            </Link>
          ))}
        </nav>

        {/* --- USER ACTIONS (DESKTOP) --- */}
        <div className="hidden md:flex items-center gap-4">
            
            {/* Botón Admin */}
            {isAdmin && (
                <Link to="/admin" className="bg-indigo-600 text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-indigo-700 transition shadow-lg hover:shadow-indigo-500/30 flex items-center gap-2 transform hover:-translate-y-0.5">
                    <i className="fas fa-shield-alt"></i> Panel
                </Link>
            )}

            {user ? (
                <div className={`flex items-center gap-3 pl-4 border-l ${isTransparent ? 'border-white/20' : 'border-gray-200'}`}>
                    <Link to="/perfil" className="flex items-center gap-2 group cursor-pointer">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md ring-2 ring-transparent group-hover:ring-cyan-300 transition-all">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className={`text-sm font-medium group-hover:underline ${isTransparent ? 'text-white' : 'text-gray-700'}`}>
                            {user.name.split(' ')[0]}
                        </span>
                    </Link>
                    <button 
                        onClick={logout} 
                        className={`transition-colors p-2 rounded-full hover:bg-red-50 ${isTransparent ? 'text-white/80 hover:text-red-500' : 'text-gray-400 hover:text-red-500'}`} 
                        title="Cerrar Sesión"
                    >
                        <i className="fas fa-sign-out-alt"></i>
                    </button>
                </div>
            ) : (
                <div className="flex items-center gap-4">
                    <Link 
                        to="/login" 
                        className={`text-sm font-bold transition-colors ${isTransparent ? 'text-white hover:text-cyan-200' : 'text-slate-600 hover:text-cyan-600'}`}
                    >
                        Ingresar
                    </Link>
                    <Link 
                        to="/register" 
                        className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-lg hover:shadow-cyan-500/40 transition-all transform hover:-translate-y-0.5 active:scale-95"
                    >
                        Registrarse
                    </Link>
                </div>
            )}
        </div>

        {/* --- MOBILE BURGER MENU --- */}
        <button 
            className={`md:hidden text-2xl z-50 relative focus:outline-none transition-colors ${mobileMenuOpen ? 'text-slate-800' : (isTransparent ? 'text-white' : 'text-slate-800')}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
            <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>

      </div>

      {/* --- MOBILE DROPDOWN --- */}
      <div className={`fixed inset-0 bg-white/95 backdrop-blur-xl z-40 transition-all duration-300 md:hidden flex flex-col items-center justify-center space-y-8 ${mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
        {navLinks.map((link) => (
            <Link 
                key={link.label} 
                to={link.href} 
                onClick={() => setMobileMenuOpen(false)}
                className="text-2xl font-bold text-slate-800 hover:text-cyan-600"
            >
                {link.label}
            </Link>
        ))}
        <div className="w-16 h-1 bg-gray-100 rounded-full"></div>
        {user ? (
            <div className="flex flex-col items-center gap-4">
                <span className="text-lg text-gray-600">Hola, <b>{user.name}</b></span>
                {isAdmin && <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="text-indigo-600 font-bold">Ir al Panel</Link>}
                <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="text-red-500 font-bold">Cerrar Sesión</button>
            </div>
        ) : (
            <div className="flex flex-col gap-4 w-64">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-full py-3 text-center rounded-xl border-2 border-slate-200 font-bold text-slate-700">Ingresar</Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="w-full py-3 text-center rounded-xl bg-cyan-600 text-white font-bold shadow-lg">Registrarse</Link>
            </div>
        )}
      </div>

    </header>
  );
};

export default Header;