import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { NavLink } from '../types';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  navLinks: NavLink[];
  showBookingButton?: boolean;
  isHome?: boolean;
  accentColor?: string;
  locationName?: string;
}

const Header: React.FC<HeaderProps> = ({ navLinks, showBookingButton = false, isHome = false, accentColor = 'blue', locationName }) => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const buttonColorClass = accentColor === 'orange' 
    ? 'bg-orange-500 hover:bg-orange-600' 
    : accentColor === 'cyan'
    ? 'bg-cyan-500 hover:bg-cyan-600'
    : 'bg-green-600 hover:bg-green-700';

  const headerTitle = isHome ? 'Turismo Neuquén' : `Turismo ${locationName}`;
  const textColorClass = isHome ? 'text-gray-200 hover:text-white' : 'text-gray-600 hover:text-gray-900';
  const logoTextClass = isHome ? 'text-white' : 'text-gray-800';

  return (
    <header className={`sticky top-0 left-0 right-0 z-20 py-4 transition-all duration-300 ${isHome ? 'absolute bg-black/30 backdrop-blur-sm' : 'bg-white/90 backdrop-blur-md shadow-sm'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        
        {/* LOGO */}
        <Link to="/" className={`flex items-center gap-2 font-bold ${isHome ? 'text-white' : 'text-slate-800'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className={`text-xl tracking-tight ${logoTextClass}`}>
                {headerTitle}
            </span>
        </Link>

        {/* NAV */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link key={link.label} to={link.href} className={`text-sm font-medium transition-colors ${textColorClass}`}>
              {link.label}
            </Link>
          ))}
        </nav>

        {/* USER ACTIONS */}
        <div className="hidden md:flex items-center gap-4">
            
            {isAdmin && (
                <Link to="/admin" className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-700 transition shadow-lg flex items-center gap-2">
                    <i className="fas fa-cog"></i> Panel
                </Link>
            )}

            {user ? (
                <div className="flex items-center gap-3 pl-4">
                    <Link to="/perfil" className="flex items-center gap-2 group cursor-pointer">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold text-xs shadow-md group-hover:scale-110 transition">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className={`text-sm font-medium group-hover:underline ${isHome ? 'text-white' : 'text-gray-700'}`}>
                            {user.name.split(' ')[0]}
                        </span>
                    </Link>
                    <div className={`h-6 w-px ${isHome ? 'bg-white/30' : 'bg-gray-300'}`}></div>
                    <button onClick={logout} className="text-red-500 hover:text-red-400 transition" title="Salir">
                        <i className="fas fa-sign-out-alt"></i>
                    </button>
                </div>
            ) : (
                <div className="flex items-center gap-3">
                    <Link 
                        to="/login" 
                        className={`text-sm font-bold transition-colors ${isHome ? 'text-white hover:text-cyan-300' : 'text-gray-600 hover:text-cyan-600'}`}
                    >
                        Ingresar
                    </Link>
                    <Link 
                        to="/register" 
                        className="bg-cyan-600 text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-cyan-700 transition shadow-md hover:shadow-cyan-500/30"
                    >
                        Registrarse
                    </Link>
                </div>
            )}
        </div>

      </div>
    </header>
  );
};

export default Header;