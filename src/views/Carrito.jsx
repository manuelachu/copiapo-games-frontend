import { useContext } from 'react';
import { GameContext } from '../context/GameContext';
import { Link } from 'react-router-dom';

export default function Carrito() {
  const { cart, addToCart, removeFromCart, deleteFromCart, totalAmount, clearCart } = useContext(GameContext);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-blue-500">🛒 Tu Carrito de Compras</h2>

        {cart.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-8 text-center">
            <p className="text-slate-400 text-lg mb-4">Tu carrito está vacío.</p>
            <Link to="/" className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded transition-colors">
              Volver al Catálogo
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Lista de productos */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => {
                const titulo = item.title || item.titulo || "Videojuego";
                const imagen = item.image || item.imagen || "https://via.placeholder.com/150";
                const precio = Number(item.price || item.precio || 0);

                return (
                  <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <img src={imagen} alt={titulo} className="w-16 h-16 object-cover rounded" />
                      <div>
                        <h4 className="font-bold text-white text-base sm:text-lg line-clamp-1">{titulo}</h4>
                        <p className="text-slate-400 text-xs">Stock Max: {item.stock} u.</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between w-full sm:w-auto gap-6">
                      {/* Controles de Cantidad */}
                      <div className="flex items-center bg-slate-950 border border-slate-800 rounded">
                        <button onClick={() => removeFromCart(item.id)} className="px-3 py-1 text-red-400 hover:bg-slate-900 font-bold">-</button>
                        <span className="px-4 font-bold text-sm">{item.quantity}</span>
                        <button onClick={() => addToCart(item)} className="px-3 py-1 text-emerald-400 hover:bg-slate-900 font-bold">+</button>
                      </div>

                      {/* Subtotal */}
                      <div className="text-right min-w-[80px]">
                        <p className="text-emerald-400 font-semibold text-sm">
                          ${(precio * item.quantity).toLocaleString('es-CL')}
                        </p>
                      </div>

                      {/* Eliminar fila */}
                      <button onClick={() => deleteFromCart(item.id)} className="text-slate-500 hover:text-red-500 text-sm transition-colors">
                        🗑️
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Resumen Comercial */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 h-fit sticky top-6">
              <h3 className="text-xl font-bold border-b border-slate-800 pb-3 text-slate-200">Resumen del Pedido</h3>
              <div className="flex justify-between items-center mt-4">
                <span className="text-slate-400">Total artículos:</span>
                <span className="font-bold">{cart.reduce((acc, i) => acc + i.quantity, 0)} u.</span>
              </div>
              <div className="flex justify-between items-center mt-3 mb-6 border-t border-dashed border-slate-800 pt-4">
                <span className="text-lg font-bold text-white">Total a pagar:</span>
                <span className="text-2xl font-bold text-emerald-400">${totalAmount.toLocaleString('es-CL')}</span>
              </div>
              
              <button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded transition-colors text-sm shadow-md mb-2">
                Proceder al Pago
              </button>
              <button onClick={clearCart} className="w-full text-center text-xs text-slate-500 hover:text-slate-400 underline transition-colors">
                Vaciar Carrito
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}