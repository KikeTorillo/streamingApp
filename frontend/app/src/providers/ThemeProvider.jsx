// ThemeProvider.jsx - Sistema Universal de Themes Multi-Brand
// ✅ FASE 1: ThemeProvider multi-theme según arquitectura mejorada

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';

/**
 * ✅ FACTORY PARA CREAR THEMES
 * Sistema que permite crear themes configurables dinámicamente
 */
export function createTheme(themeConfig) {
  const {
    name,
    colors = {},
    radii = {},
    spacing = {},
    shadows = {},
    typography = {},
    breakpoints = {},
    transitions = {}
  } = themeConfig;

  return {
    name,
    colors: {
      // Colores base siempre presentes
      primary: '#219ebc',
      secondary: '#fb8500',
      success: '#28a745',
      warning: '#ffb703',
      danger: '#dc3545',
      neutral: '#6c757d',
      
      // Background y text automáticos por modo
      background: 'var(--color-background)',
      surface: 'var(--color-surface)',
      text: 'var(--color-text)',
      'text-muted': 'var(--color-text-muted)',
      border: 'var(--color-border)',
      
      // Override con colores custom
      ...colors
    },
    radii: {
      none: '0',
      sm: '0.6rem',
      md: '1.2rem',
      lg: '1.8rem',
      xl: '2.4rem',
      full: '9999px',
      ...radii
    },
    spacing: {
      xs: '0.6rem',
      sm: '1.2rem',
      md: '1.8rem',
      lg: '2.4rem',
      xl: '3.6rem',
      ...spacing
    },
    shadows: {
      none: 'none',
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      ...shadows
    },
    typography: {
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        md: '1rem',
        lg: '1.125rem',
        xl: '1.25rem'
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700'
      },
      lineHeight: {
        tight: '1.25',
        normal: '1.5',
        relaxed: '1.75'
      },
      ...typography
    },
    breakpoints: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      ...breakpoints
    },
    transitions: {
      fast: '150ms ease-in-out',
      normal: '250ms ease-in-out',
      slow: '350ms ease-in-out',
      ...transitions
    }
  };
}

/**
 * ✅ THEMES PREDEFINIDOS
 * Biblioteca de themes listos para usar
 */
export const BUILT_IN_THEMES = {
  // Theme original del proyecto (Streaming/Océano)
  streaming: createTheme({
    name: 'streaming',
    colors: {
      primary: '#219ebc',
      secondary: '#fb8500',
      success: '#28a745',
      warning: '#ffb703',
      danger: '#dc3545',
      neutral: '#6c757d'
    },
    radii: {
      sm: '0.6rem',
      md: '1.2rem',
      lg: '1.8rem'
    }
  }),

  // Theme Tierra (ya existente en el proyecto)
  tierra: createTheme({
    name: 'tierra',
    colors: {
      primary: '#2d5016', 
      secondary: '#8bc34a',
      success: '#4caf50',
      warning: '#ff9800',
      danger: '#f44336',
      neutral: '#795548'
    },
    radii: {
      sm: '0.4rem',
      md: '0.8rem',
      lg: '1.2rem'
    }
  }),

  // Theme moderno para e-commerce
  ecommerce: createTheme({
    name: 'ecommerce',
    colors: {
      primary: '#10b981',
      secondary: '#f59e0b',
      success: '#059669',
      warning: '#d97706',
      danger: '#dc2626',
      neutral: '#6b7280'
    },
    radii: {
      sm: '0.25rem',
      md: '0.5rem',
      lg: '0.75rem'
    }
  }),

  // Theme para SaaS/Enterprise
  enterprise: createTheme({
    name: 'enterprise',
    colors: {
      primary: '#3b82f6',
      secondary: '#8b5cf6',
      success: '#10b981',
      warning: '#f59e0b',
      danger: '#ef4444',
      neutral: '#64748b'
    },
    radii: {
      sm: '0.375rem',
      md: '0.75rem',
      lg: '1rem'
    }
  }),

  // Theme para gaming/entretenimiento
  gaming: createTheme({
    name: 'gaming',
    colors: {
      primary: '#8b5cf6',
      secondary: '#ec4899',
      success: '#06d6a0',
      warning: '#ffd60a',
      danger: '#f72585',
      neutral: '#6c757d'
    },
    radii: {
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem'
    }
  })
};

/**
 * ✅ CONFIGURACIÓN POR DEFECTO
 * Zero-config que funciona inmediatamente
 */
const DEFAULT_CONFIG = {
  themes: BUILT_IN_THEMES,
  defaultTheme: 'streaming',
  mode: 'auto', // light, dark, auto
  enableColorScheme: true,
  enableLocalStorage: true,
  enableSystemPreference: true,
  cssVariablesPrefix: '--'
};

/**
 * ✅ CONTEXTO DE THEMES
 * Estado global del sistema de themes
 */
const ThemeContext = createContext({
  currentTheme: 'streaming',
  colorMode: 'light',
  theme: null,
  availableThemes: [],
  setCurrentTheme: () => {},
  setColorMode: () => {},
  toggleColorMode: () => {},
  applyTheme: () => {}
});

/**
 * ✅ THEMEPROVIDER UNIVERSAL - Proveedor Multi-Theme
 * 
 * Sistema configurable que soporta:
 * - Múltiples themes por proyecto (streaming, tierra, e-commerce, etc.)
 * - Runtime switching sin reload
 * - CSS Variables automáticas
 * - Dark/Light mode automático
 * - LocalStorage persistence
 * - System preference detection
 * - Zero-config setup
 * 
 * @param {Object} config - Configuración del provider
 * @param {Object} config.themes - Themes disponibles
 * @param {string} config.defaultTheme - Theme por defecto
 * @param {string} config.mode - Modo de color ('light', 'dark', 'auto')
 * @param {boolean} config.enableColorScheme - Habilitar CSS color-scheme
 * @param {boolean} config.enableLocalStorage - Persistir en localStorage
 * @param {boolean} config.enableSystemPreference - Detectar preferencia del sistema
 */
export function ThemeProvider({ children, config = {} }) {
  // ✅ CONFIGURACIÓN FINAL - Merge con defaults
  const finalConfig = useMemo(() => ({
    ...DEFAULT_CONFIG,
    ...config,
    themes: { ...DEFAULT_CONFIG.themes, ...(config.themes || {}) }
  }), [config]);

  // ✅ ESTADO REACTIVO
  const [currentTheme, setCurrentTheme] = useState(finalConfig.defaultTheme);
  const [colorMode, setColorMode] = useState(finalConfig.mode);
  const [systemPreference, setSystemPreference] = useState('light');

  // ✅ DETECTAR PREFERENCIA DEL SISTEMA
  useEffect(() => {
    if (!finalConfig.enableSystemPreference) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemPreference(mediaQuery.matches ? 'dark' : 'light');

    const handler = (e) => setSystemPreference(e.matches ? 'dark' : 'light');
    mediaQuery.addEventListener('change', handler);
    
    return () => mediaQuery.removeEventListener('change', handler);
  }, [finalConfig.enableSystemPreference]);

  // ✅ CARGAR CONFIGURACIÓN DESDE LOCALSTORAGE
  useEffect(() => {
    if (!finalConfig.enableLocalStorage) return;

    const storedTheme = localStorage.getItem('theme-current');
    const storedMode = localStorage.getItem('theme-mode');

    if (storedTheme && finalConfig.themes[storedTheme]) {
      setCurrentTheme(storedTheme);
    }
    if (storedMode && ['light', 'dark', 'auto'].includes(storedMode)) {
      setColorMode(storedMode);
    }
  }, [finalConfig]);

  // ✅ DETERMINAR MODO FINAL
  const finalColorMode = useMemo(() => {
    if (colorMode === 'auto') {
      return systemPreference;
    }
    return colorMode;
  }, [colorMode, systemPreference]);

  // ✅ THEME ACTIVO
  const activeTheme = useMemo(() => {
    return finalConfig.themes[currentTheme] || finalConfig.themes[finalConfig.defaultTheme];
  }, [currentTheme, finalConfig.themes, finalConfig.defaultTheme]);

  // ✅ APLICAR THEME AL DOM
  useEffect(() => {
    const root = document.documentElement;
    
    // 1. LIMPIAR CLASES EXISTENTES
    root.classList.remove('dark', 'light');
    // Limpiar clases de themes legacy
    root.classList.remove('palette-tierra', 'palette-default');
    
    // 2. APLICAR MODO DE COLOR
    root.classList.add(finalColorMode);
    
    // 3. APLICAR CSS VARIABLES DEL THEME
    if (activeTheme) {
      // Colores
      Object.entries(activeTheme.colors).forEach(([key, value]) => {
        root.style.setProperty(`${finalConfig.cssVariablesPrefix}color-${key}`, value);
      });
      
      // Radii
      Object.entries(activeTheme.radii).forEach(([key, value]) => {
        root.style.setProperty(`${finalConfig.cssVariablesPrefix}radius-${key}`, value);
      });
      
      // Spacing
      Object.entries(activeTheme.spacing).forEach(([key, value]) => {
        root.style.setProperty(`${finalConfig.cssVariablesPrefix}spacing-${key}`, value);
      });
      
      // Shadows
      Object.entries(activeTheme.shadows).forEach(([key, value]) => {
        root.style.setProperty(`${finalConfig.cssVariablesPrefix}shadow-${key}`, value);
      });
      
      // Typography
      Object.entries(activeTheme.typography.fontSize || {}).forEach(([key, value]) => {
        root.style.setProperty(`${finalConfig.cssVariablesPrefix}font-size-${key}`, value);
      });
      
      // Transitions
      Object.entries(activeTheme.transitions).forEach(([key, value]) => {
        root.style.setProperty(`${finalConfig.cssVariablesPrefix}transition-${key}`, value);
      });
    }
    
    // 4. CSS COLOR-SCHEME AUTOMÁTICO
    if (finalConfig.enableColorScheme) {
      root.style.setProperty('color-scheme', finalColorMode);
    }
    
    // 5. PERSISTIR EN LOCALSTORAGE
    if (finalConfig.enableLocalStorage) {
      localStorage.setItem('theme-current', currentTheme);
      localStorage.setItem('theme-mode', colorMode);
    }
    
  }, [activeTheme, currentTheme, colorMode, finalColorMode, finalConfig]);

  // ✅ FUNCIÓN PARA CAMBIAR THEME
  const changeTheme = (themeName) => {
    if (finalConfig.themes[themeName]) {
      setCurrentTheme(themeName);
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`🎨 Theme cambiado a: "${themeName}"`);
      }
    } else {
      console.error(`❌ Theme "${themeName}" no encontrado. Disponibles: ${Object.keys(finalConfig.themes).join(', ')}`);
    }
  };

  // ✅ FUNCIÓN PARA CAMBIAR MODO
  const changeColorMode = (mode) => {
    if (['light', 'dark', 'auto'].includes(mode)) {
      setColorMode(mode);
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`🌙 Modo de color cambiado a: "${mode}"`);
      }
    }
  };

  // ✅ FUNCIÓN PARA TOGGLE MODO
  const toggleColorMode = () => {
    if (colorMode === 'auto') {
      setColorMode('light');
    } else {
      setColorMode(colorMode === 'light' ? 'dark' : 'light');
    }
  };

  // ✅ LISTA DE THEMES DISPONIBLES
  const availableThemes = useMemo(() => {
    return Object.keys(finalConfig.themes);
  }, [finalConfig.themes]);

  // ✅ VALOR DEL CONTEXTO
  const contextValue = useMemo(() => ({
    currentTheme,
    colorMode,
    finalColorMode,
    theme: activeTheme,
    availableThemes,
    setCurrentTheme: changeTheme,
    setColorMode: changeColorMode,
    toggleColorMode,
    isDark: finalColorMode === 'dark',
    isLight: finalColorMode === 'light',
    systemPreference,
    config: finalConfig
  }), [
    currentTheme, 
    colorMode, 
    finalColorMode, 
    activeTheme, 
    availableThemes, 
    systemPreference, 
    finalConfig
  ]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * ✅ HOOK PARA USAR EL SISTEMA DE THEMES
 * API simple para componentes
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useTheme debe usarse dentro de un ThemeProvider');
  }
  
  return context;
}

/**
 * ✅ HOOK PARA CREAR THEME CUSTOM EN RUNTIME
 * Para casos avanzados que necesitan themes dinámicos
 */
export function useCreateTheme() {
  const { config } = useTheme();
  
  const addTheme = (themeName, themeConfig) => {
    config.themes[themeName] = createTheme(themeConfig);
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`🎨 Theme custom "${themeName}" agregado`);
    }
  };
  
  return { addTheme, createTheme };
}

/**
 * ✅ PROPTYPES
 */
ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
  config: PropTypes.shape({
    themes: PropTypes.object,
    defaultTheme: PropTypes.string,
    mode: PropTypes.oneOf(['light', 'dark', 'auto']),
    enableColorScheme: PropTypes.bool,
    enableLocalStorage: PropTypes.bool,
    enableSystemPreference: PropTypes.bool,
    cssVariablesPrefix: PropTypes.string
  })
};

export default ThemeProvider;