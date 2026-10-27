import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// host: true hace que Vite escuche en todas las interfaces del contenedor.
// Sin eso, el -p 3001:3000 de docker no llega al servidor, que quedaría en 127.0.0.1.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
  },
})
