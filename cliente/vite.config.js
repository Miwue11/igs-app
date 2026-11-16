import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // En GitHub Pages la web vive en /igs-app/ (se pasa VITE_BASE al compilar). En local, en la raíz.
  base: process.env.VITE_BASE || '/',
  resolve: {
    // "@compartido" = carpeta ../compartido (constantes y validaciones comunes con el servidor)
    alias: { '@compartido': fileURLToPath(new URL('../compartido', import.meta.url)) },
  },
  server: {
    port: 5173,
    // Permite abrir el servidor de Vite a través del reenvío de puertos de VS Code
    allowedHosts: ['.devtunnels.ms'],
    // En desarrollo, /api y /fotos van a la API de Node (mismo origen → la cookie de sesión funciona).
    proxy: {
      '/api': 'http://localhost:4000',
      '/fotos': 'http://localhost:4000',
    },
    fs: { allow: ['..'] },
  },
});
