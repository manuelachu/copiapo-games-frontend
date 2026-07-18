import { Link, useNavigate } from 'react-router-dom';

import { useContext } from 'react';

import { GameContext } from '../context/GameContext';



export default function Navbar() {

  const { user, logout, cart } = useContext(GameContext);

  const navigate = useNavigate();



  const handleLogout = () => {

    logout();

    navigate('/login');

  };



  return (

    <nav className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex justify-between items-center text-white">

      <Link to="/" className="text-xl font-bold tracking-wider text-blue-500 hover:text-blue-400">

        🕹️ Copiapó Games Store

      </Link>

     

      <div className="flex gap-6 items-center">

        <Link to="/" className="hover:text-blue-400 transition-colors">Catálogo</Link>

       

        {user ? (

          <>

            <Link to="/publicar" className="hover:text-blue-400 transition-colors">Vender Juego</Link>

            <Link to="/perfil" className="hover:text-blue-400 transition-colors">Mi Perfil ({user.email})</Link>

            <span className="bg-slate-800 px-3 py-1 rounded-full text-sm text-emerald-400">

              🛒 {cart.length}

            </span>

            <button

              onClick={handleLogout}

              className="bg-red-600 hover:bg-red-500 px-4 py-1.5 rounded font-semibold text-sm transition-colors"

            >

              Cerrar Sesión

            </button>

          </>

        ) : (

          <>

            <Link to="/login" className="hover:text-blue-400 transition-colors">Iniciar Sesión</Link>

            <Link to="/register" className="bg-blue-600 hover:bg-blue-500 px-4 py-1.5 rounded font-semibold text-sm transition-colors">

              Registrarse

            </Link>

          </>

        )}

      </div>

    </nav>

  );

} 

