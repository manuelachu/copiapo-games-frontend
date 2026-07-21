import { useState, useContext } from 'react';
import { GameContext } from '../context/GameContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(GameContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Llamamos directamente a la función login del contexto
    const result = await login(email, password);

    if (result.success) {
      alert("¡Ingreso exitoso!");
      navigate('/');
    } else {
      alert(`Error: ${result.message}`);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 p-8 rounded-xl w-full max-w-md shadow-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">Ingresar a tu Cuenta</h2>
        
        <div className="mb-4">
          <label className="block text-slate-400 text-sm mb-1">Correo Electrónico</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded px-4 py-2 text-white focus:outline-none focus:border-blue-500"
            placeholder="ejemplo@correo.com"
            required 
          />
        </div>

        <div className="mb-6">
          <label className="block text-slate-400 text-sm mb-1">Contraseña</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded px-4 py-2 text-white focus:outline-none focus:border-blue-500"
            placeholder="********"
            required 
          />
        </div>

        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded transition-colors shadow-lg">
          Iniciar Sesión
        </button>
      </form>
    </div>
  );
}