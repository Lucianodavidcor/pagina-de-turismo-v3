import React from 'react';
import { Link } from 'react-router-dom';
import type { NavLink } from '../types';

interface HeaderProps {
  navLinks: NavLink[];
  showBookingButton?: boolean;
  isHome?: boolean;
  accentColor?: string;
  locationName?: string;
}

const Header: React.FC<HeaderProps> = ({ navLinks, showBookingButton = false, isHome = false, accentColor = 'blue', locationName }) => {
    
    const buttonColorClass = accentColor === 'orange' 
    ? 'bg-orange-500 hover:bg-orange-600' 
    : accentColor === 'cyan'
    ? 'bg-cyan-500 hover:bg-cyan-600'
    : 'bg-green-600 hover:bg-green-700';

  const headerTitle = isHome ? 'Turismo Neuquén' : `Turismo ${locationName}`;

  return (
    <header className={`sticky top-0 left-0 right-0 z-20 py-4 ${isHome ? 'absolute bg-black/30 backdrop-blur-sm' : 'bg-white/80 backdrop-blur-sm shadow-md'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link to="/" className={`flex items-center gap-2 font-bold ${isHome ? 'text-white' : 'text-slate-800'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className={`text-xl ${isHome ? 'text-white' : 'text-gray-800'}`}>
                {headerTitle}
            </span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link key={link.label} to={link.href} className={`text-sm font-medium transition-colors ${isHome ? 'text-gray-200 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
              {link.label}
            </Link>
          ))}
        </nav>
        {showBookingButton && (
          <a href="#" className={`hidden md:block px-5 py-2 rounded-md text-white text-sm font-semibold transition-colors ${buttonColorClass}`}>
            Reservar ahora
          </a>
        )}
      </div>
    </header>
  );
};

export default Header;