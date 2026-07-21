import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { GameContext } from '../context/GameContext';

export default function Navbar() {
  const { user, logout, totalItems } = useContext(GameContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-slate-900 border-b border-slate-800 px-4 md:px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 text-white">
      
      <Link to="/" className="text-xl font-bold tracking-wider text-blue-500 hover:text-blue-400 whitespace-nowrap">
        🕹️ Copiapó Games Store
      </Link>
      
      
      <div className="flex flex-wrap gap-3 sm:gap-6 items-center justify-center">
        <Link to="/" className="hover:text-blue-400 transition-colors text-sm md:text-base">
          Catálogo
        </Link>
        
        {user ? (
          <>
            <Link to="/publicar" className="hover:text-blue-400 transition-colors text-sm md:text-base whitespace-nowrap">
              Vender Juego
            </Link>
            
           
            <Link to="/perfil" className="hover:text-blue-400 transition-colors text-sm md:text-base whitespace-nowrap">
              <span>Mi Perfil</span>
              <span className="hidden md:inline text-slate-400 text-xs ml-1">({user.email})</span>
            </Link>
            
            
            <Link 
              to="/carrito" 
              className="bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-full text-sm text-emerald-400 font-bold transition-colors flex items-center gap-1"
            >
              🛒 {totalItems}
            </Link>

            
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-500 px-3 py-1.5 md:px-4 rounded font-semibold text-xs md:text-sm transition-colors whitespace-nowrap"
            >
              Cerrar Sesión
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-blue-400 transition-colors text-sm md:text-base">
              Iniciar Sesión
            </Link>
            <Link to="/register" className="bg-blue-600 hover:bg-blue-500 px-3 py-1.5 md:px-4 rounded font-semibold text-xs md:text-sm transition-colors whitespace-nowrap">
              Registrarse
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}