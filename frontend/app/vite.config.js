import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig(() => {
  
  return {
    plugins: [react()],
    
    // Aliases útiles para imports más limpios
    resolve: {
      alias: {
        '@': path.resolve(fileURLToPath(new URL('./src', import.meta.url))),
        '@components': path.resolve(fileURLToPath(new URL('./src/components', import.meta.url))),
        '@services': path.resolve(fileURLToPath(new URL('./src/services', import.meta.url))),
        '@assets': path.resolve(fileURLToPath(new URL('./src/assets', import.meta.url))),
      },
    },
    
    // Variables globales
    define: {
      __APP_VERSION__: JSON.stringify('1.0.0'),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    },
    
    // DESARROLLO: Puerto homologado con producción
    server: {
      host: '0.0.0.0',
      port: 8080,
      strictPort: true,
      watch: {
        usePolling: true,
        interval: 1000,
        ignored: ['**/node_modules/**', '**/dist/**'],
      },
      hmr: {
        port: 8080,
        host: 'localhost',  // HMR solo para desarrollo local
        clientPort: 8080,
      },
      fs: {
        strict: false,
      },
    },
    
    // PRODUCCIÓN: Optimizado para Synology
    build: {
      outDir: 'dist',
      sourcemap: false,           // Sin sourcemaps = menos espacio en NAS
      minify: 'esbuild',          // Compresión máxima
      
      // Chunks para mejor cache en NAS
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            ui: ['@headlessui/react', 'react-icons'],
            video: ['hls.js', 'video.js'],
          },
        },
      },
      
      // Límite de chunk size
      chunkSizeWarningLimit: 1000,
    },
  }
})