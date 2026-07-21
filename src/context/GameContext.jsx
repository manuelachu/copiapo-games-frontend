import { createContext, useState, useEffect } from 'react';

export const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [games, setGames] = useState([]);
  const [cart, setCart] = useState([]);
  
  const [filter, setFilter] = useState('all');

  const fetchGames = async () => {
    try {
      const response = await fetch('https://copiapo-games-backend.onrender.com/api/games');
      if (response.ok) {
        const data = await response.json();
        setGames(data);
      }
    } catch (error) {
      console.error('Error al cargar juegos:', error);
    }
  };

  useEffect(() => {
    fetchGames();

    const savedEmail = localStorage.getItem('userEmail');
    const savedRol = localStorage.getItem('rol');
    const savedUserId = localStorage.getItem('userId');

    if (savedEmail) {
      setUser({
        email: savedEmail,
        rol: savedRol || 'user',
        id: savedUserId ? Number(savedUserId) : null
      });
    }
  }, []);

 
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => String(item.id || item.id_juego) === String(product.id || product.id_juego));
      if (existingItem) {
        return prevCart.map((item) =>
          String(item.id || item.id_juego) === String(product.id || product.id_juego)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          String(item.id || item.id_juego) === String(id) ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const deleteFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => String(item.id || item.id_juego) !== String(id)));
  };

  const clearCart = () => setCart([]);

  const totalAmount = cart.reduce((acc, item) => acc + Number(item.price || item.precio || 0) * item.quantity, 0);
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const login = async (email, password) => {
    try {
      const response = await fetch('https://copiapo-games-backend.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userEmail', data.user.email);
        localStorage.setItem('rol', data.user.rol || data.user.role || 'user');
        if (data.user.id) localStorage.setItem('userId', data.user.id);

        setUser({
          email: data.user.email,
          rol: data.user.rol || data.user.role || 'user',
          id: data.user.id ? Number(data.user.id) : null
        });

        return { success: true };
      } else {
        return { success: false, message: data.message || data.error || 'Credenciales inválidas' };
      }
    } catch (error) {
      console.error('Error en el login:', error);
      return { success: false, message: 'Error de conexión con el servidor.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('rol');
    localStorage.removeItem('userId');
    setUser(null);
  };

  return (
    <GameContext.Provider
      value={{
        user,
        setUser,
        games,
        setGames,
        cart,
        addToCart,
        removeFromCart,
        deleteFromCart,
        clearCart,
        totalAmount,
        totalItems,
        filter,
        setFilter,
        login,
        logout,
        logoutUser: logout,
        fetchGames
      }}
    >
      {children}
    </GameContext.Provider>
  );
};