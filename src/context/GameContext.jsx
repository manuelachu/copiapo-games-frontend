import { createContext, useState, useEffect } from 'react';

export const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [games, setGames] = useState([]);
  const [cart, setCart] = useState([]);
  const [filter, setFilter] = useState('Todos');

  // Cargar juegos desde la API backend
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

    // Recuperar datos de sesión si existen en localStorage
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

  // 🛒 FUNCIONES DEL CARRITO DE COMPRAS
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => String(item.id) === String(product.id));
      if (existingItem) {
        return prevCart.map((item) =>
          String(item.id) === String(product.id)
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
          String(item.id) === String(id) ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const deleteFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => String(item.id) !== String(id)));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Cálculos dinámicos del Carrito
  const totalAmount = cart.reduce((acc, item) => {
    const precio = Number(item.price || item.precio || 0);
    return acc + precio * item.quantity;
  }, 0);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  // 🔑 Función de LOGIN
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

  // 🚪 Función de LOGOUT
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('rol');
    localStorage.removeItem('userId');
    setUser(null);
  };

  // 🗑️ Eliminar Juego del Backend
  const deleteGame = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Debes iniciar sesión para realizar esta acción.');
        return false;
      }

      const url = `https://copiapo-games-backend.onrender.com/api/games/${id}`;
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setGames((prevGames) => prevGames.filter((game) => Number(game.id || game.id_juego) !== Number(id)));
        return true;
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Respuesta de error del backend:', response.status, errorData);
        alert(`Error al eliminar: Error del servidor (Código ${response.status})`);
        return false;
      }
    } catch (error) {
      console.error('Error en la petición de borrado:', error);
      alert('Error de conexión al servidor al intentar eliminar.');
      return false;
    }
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
        deleteGame,
        fetchGames
      }}
    >
      {children}
    </GameContext.Provider>
  );
};