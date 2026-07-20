import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CreatePost() {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [imagen, setImagen] = useState('');
  const [consola, setConsola] = useState('');
  const [stock, setStock] = useState('1'); 
  
  // Nuevos estados para capturar los datos de contacto
  const [nombreContacto, setNombreContacto] = useState('');
  const [facebook, setFacebook] = useState('');
  const [instagram, setInstagram] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token'); 
      const userRol = localStorage.getItem('rol'); 

      if (!token) {
        alert('No se detectó el token en el navegador. Por favor, cierra sesión e inicia sesión de nuevo.');
        return;
      }

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
          cargado_por,
          nombre_contacto: nombreContacto,
          facebook,
          instagram
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
    <div className="min-h-screen bg-slate-950 p-6 flex justify-center items-center text-white">
      <div className="w-full max-w-5xl grid md:grid-cols-3 gap-6">
        
        {/* Panel lateral con instrucciones */}
        <div className="md:col-span-1 bg-slate-900 border border-slate-800 p-6 rounded-lg shadow-xl h-fit">
          <h3 className="text-xl font-bold text-amber-400 mb-4 flex items-center gap-2">
            💡 ¿Cómo vender tu juego?
          </h3>
          <ul className="space-y-4 text-sm text-slate-300 list-disc pl-4 leading-relaxed">
            <li>
              <strong className="text-white">Publica el artículo:</strong> Introduce los detalles básicos de tu videojuego y asigna un precio conveniente.
            </li>
            <li>
              <strong className="text-white">Déjanos tu contacto:</strong> Rellena tu nombre y tus redes sociales para que los compradores de la zona te hablen directamente.
            </li>
            <li>
              <strong className="text-white">Elimínalo al vender:</strong> Cuando concretes la venta del artículo, ve al detalle de tu publicación y pulsa el botón <span className="text-rose-400 font-semibold">"¡Ya lo vendí!"</span> para borrarlo inmediatamente del catálogo.
            </li>
          </ul>
        </div>

        {/* Formulario principal */}
        <div className="md:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-lg shadow-xl">
          <h2 className="text-2xl font-bold text-blue-500 text-center mb-6">🎮 Publicar un Juego para Vender</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1 text-slate-300">Título del Videojuego</label>
                <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white focus:border-blue-500 outline-none" value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-slate-300">Consola / Plataforma</label>
                <select 
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white focus:border-blue-500 outline-none cursor-pointer"
                  value={consola} 
                  onChange={(e) => setConsola(e.target.value)} 
                  required
                >
                  <option value="" disabled>-- Selecciona --</option>
                  <option value="Playstation">Playstation</option>
                  <option value="Xbox">Xbox</option>
                  <option value="Nintendo">Nintendo</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1 text-slate-300">Descripción</label>
              <textarea className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white h-20 focus:border-blue-500 outline-none" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1 text-slate-300">Precio ($)</label>
                <input type="number" className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white focus:border-blue-500 outline-none" value={precio} onChange={(e) => setPrecio(e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-slate-300">Unidades (Stock)</label>
                <input type="number" className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white focus:border-blue-500 outline-none" value={stock} onChange={(e) => setStock(e.target.value)} required min="1" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1 text-slate-300">URL de la Imagen</label>
              <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white focus:border-blue-500 outline-none" value={imagen} onChange={(e) => setImagen(e.target.value)} required />
            </div>

            {/* Información de contacto */}
            <div className="border-t border-slate-800 pt-4 mt-2">
              <h3 className="text-md font-bold text-amber-400 mb-3">👤 Información de Contacto para el Comprador</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-400">Tu Nombre de Contacto</label>
                  <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm text-white focus:border-blue-500 outline-none" placeholder="Ej: Manuel Achu" value={nombreContacto} onChange={(e) => setNombreContacto(e.target.value)} required />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-slate-400">Nombre de Facebook (Opcional)</label>
                    <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm text-white focus:border-blue-500 outline-none" placeholder="machu2022" value={facebook} onChange={(e) => setFacebook(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-slate-400">Instagram (Opcional)</label>
                    <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm text-white focus:border-blue-500 outline-none" placeholder="__machu__" value={instagram} onChange={(e) => setInstagram(e.target.value)} />
                  </div>
                </div>
              </div>
            </div>

            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded transition-colors mt-4">
              Publicar Videojuego
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}