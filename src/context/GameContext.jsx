import { createContext, useState, useEffect } from 'react';

export const GameContext = createContext();

// Reemplaza esto con la URL real de tu backend en Render si es distinta
const API_URL = 'https://copiapo-games-backend.onrender.com';

export function GameProvider({ children }) {
  // 1. Estado de Autenticación
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // 2. Estado del Catálogo de Videojuegos (Inicia vacío y se llena desde la BD)
  const [games, setGames] = useState([]);

  // 3. Estado del Carrito de Compras
  const [cart, setCart] = useState([]);

  // 4. Estado del Filtro Global
  const [filter, setFilter] = useState('all');

  // NUEVO: Cargar los juegos desde el backend en Render cuando se abra la página
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch(`${API_URL}/games`); // Asegúrate de que el endpoint en tu backend sea /games
        if (response.ok) {
          const data = await response.json();
          setGames(data);
        } else {
          console.error("Error al obtener los juegos desde el servidor");
        }
      } catch (error) {
        console.error("Error de red conectando al backend:", error);
      }
    };

    fetchGames();
  }, []);

  // Funciones de Autenticación conectadas al backend
  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/login`, { // Asegúrate de que tu ruta de login sea /login
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const data = await response.json();
        // Guardamos el usuario real (y el token si tu backend lo devuelve)
        const loggedUser = { email, token: data.token || 'fake-jwt-token' };
        setUser(loggedUser);
        localStorage.setItem('user', JSON.stringify(loggedUser));
      } else {
        alert("Credenciales incorrectas");
      }
    } catch (error) {
      console.error("Error en el login:", error);
    }
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

  // Crear publicación guardándola en la Base de Datos
  const createPost = async (newGame) => {
    try {
      const gameData = {
        ...newGame,
        sellerEmail: user ? user.email : 'anonimo@copiapogames.cl'
      };

      const response = await fetch(`${API_URL}/games`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gameData)
      });

      if (response.ok) {
        const createdGame = await response.json();
        // Agregamos el juego retornado por la BD al estado local
        setGames((prevGames) => [...prevGames, createdGame]);
      }
    } catch (error) {
      console.error("Error al crear el juego en la BD:", error);
    }
  };

  // Borrar juego de la Base de Datos
  const deleteGame = async (gameId) => {
    try {
      const response = await fetch(`${API_URL}/games/${gameId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setGames((prevGames) => prevGames.filter((game) => game.id !== gameId));
      }
    } catch (error) {
      console.error("Error al eliminar el juego de la BD:", error);
    }
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
      deleteGame,
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