import { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GameContext } from '../context/GameContext';
import GameCard from '../components/GameCard';

export default function Home() {
  // Extraemos filter y setFilter directamente del contexto global
  const { games, filter, setFilter } = useContext(GameContext);
  const [visibleGames, setVisibleGames] = useState([]);
  const [animate, setAnimate] = useState(false);

  // Filtrar los videojuegos asegurando que 'filter' exista con un respaldo seguro
  const currentFilter = filter || 'all';

  const filteredGames = currentFilter === 'all' 
    ? games 
    : games.filter(g => {
        const categoriaJuego = (g.category || g.consola || "").toLowerCase();
        return categoriaJuego === currentFilter.toLowerCase();
      });

  // Manejar el efecto de animación al cambiar de filtro (desde arriba o desde el Footer)
  useEffect(() => {
    setAnimate(false);
    const timer = setTimeout(() => {
      setVisibleGames(filteredGames);
      setAnimate(true);
    }, 150); // Pequeña pausa para reiniciar el estado de la animación

    return () => clearTimeout(timer);
  }, [filter, games]);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      
      {/* 🎯 BANNER INFORMATIVO / MENSAJE PRINCIPAL */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900 border border-slate-800 rounded-xl p-6 md:p-8 mb-8 shadow-2xl relative overflow-hidden">
        
        {/* Glow de fondo opcional */}
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-3xl relative z-10">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20 inline-block mb-3">
            🎮 Tu Mercado Gamer de Copiapó
          </span>
          
          <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight mb-3">
            Compra juegos de tienda <span className="text-blue-500">o publica los tuyos</span>
          </h1>
          
          <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-6">
            Explora nuestro catálogo oficial de consolas y videojuegos. ¿Tienes títulos en casa que ya no juegas? 
            <strong className="text-white font-semibold"> Inicia sesión, publica tu videojuego e ingresa tus redes sociales</strong> (Facebook o Instagram) para que los compradores te contacten directamente y cierres trato.
          </p>

          <div className="flex flex-wrap gap-4 items-center">
            <Link 
              to="/publicar" 
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-2.5 rounded-lg text-sm transition-all duration-200 shadow-lg hover:shadow-blue-600/25 flex items-center gap-2"
            >
              ➕ Vender mi juego
            </Link>
            <span className="text-xs text-slate-400 font-medium">
              * Publica gratis y conecta directamente con la comunidad local.
            </span>
          </div>
        </div>
      </div>

      {/* Encabezado Principal y Filtros */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-white">Catálogo de Videojuegos</h2>
          {/* Texto actualizado para el Trabajo Final */}
          <p className="text-sm text-blue-400 font-medium mt-1">
            Trabajo Final - Copiapó Games Store
          </p>
        </div>

        {/* Botones de Categorías */}
        <div className="flex flex-wrap justify-center gap-3 bg-slate-900 p-1.5 rounded-lg border border-slate-800">
          {['all', 'playstation', 'xbox', 'nintendo'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-1.5 rounded text-sm font-medium capitalize transition-all duration-200 cursor-pointer ${
                currentFilter === cat 
                  ? 'bg-blue-600 text-white shadow-md scale-105' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {cat === 'all' ? 'Todos' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grilla del catálogo con contenedor animado */}
      <div 
        className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 transition-all duration-300 ease-in-out ${
          animate ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'
        }`}
      >
        {visibleGames.map(game => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>

      {visibleGames.length === 0 && (
        <p className="text-center text-slate-500 mt-12">No hay videojuegos disponibles en esta categoría.</p>
      )}
    </div>
  );
}