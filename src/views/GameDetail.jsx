import { useParams, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { GameContext } from '../context/GameContext';

export default function GameDetail() {
  const { id } = useParams();
  const { games, addToCart, user } = useContext(GameContext);
  const navigate = useNavigate();

  
  const game = games.find(g => String(g.id) === String(id));

  if (!game) {
    return <p className="text-center text-white py-12">Videojuego no encontrado.</p>;
  }

  
  const titulo = game.title || game.titulo || "Videojuego sin título";
  const imagen = game.image || game.imagen || "https://via.placeholder.com/150";
  const categoria = game.category || game.consola || "General";
  const descripcion = game.description || game.descripcion || "Disfruta de esta entrega oficial disponible en Copiapó Games Store. El juego cuenta con garantía física y digital, listo para despacho inmediato.";
  const precio = Number(game.price || game.precio || 0);

  const handlePurchase = () => {
    if (!user) {
      navigate('/login');
    } else {
      
      const juegoParaCarrito = {
        id: game.id,
        title: titulo,
        price: precio,
        image: imagen,
        category: categoria
      };
      addToCart(juegoParaCarrito);
      alert(`¡${titulo} agregado al carrito!`);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto grid md:grid-cols-2 gap-8 items-center min-h-[70vh] text-white">
      <img src={imagen} alt={titulo} className="rounded-xl w-full h-80 object-cover border border-slate-800 shadow-2xl" />
      <div>
        <span className="text-xs font-bold uppercase text-blue-400 bg-blue-950 px-3 py-1 rounded-full">{categoria}</span>
        <h1 className="text-4xl font-extrabold mt-3 mb-2">{titulo}</h1>
        <p className="text-3xl text-emerald-400 font-bold mb-4">${precio.toLocaleString('es-CL')}</p>
        <p className="text-slate-400 leading-relaxed mb-6">
          {descripcion}
        </p>
        <button 
          onClick={handlePurchase}
          className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 py-3 rounded-lg shadow-lg transition-colors"
        >
          {user ? 'Añadir al Carrito' : 'Inicia sesión para comprar'}
        </button>
      </div>
    </div>
  );
}