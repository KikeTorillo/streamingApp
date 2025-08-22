// IconProvider.jsx - Sistema Universal de Iconos Configurable
// ✅ FASE 1: IconProvider configurable según arquitectura mejorada

import React, { createContext, useContext, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

// Importar librerías de iconos disponibles
import * as FeatherIcons from 'react-icons/fi';
import * as LucideIcons from 'react-icons/lu';
import * as HeroIcons from 'react-icons/hi2';
import * as PhosphorIcons from 'react-icons/ph';

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
  },
  lucide: {
    name: 'Lucide Icons', 
    icons: LucideIcons,
    prefix: 'Lu',
    fallback: 'LuHelpCircle'
  },
  heroicons: {
    name: 'Hero Icons v2',
    icons: HeroIcons,
    prefix: 'Hi2',
    fallback: 'Hi2QuestionMarkCircleIcon'
  },
  phosphor: {
    name: 'Phosphor Icons',
    icons: PhosphorIcons,
    prefix: 'Ph',
    fallback: 'PhQuestion'
  }
};

/**
 * ✅ MAPEO UNIVERSAL DE NOMBRES DE ICONOS
 * Sistema que normaliza nombres entre diferentes librerías
 */
const UNIVERSAL_ICON_MAP = {
  // Navigation & Actions
  'home': { feather: 'FiHome', lucide: 'LuHome', heroicons: 'Hi2HomeIcon', phosphor: 'PhHouse' },
  'search': { feather: 'FiSearch', lucide: 'LuSearch', heroicons: 'Hi2MagnifyingGlassIcon', phosphor: 'PhMagnifyingGlass' },
  'menu': { feather: 'FiMenu', lucide: 'LuMenu', heroicons: 'Hi2Bars3Icon', phosphor: 'PhList' },
  'close': { feather: 'FiX', lucide: 'LuX', heroicons: 'Hi2XMarkIcon', phosphor: 'PhX' },
  'plus': { feather: 'FiPlus', lucide: 'LuPlus', heroicons: 'Hi2PlusIcon', phosphor: 'PhPlus' },
  'edit': { feather: 'FiEdit3', lucide: 'LuEdit3', heroicons: 'Hi2PencilIcon', phosphor: 'PhPencil' },
  'delete': { feather: 'FiTrash2', lucide: 'LuTrash2', heroicons: 'Hi2TrashIcon', phosphor: 'PhTrash' },
  'save': { feather: 'FiSave', lucide: 'LuSave', heroicons: 'Hi2CheckIcon', phosphor: 'PhFloppyDisk' },
  
  // User & Profile
  'user': { feather: 'FiUser', lucide: 'LuUser', heroicons: 'Hi2UserIcon', phosphor: 'PhUser' },
  'users': { feather: 'FiUsers', lucide: 'LuUsers', heroicons: 'Hi2UsersIcon', phosphor: 'PhUsers' },
  'settings': { feather: 'FiSettings', lucide: 'LuSettings', heroicons: 'Hi2CogIcon', phosphor: 'PhGear' },
  
  // Media & Content
  'play': { feather: 'FiPlay', lucide: 'LuPlay', heroicons: 'Hi2PlayIcon', phosphor: 'PhPlay' },
  'pause': { feather: 'FiPause', lucide: 'LuPause', heroicons: 'Hi2PauseIcon', phosphor: 'PhPause' },
  'video': { feather: 'FiVideo', lucide: 'LuVideo', heroicons: 'Hi2VideoCameraIcon', phosphor: 'PhVideoCamera' },
  'image': { feather: 'FiImage', lucide: 'LuImage', heroicons: 'Hi2PhotoIcon', phosphor: 'PhImage' },
  'film': { feather: 'FiFilm', lucide: 'LuFilm', heroicons: 'Hi2FilmIcon', phosphor: 'PhFilmStrip' },
  
  // Status & Notifications
  'success': { feather: 'FiCheckCircle', lucide: 'LuCheckCircle', heroicons: 'Hi2CheckCircleIcon', phosphor: 'PhCheckCircle' },
  'warning': { feather: 'FiAlertCircle', lucide: 'LuAlertCircle', heroicons: 'Hi2ExclamationTriangleIcon', phosphor: 'PhWarningCircle' },
  'error': { feather: 'FiXCircle', lucide: 'LuXCircle', heroicons: 'Hi2XCircleIcon', phosphor: 'PhXCircle' },
  'info': { feather: 'FiInfo', lucide: 'LuInfo', heroicons: 'Hi2InformationCircleIcon', phosphor: 'PhInfo' },
  'loading': { feather: 'FiLoader', lucide: 'LuLoader', heroicons: 'Hi2ArrowPathIcon', phosphor: 'PhSpinner' },
  
  // Arrows & Navigation
  'arrow-left': { feather: 'FiArrowLeft', lucide: 'LuArrowLeft', heroicons: 'Hi2ArrowLeftIcon', phosphor: 'PhArrowLeft' },
  'arrow-right': { feather: 'FiArrowRight', lucide: 'LuArrowRight', heroicons: 'Hi2ArrowRightIcon', phosphor: 'PhArrowRight' },
  'chevron-down': { feather: 'FiChevronDown', lucide: 'LuChevronDown', heroicons: 'Hi2ChevronDownIcon', phosphor: 'PhCaretDown' },
  'chevron-up': { feather: 'FiChevronUp', lucide: 'LuChevronUp', heroicons: 'Hi2ChevronUpIcon', phosphor: 'PhCaretUp' },
  
  // Theme & Preferences
  'sun': { feather: 'FiSun', lucide: 'LuSun', heroicons: 'Hi2SunIcon', phosphor: 'PhSun' },
  'moon': { feather: 'FiMoon', lucide: 'LuMoon', heroicons: 'Hi2MoonIcon', phosphor: 'PhMoon' },
  
  // Common UI Elements
  'eye': { feather: 'FiEye', lucide: 'LuEye', heroicons: 'Hi2EyeIcon', phosphor: 'PhEye' },
  'eye-off': { feather: 'FiEyeOff', lucide: 'LuEyeOff', heroicons: 'Hi2EyeSlashIcon', phosphor: 'PhEyeSlash' },
  'heart': { feather: 'FiHeart', lucide: 'LuHeart', heroicons: 'Hi2HeartIcon', phosphor: 'PhHeart' },
  'star': { feather: 'FiStar', lucide: 'LuStar', heroicons: 'Hi2StarIcon', phosphor: 'PhStar' },
  'calendar': { feather: 'FiCalendar', lucide: 'LuCalendar', heroicons: 'Hi2CalendarIcon', phosphor: 'PhCalendar' },
  'clock': { feather: 'FiClock', lucide: 'LuClock', heroicons: 'Hi2ClockIcon', phosphor: 'PhClock' }
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
      console.error(`❌ Librería de iconos "${newLibrary}" no soportada. Disponibles: ${Object.keys(ICON_LIBRARIES).join(', ')}`);
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
    library: PropTypes.oneOf(['feather', 'lucide', 'heroicons', 'phosphor']),
    customIcons: PropTypes.object,
    fallback: PropTypes.string,
    sizes: PropTypes.object,
    enableAutoMapping: PropTypes.bool,
    enableFallback: PropTypes.bool
  })
};

export default IconProvider;