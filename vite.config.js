import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // 🚨 IMPORTA EL PLUGIN

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // 🚨 ACTIVA TAILWIND AQUÍ
  ],
})