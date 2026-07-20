import { useContext } from 'react';
import { GameContext } from '../context/GameContext';

export default function Profile() {
  const { user, games, deleteGame } = useContext(GameContext);

  if (!user) {
    return (
      <div className="p-8 text-center text-slate-400">
        No has iniciado sesión.
      </div>
    );
  }

  // Filtrado adaptado a la estructura de tu Base de Datos
  const myGames = games.filter(game => {
    if (user.id && Number(game.usuario_id) === Number(user.id)) return true;
    if (user.email === 'cholo@gmail.com' && game.cargado_por === 'usuario sean usuarios') return true;
    if (user.email === 'manuel.achu.aracena@gmail.com' && game.cargado_por === 'usuario administrador') return true;
    return false;
  });

  const handleDelete = (id, titulo) => {
    const confirmDelete = window.confirm(`¿Estás seguro de que deseas eliminar "${titulo}"?`);
    if (confirmDelete && deleteGame) {
      deleteGame(id);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      {/* Cabecera del Perfil */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-6 flex flex-col sm:flex-row items-center gap-4 shadow-xl">
        <div className="bg-blue-600 h-16 w-16 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-inner uppercase">
          {user.email.charAt(0)}
        </div>
        <div className="text-center sm:text-left">
          <h1 className="text-2xl font-extrabold text-white">Panel de Mis Publicaciones</h1>
          <p className="text-sm text-slate-400 mt-0.5">Conectado como:</p>
          <span className="text-xs font-mono bg-slate-950 text-blue-400 px-2 py-1 rounded border border-slate-800 inline-block mt-1">
            {user.email}
          </span>
        </div>
      </div>

      {/* MENSAJE SOLICITADO */}
      <div className="bg-blue-950/40 border border-blue-800/60 rounded-xl p-4 mb-8 text-sm text-blue-300 flex items-start gap-3 shadow-md">
        <span className="text-base mt-0.5">ℹ️</span>
        <p>
          En esta página podrás visualizar los juegos que has subido a la plataforma y administrarlos de manera sencilla, teniendo la opción de borrarlos una vez que se hayan vendido.
        </p>
      </div>

      {/* Tabla de juegos cargados */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          📦 Mis Productos en Venta
          <span className="bg-slate-800 text-xs px-2.5 py-1 rounded-full text-slate-400">
            {myGames.length}
          </span>
        </h2>

        {myGames.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-slate-800 rounded-xl">
            <p className="text-slate-400 text-sm">No se encontraron videojuegos asociados a tu cuenta.</p>
            <p className="text-xs text-slate-600 mt-1">Si acabas de actualizar en Netlify, asegúrate de que tus datos estén sincronizándose correctamente.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                  <th className="py-3 px-4">Videojuego</th>
                  <th className="py-3 px-4 hidden sm:table-cell">Consola</th>
                  <th className="py-3 px-4">Precio</th>
                  <th className="py-3 px-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {myGames.map((game) => (
                  <tr key={game.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-4 flex items-center gap-3">
                      <img 
                        src={game.imagen || 'https://via.placeholder.com/50x60'} 
                        alt={game.titulo} 
                        className="w-10 h-12 object-cover rounded bg-slate-950 border border-slate-800"
                      />
                      <div>
                        <p className="font-semibold text-white text-sm md:text-base">{game.titulo}</p>
                        <p className="text-xs text-slate-500 sm:hidden capitalize">{game.consola}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4 hidden sm:table-cell">
                      <span className="px-2 py-0.5 text-xs font-medium rounded capitalize bg-slate-800 text-slate-300 border border-slate-700">
                        {game.consola}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-emerald-400 font-bold text-sm md:text-base">
                      ${Number(game.precio).toLocaleString('es-CL')}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => handleDelete(game.id, game.titulo)}
                        className="bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white px-3 py-1.5 rounded text-xs font-semibold transition-all duration-150 border border-red-500/30 hover:border-red-600"
                      >
                        🗑️ Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}