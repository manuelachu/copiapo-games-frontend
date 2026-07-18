import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { GameContext, GameProvider } from './context/GameContext';

// Importación del componente global Navbar
import Navbar from './components/Navbar';

// Importación del componente global Footer
import Footer from './components/Footer';

// Importación de las Vistas desde la carpeta views
import Home from './views/Home';
import Login from './views/Login';
import Register from './views/Register';
import Profile from './views/Profile';
import CreatePost from './views/CreatePost';
import GameDetail from './views/GameDetail';
import Carrito from './views/Carrito'; // 🚀 1. Importación de la vista del Carrito


const PrivateRoute = ({ children }) => {
  const { user } = useContext(GameContext);
  return user ? children : <Navigate to="/login" />;
};

function AppRoutes() {
  return (
    <BrowserRouter>
      
      <Navbar />
      
      <div className="flex flex-col min-h-screen bg-slate-950 text-white">
        
        <main className="flex-grow">
          <Routes>
            {/* Rutas Públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/game/:id" element={<GameDetail />} />
            <Route path="/carrito" element={<Carrito />} /> {/* 🚀 2. Nueva ruta añadida */}

            {/* Rutas Privadas */}
            <Route path="/perfil" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/publicar" element={<PrivateRoute><CreatePost /></PrivateRoute>} />
          </Routes>
        </main>

        <Footer />
        
      </div>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <GameProvider>
      <AppRoutes />
    </GameProvider>
  );
}