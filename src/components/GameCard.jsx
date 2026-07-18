import { Link } from 'react-router-dom';

export default function GameCard({ game }) {
  
  const titulo = game.title || game.titulo || "Videojuego sin título";
  const imagen = game.image || game.imagen || "https://via.placeholder.com/150";
  const categoria = game.category || game.consola || "General";
  
  
  const precio = Number(game.price || game.precio || 0);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden shadow-lg hover:border-blue-500 transition-all">
      <img src={imagen} alt={titulo} className="w-full h-48 object-cover" />
      <div className="p-4">
        <span className="text-xs uppercase font-bold text-blue-400 bg-blue-950 px-2 py-1 rounded">
          {categoria}
        </span>
        <h3 className="text-lg font-bold mt-2 text-white truncate">{titulo}</h3>
        <p className="text-emerald-400 font-semibold mt-1">
          ${precio.toLocaleString('es-CL')}
        </p>
        
        <Link to={`/game/${game.id}`} className="block text-center mt-4 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded text-sm transition-colors">
          Ver Detalles
        </Link>
      </div>
    </div>
  );
}