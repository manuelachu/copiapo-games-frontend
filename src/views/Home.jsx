import { useContext, useState, useEffect } from 'react';
import { GameContext } from '../context/GameContext';
import GameCard from '../components/GameCard';

export default function Home() {
  // Extraemos filter y setFilter directamente del contexto global
  const { games, filter, setFilter } = useContext(GameContext);
  const [visibleGames, setVisibleGames] = useState([]);
  const [animate, setAnimate] = useState(false);

  // Filtrar los videojuegos según la selección global
  const filteredGames = filter === 'all' 
    ? games 
    : games.filter(g => {
        const categoriaJuego = (g.category || g.consola || "").toLowerCase();
        return categoriaJuego === filter.toLowerCase();
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
      
      {/* Encabezado Principal y Filtros */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Catálogo de Videojuegos</h1>
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
              className={`px-4 py-1.5 rounded text-sm font-medium capitalize transition-all duration-200 ${
                filter === cat 
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