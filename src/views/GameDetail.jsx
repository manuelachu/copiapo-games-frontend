import React, { useContext, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GameContext } from '../context/GameContext';

export default function GameDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { games, setGames, addToCart, user } = useContext(GameContext);
  const [addedToCart, setAddedToCart] = useState(false);

  
  const game = games ? games.find((g) => String(g.id || g.id_juego) === String(id)) : null;

  if (!game) {
    return (
      <div className="p-8 max-w-4xl mx-auto min-h-[60vh] flex flex-col items-center justify-center text-white">
        <p className="text-xl font-semibold mb-4 text-slate-300">Cargando o videojuego no encontrado...</p>
        <button 
          onClick={() => navigate('/')} 
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded-lg transition-colors cursor-pointer"
        >
          Volver al catálogo
        </button>
      </div>
    );
  }

  
  const titulo = game.title || game.titulo || "Videojuego sin título";
  const imagen = game.image || game.imagen || "https://via.placeholder.com/300";
  const categoria = game.category || game.consola || "General";
  const descripcion = game.description || game.descripcion || "Disfruta de esta entrega disponible en Copiapó Games Store.";
  const precio = Number(game.price || game.precio || 0);
  const stockReal = game.stock ?? 0;

  
  const creador = (game.cargado_por || "usuario").toLowerCase();
  const esAdmin = creador === 'usuario administrador';

  const currentUserId = user?.id || user?.usuario_id || user?.id_usuario;
  const gameOwnerId = game.usuario_id || game.userId || game.usuarioId;
  const isOwner = !esAdmin && currentUserId && String(gameOwnerId) === String(currentUserId);

  
  const handleAddToCart = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (typeof addToCart === 'function') {
      addToCart(game);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  
  const handleMarkAsSold = async () => {
    const confirmar = window.confirm("¿Confirmas que vendiste este juego? Se eliminará del catálogo permanentemente.");
    if (!confirmar) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://copiapo-games-backend.onrender.com/api/games/${game.id || game.id_juego}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert("¡Felicitaciones por tu venta! El juego ha sido removido.");
        if (setGames) {
          setGames(games.filter(g => String(g.id || g.id_juego) !== String(game.id || game.id_juego)));
        }
        navigate('/');
      } else {
        alert("No se pudo eliminar el juego.");
      }
    } catch (error) {
      console.error(error);
      alert("Error al intentar eliminar la publicación.");
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto min-h-[70vh] text-white flex flex-col justify-center">
      
      <button 
        onClick={() => navigate('/')} 
        className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors font-medium text-sm w-fit cursor-pointer"
      >
        ← Volver al catálogo
      </button>

      <div className="grid md:grid-cols-2 gap-8 items-center">
        <img src={imagen} alt={titulo} className="rounded-xl w-full h-80 object-cover border border-slate-800 shadow-2xl" />
        
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span className="text-xs font-bold uppercase text-blue-400 bg-blue-950 px-3 py-1 rounded-full">
              {categoria}
            </span>
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${stockReal > 0 ? 'text-emerald-400 bg-emerald-950' : 'text-red-400 bg-red-950'}`}>
              Stock: {stockReal} u.
            </span>

            
            <span className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 ${
              esAdmin ? 'text-red-400 bg-red-950/80 border border-red-800/50' : 'text-amber-400 bg-amber-950/80 border border-amber-800/50'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${esAdmin ? 'bg-red-400' : 'bg-amber-400'}`}></span>
              {esAdmin ? 'Usuario Administrador' : `Vendedor: ${game.nombre_contacto || 'Usuario Comunidad'}`}
            </span>
          </div>
          
          <h1 className="text-4xl font-extrabold mt-3 mb-2">{titulo}</h1>
          <p className="text-3xl text-emerald-400 font-bold mb-4">${precio.toLocaleString('es-CL')}</p>
          <p className="text-slate-400 leading-relaxed mb-6">{descripcion}</p>
          
          
          {esAdmin ? (
            <button 
              onClick={handleAddToCart}
              disabled={(user && stockReal <= 0) || addedToCart}
              className={`w-full md:w-auto font-bold px-8 py-3 rounded-lg shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer ${
                !user 
                  ? 'bg-blue-600 hover:bg-blue-500 text-white' 
                  : addedToCart 
                    ? 'bg-emerald-600 text-white' 
                    : stockReal > 0 
                      ? 'bg-blue-600 hover:bg-blue-500 text-white' 
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              {!user 
                ? 'Inicia sesión para comprar' 
                : addedToCart 
                  ? '🛒 ¡Añadido al carrito!' 
                  : stockReal > 0 
                    ? '🛒 Añadir al Carrito' 
                    : 'Agotado'
              }
            </button>
          ) : (
           
            <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">👤 Datos de Contacto Directo:</h3>
              <p className="text-sm">Nombre: <span className="text-white font-medium">{game.nombre_contacto || 'Usuario Registrado'}</span></p>
              
              <div className="flex flex-col gap-2 text-sm pt-1">
                {game.facebook && (
                  <a href={`https://facebook.com/${game.facebook}`} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline flex items-center gap-2">
                    🔹 Facebook: <span className="text-slate-300 font-mono text-xs">{game.facebook}</span>
                  </a>
                )}
                {game.instagram && (
                  <a href={`https://instagram.com/${game.instagram.replace('@','')}`} target="_blank" rel="noreferrer" className="text-pink-400 hover:underline flex items-center gap-2">
                    🔸 Instagram: <span className="text-slate-300 font-mono text-xs">{game.instagram}</span>
                  </a>
                )}
              </div>

              {isOwner ? (
                <button 
                  onClick={handleMarkAsSold}
                  className="w-full mt-4 bg-rose-600 hover:bg-rose-500 text-white font-bold py-2.5 px-4 rounded-lg text-sm transition-colors shadow-lg cursor-pointer"
                >
                  🤝 ¡Ya lo vendí! (Borrar publicación)
                </button>
              ) : (
                <p className="text-xs text-slate-500 italic mt-3 border-t border-slate-800/60 pt-2">
                  * Este juego es de un vendedor externo. Coordina el pago y entrega contactándolo directamente en sus redes.
                </p>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}