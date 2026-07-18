import { createContext, useState, useEffect } from 'react';

export const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [games, setGames] = useState([]);
  const [user, setUser] = useState(null); 
  const [cart, setCart] = useState([]); 

  useEffect(() => {
    const cargarJuegos = async () => {
      try {
        // Cambiado a la URL de Render:
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
    setUser(userData); // Guarda { email, token, rol }
  };

  const logout = () => {
    setUser(null);
  };

  const addToCart = (game) => setCart([...cart, game]);

  return (
    <GameContext.Provider value={{ games, user, cart, login: loginUser, logout, addToCart, setGames }}>
      {children}
    </GameContext.Provider>
  );
};