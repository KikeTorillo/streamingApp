// IconProvider.jsx - Sistema Universal de Iconos Configurable
// ✅ FASE 1: IconProvider configurable según arquitectura mejorada

import React, { createContext, useContext, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

// Importar librerías de iconos disponibles
import * as FeatherIcons from 'react-icons/fi';

/**
 * ✅ CONFIGURACIÓN DE LIBRERÍAS SOPORTADAS
 * Sistema extensible que permite agregar nuevas librerías fácilmente
 */
const ICON_LIBRARIES = {
  feather: {
    name: 'Feather Icons',
    icons: FeatherIcons,
    prefix: 'Fi',
    fallback: 'FiHelpCircle'
  }
};

/**
 * ✅ MAPEO UNIVERSAL DE NOMBRES DE ICONOS
 * Sistema que normaliza nombres entre diferentes librerías
 */
const UNIVERSAL_ICON_MAP = {
  // Navigation & Actions
  'home': { feather: 'FiHome' },
  'search': { feather: 'FiSearch' },
  'menu': { feather: 'FiMenu' },
  'close': { feather: 'FiX' },
  'x': { feather: 'FiX' }, // ✅ Alias para Modal close button
  'plus': { feather: 'FiPlus' },
  'edit': { feather: 'FiEdit3' },
  'delete': { feather: 'FiTrash2' },
  'trash-2': { feather: 'FiTrash2' }, // ✅ Alias para AlertModal delete type
  'save': { feather: 'FiSave' },
  
  // User & Profile
  'user': { feather: 'FiUser' },
  'users': { feather: 'FiUsers' },
  'settings': { feather: 'FiSettings' },
  
  // Media & Content
  'play': { feather: 'FiPlay' },
  'pause': { feather: 'FiPause' },
  'video': { feather: 'FiVideo' },
  'image': { feather: 'FiImage' },
  'film': { feather: 'FiFilm' },
  
  // Status & Notifications
  'success': { feather: 'FiCheckCircle' },
  'check-circle': { feather: 'FiCheckCircle' }, // ✅ Alias para AlertModal success type
  'warning': { feather: 'FiAlertCircle' },
  'error': { feather: 'FiXCircle' },
  'x-circle': { feather: 'FiXCircle' }, // ✅ Alias para AlertModal error type
  'info': { feather: 'FiInfo' },
  'help-circle': { feather: 'FiHelpCircle' }, // ✅ Para AlertModal confirm type
  'loading': { feather: 'FiLoader' },
  'lock': { feather: 'FiLock' }, // ✅ Para AlertModal permission type
  
  // Arrows & Navigation
  'arrow-left': { feather: 'FiArrowLeft' },
  'arrow-right': { feather: 'FiArrowRight' },
  'chevron-down': { feather: 'FiChevronDown' },
  'chevron-up': { feather: 'FiChevronUp' },
  
  // Theme & Preferences
  'sun': { feather: 'FiSun' },
  'moon': { feather: 'FiMoon' },
  
  // Common UI Elements
  'eye': { feather: 'FiEye' },
  'eye-off': { feather: 'FiEyeOff' },
  'heart': { feather: 'FiHeart' },
  'star': { feather: 'FiStar' },
  'calendar': { feather: 'FiCalendar' },
  'clock': { feather: 'FiClock' }
};

/**
 * ✅ CONFIGURACIÓN POR DEFECTO
 * Zero-config que funciona inmediatamente
 */
const DEFAULT_CONFIG = {
  library: 'feather',
  customIcons: {},
  fallback: 'help-circle',
  sizes: {
    xs: '12px',
    sm: '16px', 
    md: '20px',
    lg: '24px',
    xl: '32px'
  },
  enableAutoMapping: true,
  enableFallback: true
};

/**
 * ✅ CONTEXTO DE ICONOS
 * Estado global del sistema de iconos
 */
const IconContext = createContext({
  registry: new Map(),
  config: DEFAULT_CONFIG,
  loadIcon: () => null,
  addCustomIcon: () => {},
  setLibrary: () => {},
  availableIcons: []
});

/**
 * ✅ ICONPROVIDER - Proveedor Universal de Iconos
 * 
 * Sistema configurable que soporta:
 * - Múltiples librerías de iconos (Feather, Lucide, Heroicons, Phosphor)
 * - Iconos custom por proyecto
 * - Auto-mapping entre librerías
 * - Fallbacks automáticos
 * - Zero-config setup
 * 
 * @param {Object} config - Configuración del provider
 * @param {string} config.library - Librería principal ('feather', 'lucide', 'heroicons', 'phosphor')
 * @param {Object} config.customIcons - Iconos custom del proyecto
 * @param {string} config.fallback - Icono fallback si no se encuentra
 * @param {Object} config.sizes - Tamaños disponibles
 * @param {boolean} config.enableAutoMapping - Habilitar mapeo automático entre librerías
 * @param {boolean} config.enableFallback - Habilitar fallback automático
 */
export function IconProvider({ children, config = {} }) {
  // ✅ CONFIGURACIÓN FINAL - Merge con defaults
  const finalConfig = useMemo(() => ({
    ...DEFAULT_CONFIG,
    ...config,
    sizes: { ...DEFAULT_CONFIG.sizes, ...(config.sizes || {}) }
  }), [config]);

  // ✅ ESTADO REACTIVO - Library switching
  const [currentLibrary, setCurrentLibrary] = useState(finalConfig.library);

  // ✅ REGISTRO DE ICONOS - Mapa completo de iconos disponibles
  const iconRegistry = useMemo(() => {
    const registry = new Map();
    
    // 1. CARGAR LIBRERÍA BASE
    const libraryConfig = ICON_LIBRARIES[currentLibrary];
    if (libraryConfig) {
      const libraryIcons = libraryConfig.icons;
      
      // Agregar todos los iconos de la librería principal
      Object.entries(libraryIcons).forEach(([iconKey, IconComponent]) => {
        // Agregar con nombre original (ej: FiHome)
        registry.set(iconKey, IconComponent);
        
        // Agregar con nombre normalizado si existe mapeo universal
        const normalizedName = findNormalizedName(iconKey, currentLibrary);
        if (normalizedName) {
          registry.set(normalizedName, IconComponent);
        }
      });
    }
    
    // 2. AGREGAR ICONOS CUSTOM
    Object.entries(finalConfig.customIcons || {}).forEach(([name, icon]) => {
      registry.set(name, icon);
    });
    
    // 3. AGREGAR MAPEOS UNIVERSALES
    if (finalConfig.enableAutoMapping) {
      Object.entries(UNIVERSAL_ICON_MAP).forEach(([universalName, libraryMap]) => {
        if (libraryMap[currentLibrary] && !registry.has(universalName)) {
          const iconKey = libraryMap[currentLibrary];
          const IconComponent = libraryConfig?.icons?.[iconKey];
          if (IconComponent) {
            registry.set(universalName, IconComponent);
          }
        }
      });
    }
    
    return registry;
  }, [currentLibrary, finalConfig]);

  // ✅ FUNCIÓN PARA CARGAR ICONOS
  const loadIcon = useMemo(() => {
    return (iconName) => {
      if (!iconName) return null;
      
      // Buscar en el registro
      let IconComponent = iconRegistry.get(iconName);
      
      // Fallback si no se encuentra y está habilitado
      if (!IconComponent && finalConfig.enableFallback) {
        const libraryConfig = ICON_LIBRARIES[currentLibrary];
        const fallbackKey = libraryConfig?.fallback;
        if (fallbackKey && libraryConfig?.icons?.[fallbackKey]) {
          IconComponent = libraryConfig.icons[fallbackKey];
          
          // Warning en desarrollo
          if (process.env.NODE_ENV === 'development') {
            console.warn(
              `🔍 Icon "${iconName}" no encontrado en librería "${currentLibrary}". ` +
              `Usando fallback "${fallbackKey}".`
            );
          }
        }
      }
      
      return IconComponent || null;
    };
  }, [iconRegistry, currentLibrary, finalConfig.enableFallback]);

  // ✅ FUNCIÓN PARA AGREGAR ICONOS CUSTOM EN RUNTIME
  const addCustomIcon = (name, icon) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`🎨 Agregando icono custom: "${name}"`);
    }
    
    // Agregar al config para re-render
    finalConfig.customIcons[name] = icon;
  };

  // ✅ FUNCIÓN PARA CAMBIAR LIBRERÍA EN RUNTIME
  const setLibrary = (newLibrary) => {
    if (ICON_LIBRARIES[newLibrary]) {
      setCurrentLibrary(newLibrary);
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`📚 Cambiando librería de iconos a: "${newLibrary}"`);
      }
    } else {
      console.warn(`⚠️ Librería de iconos "${newLibrary}" no disponible. Solo 'feather' está soportada actualmente.`);
    }
  };

  // ✅ LISTA DE ICONOS DISPONIBLES
  const availableIcons = useMemo(() => {
    return Array.from(iconRegistry.keys()).sort();
  }, [iconRegistry]);

  // ✅ VALOR DEL CONTEXTO
  const contextValue = useMemo(() => ({
    registry: iconRegistry,
    config: finalConfig,
    currentLibrary,
    loadIcon,
    addCustomIcon,
    setLibrary,
    availableIcons
  }), [iconRegistry, finalConfig, currentLibrary, loadIcon, addCustomIcon, setLibrary, availableIcons]);

  return (
    <IconContext.Provider value={contextValue}>
      {children}
    </IconContext.Provider>
  );
}

/**
 * ✅ HOOK PARA USAR EL SISTEMA DE ICONOS
 * API simple para componentes
 */
export function useIcon(iconName, size = 'md') {
  const { loadIcon, config } = useContext(IconContext);
  
  const IconComponent = useMemo(() => {
    return loadIcon(iconName);
  }, [loadIcon, iconName]);
  
  const iconSize = config.sizes[size] || config.sizes.md;
  
  return {
    IconComponent,
    size: iconSize,
    exists: !!IconComponent
  };
}

/**
 * ✅ HOOK PARA ACCESO COMPLETO AL CONTEXTO
 * Para casos avanzados que necesitan más control
 */
export function useIconContext() {
  const context = useContext(IconContext);
  
  if (!context) {
    throw new Error('useIconContext debe usarse dentro de un IconProvider');
  }
  
  return context;
}

/**
 * ✅ FUNCIÓN HELPER - Encontrar nombre normalizado
 */
function findNormalizedName(iconKey, library) {
  for (const [normalizedName, libraryMap] of Object.entries(UNIVERSAL_ICON_MAP)) {
    if (libraryMap[library] === iconKey) {
      return normalizedName;
    }
  }
  return null;
}

/**
 * ✅ PROPTYPES
 */
IconProvider.propTypes = {
  children: PropTypes.node.isRequired,
  config: PropTypes.shape({
    library: PropTypes.oneOf(['feather']),
    customIcons: PropTypes.object,
    fallback: PropTypes.string,
    sizes: PropTypes.object,
    enableAutoMapping: PropTypes.bool,
    enableFallback: PropTypes.bool
  })
};

export default IconProvider;