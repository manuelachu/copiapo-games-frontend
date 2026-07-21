import { createContext, useState, useEffect } from 'react';

export const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [games, setGames] = useState([]);

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
        // Guardar en localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('userEmail', data.user.email);
        localStorage.setItem('rol', data.user.rol || data.user.role || 'user');
        if (data.user.id) localStorage.setItem('userId', data.user.id);

        // Actualizar el estado global
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

  // 🚪 Función de LOGOUT (Cerrar Sesión)
  const logout = () => {
    // Limpiamos la caché del navegador
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('rol');
    localStorage.removeItem('userId');

    // Limpiamos el estado del usuario
    setUser(null);
  };

  // 🗑️ Función para ELIMINAR un juego
  const deleteGame = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Debes iniciar sesión para realizar esta acción.');
        return false;
      }

      const response = await fetch(`https://copiapo-games-backend.onrender.com/api/games/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setGames(prevGames => prevGames.filter(game => Number(game.id) !== Number(id)));
        return true;
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Respuesta de error del backend:', response.status, errorData);
        
        const mensaje = errorData.message || errorData.error || errorData.mensaje || `Error del servidor (Código ${response.status})`;
        alert(`Error al eliminar: ${mensaje}`);
        return false;
      }
    } catch (error) {
      console.error('Error en la petición de borrado:', error);
      alert('Error de conexión al servidor al intentar eliminar.');
      return false;
    }
  };

  return (
    <GameContext.Provider value={{ 
      user, 
      setUser, 
      games, 
      setGames, 
      login, 
      logout, 
      logoutUser: logout, // Alias por si tu Navbar/Header usa logoutUser en vez de logout
      deleteGame, 
      fetchGames 
    }}>
      {children}
    </GameContext.Provider>
  );
};