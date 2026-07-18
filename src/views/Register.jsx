import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
     const response = await fetch('https://copiapo-games-backend.onrender.com/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        alert("¡Usuario registrado con éxito en PostgreSQL!");
        navigate('/login');
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error en el registro:", error);
      alert("No se pudo conectar con el servidor.");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 p-8 rounded-xl w-full max-w-md shadow-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">Crear Nueva Cuenta</h2>
        
        <div className="mb-4">
          <label className="block text-slate-400 text-sm mb-1">Correo Electrónico</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded px-4 py-2 text-white focus:outline-none focus:border-blue-500"
            placeholder="tu_correo@ejemplo.com"
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

        <button type="submit" className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-2.5 rounded transition-colors shadow-lg">
          Registrarse
        </button>
      </form>
    </div>
  );
}