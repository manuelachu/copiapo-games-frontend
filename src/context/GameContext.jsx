import { createContext, useState, useEffect } from 'react';

export const GameContext = createContext();

// URL de tu backend en Render
const API_URL = 'https://copiapo-games-backend.onrender.com';

export function GameProvider({ children }) {
  // 1. Estado de Autenticación (con persistencia básica en localStorage)
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // 2. Estado del Catálogo de Videojuegos (Inicia vacío y se llena desde PostgreSQL)
  const [games, setGames] = useState([]);

  // 3. Estado del Carrito de Compras
  const [cart, setCart] = useState([]);

  // 4. Estado del Filtro Global
  const [filter, setFilter] = useState('all');

  // TRAER JUEGOS: Carga los videojuegos desde la BD al inicializar la página
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch(`${API_URL}/api/games`); // 👈 Corregido con /api/games
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

  // INICIAR SESIÓN: Conectado al endpoint de autenticación del backend
  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, { // 👈 Corregido con /api/auth/login
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const data = await response.json();
        // Guardamos el email y el token enviado por tu backend
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

  // CERRAR SESIÓN
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setCart([]);
  };

  // FUNCIONES DEL CARRITO
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

  // CREAR JUEGO: Guarda el nuevo juego en PostgreSQL a través del backend
  const createPost = async (newGame) => {
    try {
      const gameData = {
        ...newGame,
        sellerEmail: user ? user.email : 'anonimo@copiapogames.cl'
      };

      const response = await fetch(`${API_URL}/api/games`, { // 👈 Corregido con /api/games
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gameData)
      });

      if (response.ok) {
        const createdGame = await response.json();
        // Agrega el juego retornado por la BD al estado para actualizar la UI
        setGames((prevGames) => [...prevGames, createdGame]);
      }
    } catch (error) {
      console.error("Error al crear el juego en la BD:", error);
    }
  };

  // ELIMINAR JUEGO: Borra el juego usando el id
  const deleteGame = async (gameId) => {
    try {
      const response = await fetch(`${API_URL}/api/games/${gameId}`, { // 👈 Corregido con /api/games/:id
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