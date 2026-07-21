import React, { useContext, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GameContext } from '../context/GameContext';

export default function GameDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { games, setGames, addToCart, user } = useContext(GameContext);

  const [addedToCart, setAddedToCart] = useState(false);

  // Buscar el juego por ID (asegurando comparación por String o Number)
  const game = games ? games.find((g) => String(g.id || g.id_juego) === String(id)) : null;

  if (!game) {
    return (
      <div className="p-8 max-w-4xl mx-auto min-h-[60vh] flex flex-col items-center justify-center text-white">
        <p className="text-xl font-semibold mb-4 text-slate-300">Videojuego no encontrado o cargando...</p>
        <button 
          onClick={() => navigate('/')} 
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded-lg transition-colors"
        >
          Volver al catálogo
        </button>
      </div>
    );
  }

  // Mapeo seguro de propiedades
  const titulo = game.title || game.titulo || "Videojuego sin título";
  const imagen = game.image || game.imagen || "https://via.placeholder.com/300";
  const categoria = game.category || game.consola || game.categoria || "General";
  const descripcion = game.description || game.descripcion || "Disfruta de esta entrega oficial disponible en Copiapó Games Store.";
  const precio = Number(game.price || game.precio || 0);
  const stockReal = game.stock ?? 0; 

  const uploaderRole = game.role || game.user_role || game.cargado_por || 'admin';
  const isCustomUser = uploaderRole.toLowerCase().includes('usuario') || uploaderRole.toLowerCase() === 'user';

  const currentUserId = user?.id || user?.usuario_id || user?.id_usuario;
  const gameOwnerId = game.usuario_id || game.userId || game.usuarioId;

  const isOwner = isCustomUser && currentUserId && String(gameOwnerId) === String(currentUserId);

  const handleMarkAsSold = async () => {
    const confirmar = window.confirm("¿Confirmas que vendiste este juego? Se eliminará de la tienda permanentemente.");
    if (!confirmar) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://copiapo-games-backend.onrender.com/api/games/${game.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert("¡Felicitaciones por tu venta! El juego ha sido removido del catálogo.");
        if (setGames) {
          setGames(games.filter(g => String(g.id || g.id_juego) !== String(game.id)));
        }
        navigate('/');
      } else {
        alert("No se pudo eliminar el juego. Verifica tus permisos en el servidor.");
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión al intentar remover el artículo.");
    }
  };

  const handlePurchase = () => {
    if (!user) {
      navigate('/login');
    } else {
      const juegoParaCarrito = { id: game.id, title: titulo, price: precio, image: imagen, category: categoria, stock: stockReal };
      if (typeof addToCart === 'function') {
        addToCart(juegoParaCarrito);
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000);
      }
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto min-h-[70vh] text-white flex flex-col justify-center">
      
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors duration-200 group font-medium text-sm w-fit"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 transition-transform group-hover:-translate-x-1">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
        Volver al catálogo
      </button>

      <div className="grid md:grid-cols-2 gap-8 items-center">
        <img src={imagen} alt={titulo} className="rounded-xl w-full h-80 object-cover border border-slate-800 shadow-2xl" />
        
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span className="text-xs font-bold uppercase text-blue-400 bg-blue-950 px-3 py-1 rounded-full">{categoria}</span>
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${stockReal > 0 ? 'text-emerald-400 bg-emerald-950' : 'text-red-400 bg-red-950'}`}>Stock: {stockReal} u.</span>

            <span className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 ${isCustomUser ? 'text-amber-400 bg-amber-950' : 'text-purple-400 bg-purple-950'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isCustomUser ? 'bg-amber-400' : 'bg-purple-400'}`}></span>
              Vendido por: {isCustomUser ? 'Usuario de la Comunidad' : 'Administrador'}
            </span>
          </div>
          
          <h1 className="text-4xl font-extrabold mt-3 mb-2">{titulo}</h1>
          <p className="text-3xl text-emerald-400 font-bold mb-4">${precio.toLocaleString('es-CL')}</p>
          <p className="text-slate-400 leading-relaxed mb-6">{descripcion}</p>
          
          {isCustomUser ? (
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
                  className="w-full mt-4 bg-rose-600 hover:bg-rose-500 text-white font-bold py-2.5 px-4 rounded-lg text-sm transition-colors shadow-lg active:scale-95"
                >
                  🤝 ¡Ya lo vendí! (Borrar publicación)
                </button>
              ) : (
                <p className="text-xs text-slate-500 italic mt-3 border-t border-slate-800/60 pt-2">
                  * Este juego es de un vendedor externo. Coordina el pago y entrega contactándolo en sus redes.
                </p>
              )}
            </div>
          ) : (
            <button 
              onClick={handlePurchase}
              disabled={(user && stockReal <= 0) || addedToCart}
              className={`w-full md:w-auto font-bold px-8 py-3 rounded-lg shadow-lg transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2 ${
                !user ? 'bg-blue-600 hover:bg-blue-500 text-white' : addedToCart ? 'bg-teal-600 text-white border border-teal-500' : stockReal > 0 ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              {addedToCart && (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5 animate-bounce"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
              )}
              {!user ? 'Inicia sesión para comprar' : addedToCart ? '¡Se añadió a su carrito de compras!' : stockReal > 0 ? 'Añadir al Carrito' : 'Agotado / Sin Stock'}
            </button>
          )}

        </div>
      </div>
    </div>
  );
}