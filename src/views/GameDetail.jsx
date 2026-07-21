import React, { useContext, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GameContext } from '../context/GameContext';

export default function GameDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { games, addToCart, user } = useContext(GameContext);
  const [addedToCart, setAddedToCart] = useState(false);

  // Buscar el juego por ID en el array global
  const game = games ? games.find((g) => String(g.id || g.id_juego) === String(id)) : null;

  if (!game) {
    return (
      <div className="p-8 max-w-4xl mx-auto min-h-[60vh] flex flex-col items-center justify-center text-white">
        <p className="text-xl font-semibold mb-4 text-slate-300">Cargando datos del juego...</p>
        <button 
          onClick={() => navigate('/')} 
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded-lg transition-colors"
        >
          Volver al catálogo
        </button>
      </div>
    );
  }

  const titulo = game.title || game.titulo || "Videojuego sin título";
  const imagen = game.image || game.imagen || "https://via.placeholder.com/300";
  const categoria = game.category || game.consola || game.categoria || "General";
  const descripcion = game.description || game.descripcion || "Disfruta de esta entrega oficial disponible en Copiapó Games Store.";
  const precio = Number(game.price || game.precio || 0);

  const handlePurchase = () => {
    if (!user) {
      navigate('/login');
    } else {
      const juegoParaCarrito = { 
        id: game.id || game.id_juego, 
        title: titulo, 
        price: precio, 
        image: imagen, 
        category: categoria 
      };
      
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
        onClick={() => navigate('/')} 
        className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors font-medium text-sm w-fit cursor-pointer"
      >
        ← Volver al catálogo
      </button>

      <div className="grid md:grid-cols-2 gap-8 items-center">
        <img src={imagen} alt={titulo} className="rounded-xl w-full h-80 object-cover border border-slate-800 shadow-2xl" />
        
        <div>
          <span className="text-xs font-bold uppercase text-blue-400 bg-blue-950 px-3 py-1 rounded-full">
            {categoria}
          </span>
          
          <h1 className="text-4xl font-extrabold mt-4 mb-2">{titulo}</h1>
          <p className="text-3xl text-emerald-400 font-bold mb-4">${precio.toLocaleString('es-CL')}</p>
          <p className="text-slate-400 leading-relaxed mb-6">{descripcion}</p>
          
          {/* BOTÓN DE CARRITO SIEMPRE DISPONIBLE */}
          <button 
            onClick={handlePurchase}
            disabled={addedToCart}
            className={`w-full md:w-auto font-bold px-8 py-3 rounded-lg shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer ${
              addedToCart 
                ? 'bg-teal-600 text-white' 
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            {!user 
              ? 'Inicia sesión para comprar' 
              : addedToCart 
                ? '¡Añadido al carrito!' 
                : 'Añadir al Carrito'
            }
          </button>

        </div>
      </div>
    </div>
  );
}