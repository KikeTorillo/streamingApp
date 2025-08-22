import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig(() => {
  
  return {
    plugins: [react()],
    
    // ✅ Aliases optimizados para imports limpios y tree shaking
    resolve: {
      alias: {
        '@': path.resolve(fileURLToPath(new URL('./src', import.meta.url))),
        '@components': path.resolve(fileURLToPath(new URL('./src/components', import.meta.url))),
        '@services': path.resolve(fileURLToPath(new URL('./src/services', import.meta.url))),
        '@assets': path.resolve(fileURLToPath(new URL('./src/assets', import.meta.url))),
        
        // ✅ DESIGN SYSTEM ALIASES - Para mejor tree shaking
        '@providers': path.resolve(fileURLToPath(new URL('./src/providers', import.meta.url))),
        '@design-system': path.resolve(fileURLToPath(new URL('./src/providers/index.js', import.meta.url))),
        '@hooks': path.resolve(fileURLToPath(new URL('./src/providers/providers-hooks.js', import.meta.url))),
      },
    },
    
    // Variables globales
    define: {
      __APP_VERSION__: JSON.stringify('1.0.0'),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    },

    
    // ✅ OPTIMIZACIÓN TREE SHAKING
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom'
      ],
      exclude: [
        // Excluir providers para tree shaking manual
        './src/providers/providers-hooks.js'
      ]
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
    
    // PRODUCCIÓN: Optimizado para Synology + Tree Shaking
    build: {
      outDir: 'dist',
      sourcemap: false,           // Sin sourcemaps = menos espacio en NAS
      minify: 'esbuild',          // Compresión máxima
      
      // ✅ TREE SHAKING OPTIMIZATION
      target: 'esnext',           // Máximo tree shaking moderno
      modulePreload: {
        polyfill: false           // Evitar polyfills innecesarios
      },
      
      // ✅ Bundle Splitting Optimization - Chunks para mejor cache
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            // ✅ VENDOR CORE - React ecosystem
            if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router-dom')) {
              return 'vendor';
            }
            
            // ✅ DESIGN SYSTEM - Providers de la librería (chunk independiente)
            if (id.includes('/providers/') && (id.includes('Provider.jsx') || id.includes('providers-hooks.js'))) {
              return 'design-system';
            }
            
            // ✅ ICONS - react-icons separado para mejor caching  
            if (id.includes('node_modules/react-icons')) {
              return 'react-icons';
            }
            
            // ✅ UI COMPONENTS - Otros componentes UI
            if (id.includes('node_modules/@headlessui')) {
              return 'ui';
            }
            
            // ✅ VIDEO - Librerías de video pesadas
            if (id.includes('node_modules/hls.js') || id.includes('node_modules/video.js')) {
              return 'video';
            }
            
            // ✅ UTILS - Utilidades y helpers
            if (id.includes('/utils/') && !id.includes('node_modules')) {
              return 'utils';
            }
            
            // ✅ Resto de node_modules como vendor general
            if (id.includes('node_modules')) {
              return 'vendor-libs';
            }
          },
          
          // ✅ CHUNK NAMING optimizado para cache
          chunkFileNames: (chunkInfo) => {
            // Si el chunk tiene un nombre asignado en manualChunks, úsalo
            if (chunkInfo.name && chunkInfo.name !== 'index') {
              return `assets/${chunkInfo.name}-[hash].js`;
            }
            
            // Fallback para otros chunks
            const facadeModuleId = chunkInfo.facadeModuleId
              ? chunkInfo.facadeModuleId.split('/').pop().replace('.jsx', '').replace('.js', '')
              : 'chunk';
            return `assets/${facadeModuleId}-[hash].js`;
          }
        },
      },
      
      // Límite de chunk size
      chunkSizeWarningLimit: 1000,
    },
  }
})