import { useParams, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { GameContext } from '../context/GameContext';

export default function GameDetail() {
  const { id } = useParams();
  const { games, addToCart, user } = useContext(GameContext);
  const navigate = useNavigate();

  // Estado local para controlar el mensaje de éxito del carrito
  const [addedToCart, setAddedToCart] = useState(false);

  const game = games.find(g => String(g.id) === String(id));

  if (!game) {
    return <p className="text-center text-white py-12">Videojuego no encontrado.</p>;
  }

  const titulo = game.title || game.titulo || "Videojuego sin título";
  const imagen = game.image || game.imagen || "https://via.placeholder.com/150";
  const categoria = game.category || game.consola || "General";
  const descripcion = game.description || game.descripcion || "Disfruta de esta entrega oficial disponible en Copiapó Games Store. El juego cuenta con garantía física y digital, listo para despacho inmediato.";
  const precio = Number(game.price || game.precio || 0);
  const stockReal = game.stock ?? 0; 

  // Determinar quién subió el juego
  const uploaderRole = game.role || game.user_role || game.created_by || 'admin';
  const isCustomUser = uploaderRole.toLowerCase() === 'user' || uploaderRole.toLowerCase() === 'usuario';

  const handlePurchase = () => {
    if (!user) {
      navigate('/login');
    } else {
      const juegoParaCarrito = {
        id: game.id,
        title: titulo,
        price: precio,
        image: imagen,
        category: categoria,
        stock: stockReal 
      };
      
      addToCart(juegoParaCarrito);

      // Mostrar mensaje de éxito temporal
      setAddedToCart(true);
      setTimeout(() => {
        setAddedToCart(false);
      }, 2000); // Vuelve a su estado normal después de 2 segundos
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto min-h-[70vh] text-white flex flex-col justify-center">
      
      {/* Botón de Volver Atrás */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors duration-200 group font-medium text-sm w-fit"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
          className="w-4 h-4 transition-transform group-hover:-translate-x-1"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
        Volver al catálogo
      </button>

      {/* Grid del detalle del juego */}
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

            {/* Badge de Administrador / Usuario */}
            <span className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 ${
              isCustomUser
                ? 'text-amber-400 bg-amber-950'
                : 'text-purple-400 bg-purple-950'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isCustomUser ? 'bg-amber-400' : 'bg-purple-400'}`}></span>
              Subido por: {isCustomUser ? 'Usuario' : 'Administrador'}
            </span>
          </div>
          
          <h1 className="text-4xl font-extrabold mt-3 mb-2">{titulo}</h1>
          <p className="text-3xl text-emerald-400 font-bold mb-4">${precio.toLocaleString('es-CL')}</p>
          <p className="text-slate-400 leading-relaxed mb-6">
            {descripcion}
          </p>
          
          <button 
            onClick={handlePurchase}
            disabled={(user && stockReal <= 0) || addedToCart}
            className={`w-full md:w-auto font-bold px-8 py-3 rounded-lg shadow-lg transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2 ${
              !user 
                ? 'bg-blue-600 hover:bg-blue-500 text-white' 
                : addedToCart
                  ? 'bg-teal-600 text-white border border-teal-500 scale-102 shadow-teal-900/40' 
                  : stockReal > 0 
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white' 
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            {/* Ícono de check animado si ya se guardó */}
            {addedToCart && (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5 animate-bounce">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            )}

            {!user 
              ? 'Inicia sesión para comprar' 
              : addedToCart
                ? '¡Se añadió a su carrito de compras!' 
                : stockReal > 0 
                  ? 'Añadir al Carrito' 
                  : 'Agotado / Sin Stock'}
          </button>
        </div>
      </div>
    </div>
  );
}