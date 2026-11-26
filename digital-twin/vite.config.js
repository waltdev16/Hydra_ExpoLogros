import { defineConfig } from 'vite';

export default defineConfig({
  // Rutas relativas: el build funciona dentro de cualquier carpeta,
  // por ejemplo public/hydra/ del portafolio cargado en un iframe.
  base: './',
  server: {
    // Permite importar el firmware desde ../firmware (fuera de digital-twin).
    fs: { allow: ['..'] },
  },
  build: {
    // Three.js ocupa ~550 kB minificado; es esperado para una escena 3D.
    chunkSizeWarningLimit: 700,
  },
});
