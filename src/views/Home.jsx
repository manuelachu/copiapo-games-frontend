import { useContext, useState } from 'react';
import { GameContext } from '../context/GameContext';
import GameCard from '../components/GameCard';

export default function Home() {
  const { games } = useContext(GameContext);
  const [filter, setFilter] = useState('all');

  
  const filteredGames = filter === 'all' 
    ? games 
    : games.filter(g => {
        const categoriaJuego = (g.category || g.consola || "").toLowerCase();
        return categoriaJuego === filter.toLowerCase();
      });

  return (
    <div className="p-8 max-w-7xl mx-auto">
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-extrabold text-white">Catálogo de Videojuegos</h1>
        <div className="flex gap-3 bg-slate-900 p-1.5 rounded-lg border border-slate-800">
          {['all', 'playstation', 'xbox', 'nintendo'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-1.5 rounded text-sm font-medium capitalize transition-all ${
                filter === cat ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              {cat === 'all' ? 'Todos' : cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredGames.map(game => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  );
}