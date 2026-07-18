import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CreatePost() {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [imagen, setImagen] = useState('');
  const [consola, setConsola] = useState('');
  const [stock, setStock] = useState(''); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token'); 
      const userRol = localStorage.getItem('rol'); // 🔍 Leemos el rol del almacenamiento

      if (!token) {
        alert('No se detectó el token en el navegador. Por favor, cierra sesión e inicia sesión de nuevo.');
        return;
      }

      // 🎯 Determinamos la etiqueta del creador basándonos en su rol
      const cargado_por = userRol === 'admin' ? 'usuario administrador' : 'usuario sean usuarios';

      const response = await fetch('https://copiapo-games-backend.onrender.com/api/games', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          titulo, 
          descripcion, 
          precio: parseInt(precio), 
          imagen, 
          consola, 
          stock: parseInt(stock),
          cargado_por // 🚀 Enviamos la etiqueta al backend para guardarla en la tabla videojuegos
        })
      });

      if (response.ok) {
        alert('¡Videojuego publicado exitosamente!');
        navigate('/');
      } else {
        const errorData = await response.json().catch(() => ({}));
        const mensajeError = errorData.message || errorData.error || 'Rechazado por el servidor';
        alert(`Error al publicar el videojuego: ${mensajeError}`);
      }
    } catch (error) {
      console.error(error);
      alert('Hubo un problema de red al conectar con el servidor.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-8 flex justify-center items-center text-white">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 p-6 rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold text-blue-500 text-center mb-6">🎮 Publicar un Juego para Vender</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1 text-slate-300">Título del Videojuego</label>
            <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white focus:border-blue-500 outline-none" value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-slate-300">Descripción</label>
            <textarea className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white h-24 focus:border-blue-500 outline-none" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1 text-slate-300">Precio ($)</label>
              <input type="number" className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white focus:border-blue-500 outline-none" value={precio} onChange={(e) => setPrecio(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 text-slate-300">Unidades (Stock)</label>
              <input type="number" className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white focus:border-blue-500 outline-none" placeholder="Ej: 20" value={stock} onChange={(e) => setStock(e.target.value)} required min="1" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-slate-300">Consola / Plataforma</label>
            <select 
              className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white focus:border-blue-500 outline-none cursor-pointer"
              value={consola} 
              onChange={(e) => setConsola(e.target.value)} 
              required
            >
              <option value="" disabled>-- Selecciona una plataforma --</option>
              <option value="Playstation">Playstation</option>
              <option value="Xbox">Xbox</option>
              <option value="Nintendo">Nintendo</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-slate-300">URL de la Imagen</label>
            <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white focus:border-blue-500 outline-none" value={imagen} onChange={(e) => setImagen(e.target.value)} required />
          </div>

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded transition-colors mt-2">
            Publicar Videojuego
          </button>
        </form>
      </div>
    </div>
  );
}