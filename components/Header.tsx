import React from 'react';
import { Link } from 'react-router-dom';
import type { NavLink } from '../types';
import { useAuth } from '../context/AuthContext'; // Importamos el hook de autenticación

interface HeaderProps {
  navLinks: NavLink[];
  showBookingButton?: boolean;
  isHome?: boolean;
  accentColor?: string;
  locationName?: string;
}

const Header: React.FC<HeaderProps> = ({ navLinks, showBookingButton = false, isHome = false, accentColor = 'blue', locationName }) => {
    
  // 1. Obtenemos la info del usuario y funciones del contexto
  const { user, isAdmin, logout } = useAuth();

  const buttonColorClass = accentColor === 'orange' 
    ? 'bg-orange-500 hover:bg-orange-600' 
    : accentColor === 'cyan'
    ? 'bg-cyan-500 hover:bg-cyan-600'
    : 'bg-green-600 hover:bg-green-700';

  const headerTitle = isHome ? 'Turismo Neuquén' : `Turismo ${locationName}`;

  // Clases dinámicas para textos según el fondo (Home transparente vs Páginas internas blancas)
  const textColorClass = isHome ? 'text-gray-200 hover:text-white' : 'text-gray-600 hover:text-gray-900';
  const logoTextClass = isHome ? 'text-white' : 'text-gray-800';

  return (
    <header className={`sticky top-0 left-0 right-0 z-20 py-4 ${isHome ? 'absolute bg-black/30 backdrop-blur-sm' : 'bg-white/80 backdrop-blur-sm shadow-md'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        
        {/* LOGO */}
        <Link to="/" className={`flex items-center gap-2 font-bold ${isHome ? 'text-white' : 'text-slate-800'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className={`text-xl ${logoTextClass}`}>
                {headerTitle}
            </span>
        </Link>

        {/* NAVEGACIÓN CENTRAL */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link key={link.label} to={link.href} className={`text-sm font-medium transition-colors ${textColorClass}`}>
              {link.label}
            </Link>
          ))}
        </nav>

        {/* GRUPO DE ACCIONES DERECHA (Admin + Auth + Booking) */}
        <div className="hidden md:flex items-center gap-4">
            
            {/* 1. Botón Panel Admin (Solo visible para ADMIN/SUPERADMIN) */}
            {isAdmin && (
                <Link to="/admin" className="bg-gray-800 text-white px-3 py-2 rounded-md text-sm font-semibold hover:bg-gray-700 transition-colors shadow-sm">
                    Panel Admin
                </Link>
            )}

            {/* 2. Lógica de Login/Logout */}
            {user ? (
                <div className="flex items-center gap-3 border-l pl-4 border-gray-400/30">
                    <span className={`text-sm font-medium ${isHome ? 'text-white' : 'text-gray-700'}`}>
                        {user.name.split(' ')[0]} {/* Muestra solo el primer nombre */}
                    </span>
                    <button 
                        onClick={logout} 
                        className="text-sm text-red-500 hover:text-red-400 font-semibold transition-colors"
                        title="Cerrar Sesión"
                    >
                        Salir
                    </button>
                </div>
            ) : (
                <Link 
                    to="/login" 
                    className={`text-sm font-bold transition-colors ${isHome ? 'text-white hover:text-cyan-300' : 'text-cyan-600 hover:text-cyan-700'}`}
                >
                    Ingresar
                </Link>
            )}

            {/* 3. Botón de Reserva (Existente) */}
            {showBookingButton && (
                <a href="#" className={`px-5 py-2 rounded-md text-white text-sm font-semibold transition-colors shadow-sm ${buttonColorClass}`}>
                    Reservar ahora
                </a>
            )}
        </div>

      </div>
    </header>
  );
};

export default Header;