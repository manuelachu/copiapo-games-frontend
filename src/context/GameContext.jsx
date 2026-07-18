import { createContext, useState, useEffect } from 'react';

export const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [games, setGames] = useState([]);
  const [user, setUser] = useState(null); 
  const [cart, setCart] = useState([]); 

  useEffect(() => {
    const cargarJuegos = async () => {
      try {
        const response = await fetch('https://copiapo-games-backend.onrender.com/api/games');
        if (response.ok) {
          const data = await response.json();
          setGames(data);
        }
      } catch (error) {
        console.error("Error al conectar con la API de juegos:", error);
      }
    };
    cargarJuegos();
  }, []);

  const loginUser = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    setCart([]); // Limpia el carrito al cerrar sesión
  };

  // 🛒 Lógica avanzada para agregar al carrito respetando el stock
  const addToCart = (game) => {
    setCart((prevCart) => {
      const existingGame = prevCart.find((item) => item.id === game.id);
      
      if (existingGame) {
        if (existingGame.quantity >= (game.stock ?? 0)) {
          alert(`¡Límite alcanzado! Solo quedan ${game.stock} unidades de ${game.titulo || game.title || 'este juego'}.`);
          return prevCart;
        }
        return prevCart.map((item) =>
          item.id === game.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      
      if ((game.stock ?? 0) <= 0) {
        alert("¡Lo sentimos! Este juego no cuenta con stock disponible.");
        return prevCart;
      }
      
      return [...prevCart, { ...game, quantity: 1 }];
    });
  };

  // ➖ Restar cantidad o eliminar si llega a 0
  const removeFromCart = (gameId) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => (item.id === gameId ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  // 🗑️ Eliminar un juego completo del carrito
  const deleteFromCart = (gameId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== gameId));
  };

  const clearCart = () => setCart([]);

  // 💰 Cálculos automáticos para la interfaz
  const totalAmount = cart.reduce((acc, item) => acc + Number(item.price || item.precio || 0) * item.quantity, 0);
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <GameContext.Provider value={{ 
      games, user, cart, login: loginUser, logout, 
      addToCart, removeFromCart, deleteFromCart, clearCart,
      totalAmount, totalItems, setGames 
    }}>
      {children}
    </GameContext.Provider>
  );
};