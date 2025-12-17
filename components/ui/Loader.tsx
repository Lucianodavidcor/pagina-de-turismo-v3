// components/Loader.tsx
import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm transition-all">
      <div className="relative flex items-center justify-center">
        {/* Anillos decorativos animados */}
        <div className="absolute w-24 h-24 rounded-full border-4 border-cyan-100 animate-ping opacity-75"></div>
        <div className="absolute w-24 h-24 rounded-full border-4 border-cyan-500 opacity-20 animate-pulse"></div>
        
        {/* Ícono central */}
        <div className="relative z-10 bg-white p-4 rounded-full shadow-xl animate-bounce-slow">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        </div>
      </div>
      
      {/* Texto de carga */}
      <div className="mt-8 flex flex-col items-center gap-1">
        <h3 className="text-lg font-bold text-gray-700 tracking-widest uppercase">Explorando</h3>
        <div className="flex gap-1">
            <span className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce delay-75"></span>
            <span className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce delay-150"></span>
            <span className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce delay-300"></span>
        </div>
      </div>
    </div>
  );
};

export default Loader;