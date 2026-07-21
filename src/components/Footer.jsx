import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { setFilter } = useContext(GameContext);

  const handleFooterFilter = (category) => {
    if (typeof setFilter === 'function') {
      setFilter(category);
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-8 mt-auto w-full">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        
        <div className="text-center md:text-left">
          <h3 className="text-white font-bold text-lg tracking-wide">
            COPIAPÓ <span className="text-blue-400">GAMES</span> STORE
          </h3>
          <p className="text-xs mt-1">
            &copy; {currentYear} Todos los derechos reservados.
          </p>
        </div>

        
        <div className="flex gap-6 text-sm items-center">
          <span className="text-xs font-semibold uppercase text-slate-500 tracking-wider block mb-1 md:hidden">
            Categorías
          </span>
          <button 
            onClick={() => handleFooterFilter('playstation')} 
            className="hover:text-blue-400 transition-colors cursor-pointer text-xs font-medium focus:outline-none"
          >
            PlayStation
          </button>
          <button 
            onClick={() => handleFooterFilter('xbox')} 
            className="hover:text-emerald-400 transition-colors cursor-pointer text-xs font-medium focus:outline-none"
          >
            Xbox
          </button>
          <button 
            onClick={() => handleFooterFilter('nintendo')} 
            className="hover:text-red-400 transition-colors cursor-pointer text-xs font-medium focus:outline-none"
          >
            Nintendo
          </button>
        </div>

        <div className="text-center md:text-right text-xs text-slate-500">
          <p className="font-semibold text-slate-400">Trabajo Final - Integración Total</p>
          <p className="mt-0.5 text-blue-400/60">Node.js, React & PostgreSQL</p>
        </div>

      </div>
    </footer>
  );
}