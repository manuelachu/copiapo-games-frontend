import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { GameContext } from '../context/GameContext'; // 👈 Importamos el contexto

export default function GameCard({ game }) {
  const { addToCart } = useContext(GameContext); // 👈 Sacamos la función para añadir

  const titulo = game.title || game.titulo || "Videojuego sin título";
  const imagen = game.image || game.imagen || "https://via.placeholder.com/150";
  const categoria = game.category || game.consola || "General";
  const precio = Number(game.price || game.precio || 0);
  const stockReal = game.stock ?? 0; // 👈 Leemos el stock de la BD

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden shadow-lg hover:border-blue-500 transition-all flex flex-column h-full">
      <img src={imagen} alt={titulo} className="w-full h-48 object-cover" />
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-center">
          <span className="text-xs uppercase font-bold text-blue-400 bg-blue-950 px-2 py-1 rounded">
            {categoria}
          </span>
          <span className={`text-xs font-semibold px-2 py-1 rounded ${stockReal > 0 ? 'text-emerald-400 bg-emerald-950' : 'text-red-400 bg-red-950'}`}>
            Stock: {stockReal} u.
          </span>
        </div>
        
        <h3 className="text-lg font-bold mt-2 text-white truncate">{titulo}</h3>
        <p className="text-emerald-400 font-semibold mt-1">
          ${precio.toLocaleString('es-CL')}
        </p>
        
        <div className="grid grid-cols-2 gap-2 mt-4">
          <Link to={`/game/${game.id}`} className="text-center bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 px-2 rounded text-xs transition-colors flex items-center justify-center">
            Ver Detalles
          </Link>
          
          <button 
            onClick={() => addToCart(game)}
            disabled={stockReal <= 0}
            className={`font-bold py-2 px-2 rounded text-xs transition-colors ${stockReal > 0 ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
          >
            {stockReal > 0 ? '🛒 Añadir' : 'Agotado'}
          </button>
        </div>
      </div>
    </div>
  );
}