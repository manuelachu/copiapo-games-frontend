import { createContext, useState } from 'react';

export const GameContext = createContext();

export function GameProvider({ children }) {
  // 1. Estado de Autenticación (con persistencia básica en localStorage)
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // 2. Estado del Catálogo de Videojuegos (Actualizado con sellerEmail para las pruebas)
  const [games, setGames] = useState([
    { id: '1', title: 'God of War Ragnarök', price: 49990, category: 'playstation', sellerEmail: 'admin@copiapogames.cl', image: 'https://via.placeholder.com/300x400', description: 'Épica aventura nórdica.' },
    { id: '2', title: 'Halo Infinite', price: 39990, category: 'xbox', sellerEmail: 'user@gmail.com', image: 'https://via.placeholder.com/300x400', description: 'El regreso del Jefe Maestro.' },
    { id: '3', title: 'Zelda: Tears of the Kingdom', price: 59990, category: 'nintendo', sellerEmail: 'admin@copiapogames.cl', image: 'https://via.placeholder.com/300x400', description: 'Explora los cielos de Hyrule.' },
    { id: '4', title: 'Spider-Man 2', price: 54990, category: 'playstation', sellerEmail: 'user@gmail.com', image: 'https://via.placeholder.com/300x400', description: 'Dos Spider-Man, una gran amenaza.' }
  ]);

  // 3. Estado del Carrito de Compras
  const [cart, setCart] = useState([]);

  // 4. Estado del Filtro Global (Usado en Home y Footer)
  const [filter, setFilter] = useState('all');

  // Funciones de Autenticación
  const login = (email, password) => {
    const mockUser = { email, token: 'fake-jwt-token' };
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setCart([]);
  };

  // Funciones del Carrito
  const addToCart = (game) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === game.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === game.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...game, quantity: 1 }];
    });
  };

  // AJUSTE: Ahora vincula el juego creado al email del usuario activo
  const createPost = (newGame) => {
    setGames((prevGames) => [
      ...prevGames,
      { 
        ...newGame, 
        id: Date.now().toString(),
        sellerEmail: user ? user.email : 'anonimo@copiapogames.cl' 
      }
    ]);
  };

  // NUEVA: Función para borrar juegos desde el panel de perfil
  const deleteGame = (gameId) => {
    setGames((prevGames) => prevGames.filter((game) => game.id !== gameId));
  };

  // Cálculo dinámico de totalItems para el Navbar
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <GameContext.Provider value={{
      user,
      login,
      logout,
      games,
      setGames,
      createPost,
      deleteGame, // Agregado al proveedor para que Profile.jsx pueda usarlo
      cart,
      setCart,
      addToCart,
      totalItems,
      filter,
      setFilter
    }}>
      {children}
    </GameContext.Provider>
  );
}