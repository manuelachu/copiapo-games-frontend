import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GameContext } from '../context/GameContext';

export default function Navbar() {
  const { user, logout, setFilter, totalItems } = useContext(GameContext);
  const navigate = useNavigate();

  const handleGoHome = () => {
    if (setFilter) setFilter('all');
    navigate('/');
  };

  return (
    <nav className="bg-slate-900 border-b border-slate-800 text-white px-6 py-4 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* LOGO - Redirige a Home y limpia el filtro a 'all' */}
        <button 
          onClick={handleGoHome} 
          className="flex items-center gap-2 text-xl font-extrabold text-blue-400 hover:text-blue-300 transition-colors focus:outline-none cursor-pointer"
        >
          🎮 <span>Copiapó Games Store</span>
        </button>

        {/* MENÚ COMPLETO RESTAURADO */}
        <div className="flex items-center gap-6">
          
          <button 
            onClick={handleGoHome} 
            className="text-slate-300 hover:text-white transition-colors text-sm font-medium cursor-pointer"
          >
            Catálogo
          </button>

          {user ? (
            <div className="flex items-center gap-5">
              
              {/* Opción Vender Juego */}
              <Link 
                to="/sell" 
                className="text-slate-300 hover:text-emerald-400 transition-colors text-sm font-medium flex items-center gap-1"
              >
                ➕ <span>Vender Juego</span>
              </Link>

              {/* Opción Mi Perfil */}
              <Link 
                to="/profile" 
                className="text-slate-300 hover:text-blue-400 transition-colors text-sm font-medium flex items-center gap-1"
              >
                👤 <span>Mi Perfil</span>
              </Link>

              {/* Carrito de Compras */}
              <Link to="/cart" className="relative text-slate-300 hover:text-white transition-colors">
                🛒
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-emerald-500 text-slate-950 font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* Email de usuario */}
              <span className="text-xs text-slate-400 font-mono hidden md:inline">{user.email}</span>

              {/* Botón Cerrar Sesión */}
              <button 
                onClick={logout} 
                className="bg-red-600 hover:bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                Cerrar Sesión
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-slate-300 hover:text-white text-sm font-medium px-3 py-1.5">
                Iniciar Sesión
              </Link>
              <Link to="/register" className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors shadow-md">
                Registrarse
              </Link>
            </div>
          )}

        </div>

      </div>
    </nav>
  );
}