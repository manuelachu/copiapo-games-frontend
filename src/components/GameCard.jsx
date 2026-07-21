import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { GameContext } from '../context/GameContext';

export default function GameCard({ game }) {
  const { addToCart } = useContext(GameContext);

  const titulo = game.title || game.titulo || "Videojuego sin título";
  const imagen = game.image || game.imagen || "https://via.placeholder.com/150";
  const categoria = game.category || game.consola || "General";
  const precio = Number(game.price || game.precio || 0);
  const stockReal = game.stock ?? 0;
  
  // 🎯 EVALUACIÓN DE SI ES ADMIN (Flexible ante correos o valores antiguos)
  const rawCreador = String(game.cargado_por || '').toLowerCase();
  const esAdmin = rawCreador.includes('admin');

  // 🎯 ETIQUETA HOMOLOGADA PARA MOSTRAR
  const etiquetaSubido = esAdmin ? 'Subido: Administrador' : 'Subido: Usuario';

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden shadow-lg hover:border-blue-500 transition-all flex flex-col h-full">
      <img src={imagen} alt={titulo} className="w-full h-48 object-cover" />
      
      <div className="p-4 flex flex-col flex-grow justify-between gap-3">
        <div>
          
          {/* Badge que dice "Subido: Administrador" o "Subido: Usuario" */}
          <div className="mb-2.5 flex">
            <span className={`px-2 py-0.5 text-[9px] rounded font-bold uppercase tracking-wider border ${
              esAdmin
                ? 'bg-red-500/10 text-red-400 border-red-500/30'
                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
            }`}>
              {etiquetaSubido}
            </span>
          </div>

          <div className="flex justify-between items-center gap-2">
            <span className="text-[10px] uppercase font-bold text-blue-400 bg-blue-950 px-2 py-1 rounded truncate">
              {categoria}
            </span>
            <span className={`text-[10px] font-bold px-2 py-1 rounded whitespace-nowrap ${stockReal > 0 ? 'text-emerald-400 bg-emerald-950' : 'text-red-400 bg-red-950'}`}>
              Stock: {stockReal} u.
            </span>
          </div>
          
          <h3 className="text-base font-bold mt-2 text-white line-clamp-1" title={titulo}>{titulo}</h3>
          <p className="text-emerald-400 font-semibold text-sm mt-1">
            ${precio.toLocaleString('es-CL')}
          </p>
        </div>
        
        {/* BOTONES: Si es admin activa el botón de Añadir al Carrito */}
        <div className={esAdmin ? "grid grid-cols-2 gap-2 pt-2" : "pt-2"}>
          <Link 
            to={`/game/${game.id}`} 
            className="w-full text-center bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 px-1 rounded text-xs transition-colors flex items-center justify-center"
          >
            Ver Detalles
          </Link>
          
          {esAdmin && (
            <button 
              onClick={() => addToCart(game)}
              disabled={stockReal <= 0}
              className={`font-bold py-2 px-1 rounded text-xs transition-colors truncate cursor-pointer ${
                stockReal > 0 ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              {stockReal > 0 ? '🛒 Añadir' : 'Agotado'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}