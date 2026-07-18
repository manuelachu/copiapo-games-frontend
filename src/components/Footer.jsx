import React from 'react';

export default function Footer() {
  
  const currentYear = new Date().getFullYear();

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

        
        <div className="flex gap-6 text-sm">
          <span className="text-xs font-semibold uppercase text-slate-500 tracking-wider block mb-1 md:hidden">
            Categorías
          </span>
          <p className="hover:text-blue-400 transition-colors cursor-pointer text-xs">PlayStation</p>
          <p className="hover:text-emerald-400 transition-colors cursor-pointer text-xs">Xbox</p>
          <p className="hover:text-red-400 transition-colors cursor-pointer text-xs">Nintendo</p>
        </div>

        <div className="text-center md:text-right text-xs text-slate-500">
          <p>Hito 2 - Desarrollo Frontend</p>
          <p className="mt-0.5 text-blue-400/60">React & Tailwind CSS</p>
        </div>

      </div>
    </footer>
  );
}