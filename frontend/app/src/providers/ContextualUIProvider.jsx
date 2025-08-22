// ContextualUIProvider.jsx - Provider Universal del Sistema de Diseño
// ✅ FASE 1: Provider integrado que combina IconProvider + ThemeProvider

import React from 'react';
import PropTypes from 'prop-types';
import { IconProvider } from './IconProvider';
import { ThemeProvider, BUILT_IN_THEMES } from './ThemeProvider';

/**
 * ✅ CONFIGURACIÓN UNIFICADA PARA STREAMING APP
 * Setup completo que combina iconos + themes optimizado para el proyecto
 */
const STREAMING_APP_CONFIG = {
  // Configuración de iconos
  icons: {
    library: 'feather',
    customIcons: {
      // Iconos específicos del dominio streaming
      'brand-logo': () => (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L2 7v10l10 5 10-5V7l-10-5z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
      ),
      'streaming-play': () => (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <polygon points="5,3 19,12 5,21"/>
        </svg>
      ),
      'video-quality': () => (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <rect x="2" y="6" width="20" height="12" rx="2"/>
          <text x="12" y="12" textAnchor="middle" fontSize="6" fill="white">HD</text>
        </svg>
      ),
      'subtitle': () => (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <rect x="2" y="8" width="20" height="8" rx="1"/>
          <line x1="6" y1="12" x2="18" y2="12" stroke="white" strokeWidth="1"/>
        </svg>
      ),
      'cast': () => (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M1 18v3h3c0-1.66-1.34-3-3-3zm0-4v2c2.76 0 5 2.24 5 5h2c0-3.87-3.13-7-7-7zm18-7H5v1.63c3.96 1.28 7.09 4.41 8.37 8.37H19V7zM1 10v2c4.97 0 9 4.03 9 9h2c0-6.08-4.92-11-11-11zm20-7H3c-1.1 0-2 .9-2 2v3h2V5h18v14h-7v2h7c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
        </svg>
      ),
      'fullscreen': () => (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
        </svg>
      )
    },
    fallback: 'help-circle',
    enableAutoMapping: true,
    enableFallback: true
  },
  
  // Configuración de themes
  themes: {
    themes: BUILT_IN_THEMES,
    defaultTheme: 'streaming',
    mode: 'auto',
    enableSystemPreference: true,
    enableLocalStorage: true,
    enableColorScheme: true
  }
};

/**
 * ✅ CONTEXTUALUIPROVIDER - Provider Universal del Sistema de Diseño
 * 
 * Combina IconProvider + ThemeProvider en un solo provider configurable
 * que proporciona todo lo necesario para el sistema de diseño.
 * 
 * Características:
 * - Zero-config setup para el proyecto StreamingApp
 * - Configuración completa para iconos + themes
 * - Backward compatibility total
 * - Setup optimizado para performance
 * - Iconos custom del dominio streaming
 * - Themes configurables en runtime
 * 
 * @param {Object} config - Configuración del sistema de diseño
 * @param {Object} config.icons - Configuración del IconProvider
 * @param {Object} config.themes - Configuración del ThemeProvider
 * @param {string} config.preset - Preset predefinido ('streaming', 'ecommerce', 'enterprise')
 */
export function ContextualUIProvider({ 
  children, 
  config = {}, 
  preset = 'streaming' 
}) {
  
  // ✅ CONFIGURACIÓN FINAL - Merge con preset y overrides
  const finalConfig = React.useMemo(() => {
    let baseConfig = STREAMING_APP_CONFIG;
    
    // Si se especifica un preset diferente, podríamos tener otros configs
    if (preset !== 'streaming') {
      // Para futuros presets (ecommerce, enterprise, etc.)
      baseConfig = STREAMING_APP_CONFIG; // Por ahora usar streaming como base
    }
    
    return {
      icons: { ...baseConfig.icons, ...(config.icons || {}) },
      themes: { ...baseConfig.themes, ...(config.themes || {}) }
    };
  }, [config, preset]);

  // ✅ WARNING SI SE DETECTA SETUP LEGACY
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // Detectar si hay ThemeContext legacy en uso
      const hasLegacyTheme = document.querySelector('.palette-tierra') || 
                            localStorage.getItem('palette') ||
                            localStorage.getItem('mode');
      
      if (hasLegacyTheme) {
        console.warn(
          '🔄 MIGRATION NOTICE: Se detectó uso del ThemeContext legacy.\n' +
          '📋 Para migrar completamente:\n' +
          '1. Reemplazar imports de ThemeContext con ContextualUIProvider\n' +
          '2. Actualizar componentes que usen useTheme legacy\n' +
          '3. Remover ThemeContext.jsx antiguo\n' +
          '📖 Guía: /utils/themeMigration.js'
        );
      }
    }
  }, []);

  return (
    <ThemeProvider config={finalConfig.themes}>
      <IconProvider config={finalConfig.icons}>
        {children}
      </IconProvider>
    </ThemeProvider>
  );
}

/**
 * ✅ PRESETS PREDEFINIDOS
 * Configuraciones listas para diferentes tipos de aplicaciones
 */
export const UI_PRESETS = {
  // Para aplicaciones de streaming/entretenimiento
  streaming: {
    icons: {
      library: 'feather',
      customIcons: STREAMING_APP_CONFIG.icons.customIcons
    },
    themes: {
      defaultTheme: 'streaming',
      mode: 'auto'
    }
  },
  
  // Para aplicaciones de e-commerce
  ecommerce: {
    icons: {
      library: 'lucide',
      customIcons: {
        'cart': () => (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
        )
      }
    },
    themes: {
      defaultTheme: 'ecommerce',
      mode: 'light'
    }
  },
  
  // Para aplicaciones enterprise/SaaS
  enterprise: {
    icons: {
      library: 'heroicons'
    },
    themes: {
      defaultTheme: 'enterprise',
      mode: 'auto'
    }
  }
};

/**
 * ✅ HOOK PARA ACCESO COMPLETO AL SISTEMA DE DISEÑO
 * Combina useIcon + useTheme en un solo hook conveniente
 */
export function useContextualUI() {
  // Importar los hooks aquí para evitar problemas de circular imports
  const { useIcon } = require('./IconProvider');
  const { useTheme } = require('./ThemeProvider');
  
  try {
    const iconContext = useIcon ? useIcon('home') : null; // Test básico
    const themeContext = useTheme ? useTheme() : null;
    
    return {
      // Sistema de iconos
      icons: iconContext,
      
      // Sistema de themes  
      themes: themeContext,
      currentTheme: themeContext?.currentTheme,
      setTheme: themeContext?.setCurrentTheme,
      colorMode: themeContext?.colorMode,
      toggleColorMode: themeContext?.toggleColorMode,
      
      // Estado combinado
      isReady: Boolean(iconContext && themeContext)
    };
  } catch (error) {
    console.warn('ContextualUI not ready:', error);
    return { isReady: false };
  }
}

/**
 * ✅ PROPTYPES
 */
ContextualUIProvider.propTypes = {
  children: PropTypes.node.isRequired,
  config: PropTypes.shape({
    icons: PropTypes.object,
    themes: PropTypes.object
  }),
  preset: PropTypes.oneOf(['streaming', 'ecommerce', 'enterprise'])
};

/**
 * ✅ EXPORT CON BACKWARD COMPATIBILITY
 * Mantiene compatibilidad con imports legacy
 */
export { 
  ContextualUIProvider as default,
  STREAMING_APP_CONFIG
};

// Re-exports para conveniencia
export { useIcon } from './IconProvider';
export { useTheme } from './ThemeProvider';