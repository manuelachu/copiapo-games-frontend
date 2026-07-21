import { createContext, useState, useEffect } from 'react';

export const GameContext = createContext();

const API_URL = 'https://copiapo-games-backend.onrender.com';

export function GameProvider({ children }) {
  // 1. Estado de Autenticación persistente
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) return null;
    try {
      const parsed = JSON.parse(savedUser);
      return {
        ...parsed,
        id: parsed.id ? Number(parsed.id) : null
      };
    } catch (e) {
      return null;
    }
  });

  const [games, setGames] = useState([]);
  const [cart, setCart] = useState([]);
  const [filter, setFilter] = useState('all');

  // TRAER JUEGOS
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch(`${API_URL}/api/games`);
        if (response.ok) {
          const data = await response.json();
          setGames(data);
        }
      } catch (error) {
        console.error("Error cargando juegos:", error);
      }
    };
    fetchGames();
  }, []);

  // INICIAR SESIÓN
  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        const loggedUser = { 
          id: data.user?.id ? Number(data.user.id) : null,
          email: data.user?.email || email, 
          token: data.token,
          rol: data.user?.rol || 'user'
        };
        
        setUser(loggedUser);
        localStorage.setItem('user', JSON.stringify(loggedUser));
        localStorage.setItem('token', data.token);
        localStorage.setItem('rol', loggedUser.rol);
        
        return { success: true };
      } else {
        return { success: false, message: data.error || data.message || "Credenciales incorrectas" };
      }
    } catch (error) {
      console.error("Error en el login:", error);
      return { success: false, message: "Error al conectar con el servidor" };
    }
  };

  // CERRAR SESIÓN
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    setCart([]);
  };

  // CARRITO
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

  // CREAR JUEGO
  const createPost = async (newGame) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/games`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({
          ...newGame,
          usuario_id: user?.id,
          sellerEmail: user?.email
        })
      });

      if (response.ok) {
        const createdGame = await response.json();
        setGames((prevGames) => [...prevGames, createdGame]);
      }
    } catch (error) {
      console.error("Error creando juego:", error);
    }
  };

  // ELIMINAR JUEGO (Conectado al Backend)
  const deleteGame = async (gameId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/games/${gameId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });

      if (response.ok || response.status === 204) {
        // Actualizamos el estado en React eliminando el juego de la lista en tiempo real
        setGames((prevGames) => prevGames.filter((game) => Number(game.id) !== Number(gameId)));
      } else {
        console.error("No se pudo eliminar el juego en el servidor");
      }
    } catch (error) {
      console.error("Error al eliminar el juego:", error);
    }
  };

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