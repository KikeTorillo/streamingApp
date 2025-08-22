// utils/iconHelpers.js
// Utilidades centralizadas para manejo de iconos en el sistema de diseño

import React from 'react';
import { Icon } from '../components/atoms/Icon/Icon';

/**
 * Crea una función de renderizado de iconos personalizada para cada componente
 * 
 * @param {string} defaultSize - Tamaño por defecto del icono ('xs', 'sm', 'md', 'lg', 'xl')
 * @param {Object} sizeMap - Mapeo de tamaños del componente padre a tamaños del Icon
 * @returns {Function} Función que renderiza iconos
 * 
 * @example
 * // En Button component:
 * const renderIcon = createIconRenderer('sm', {
 *   xs: 'xs',    // Button xs usa Icon xs
 *   sm: 'xs',    // Button sm usa Icon xs  
 *   md: 'sm',    // Button md usa Icon sm
 *   lg: 'sm',    // Button lg usa Icon sm
 *   xl: 'md'     // Button xl usa Icon md
 * });
 * 
 * // Uso:
 * renderIcon('users') // → <Icon name="users" size="sm" />
 * renderIcon('users', 'lg') // → <Icon name="users" size="lg" />
 * renderIcon('users', 'lg', 'danger') // → <Icon name="users" size="lg" color="danger" />
 */
export const createIconRenderer = (defaultSize = 'sm', sizeMap = {}) => {
  const IconRenderer = (iconProp, overrideSize, overrideColor, overrideProps = {}) => {
    // Si no hay icono, no renderizar nada
    if (!iconProp) return null;
    
    // Si ya es un componente React, devolverlo tal como está (retrocompatibilidad)
    if (React.isValidElement(iconProp)) return iconProp;
    
    // Si es string, crear componente Icon del sistema de diseño
    if (typeof iconProp === 'string') {
      // Resolver el tamaño final
      const finalSize = overrideSize || sizeMap[defaultSize] || defaultSize;
      
      return React.createElement(Icon, {
        name: iconProp,
        size: finalSize,
        color: overrideColor,
        ...overrideProps
      });
    }
    
    // Para cualquier otro tipo, retornar null
    return null;
  };
  
  IconRenderer.displayName = `IconRenderer(${defaultSize})`;
  return IconRenderer;
};

/**
 * Mapeos contextuales inteligentes para componentes
 * Sistema unificado que determina automáticamente el tamaño de icono óptimo
 * según el contexto y tamaño del componente padre
 */
export const CONTEXT_ICON_MAPS = {
  // ===== COMPONENTES QUE NECESITAN ICONOS PEQUEÑOS =====
  
  // Label: iconos siempre pequeños para no dominar el texto
  label: {
    xs: 'xs',  // 12px
    sm: 'xs',  // 12px
    md: 'xs',  // 12px
    lg: 'sm',  // 16px
    xl: 'sm'   // 16px
  },
  
  // Badge: siempre iconos pequeños
  badge: {
    xs: 'xs',  // 12px
    sm: 'xs',  // 12px
    md: 'xs',  // 12px
    lg: 'sm',  // 16px
    xl: 'sm'   // 16px
  },

  // ===== COMPONENTES QUE ESCALAN CON EL TAMAÑO =====
  
  // Button: iconos progresivamente más grandes
  button: {
    xs: 'xs',  // 12px
    sm: 'xs',  // 12px
    md: 'sm',  // 16px
    lg: 'sm',  // 16px
    xl: 'md'   // 20px
  },
  
  // Input: iconos medianos para visibilidad
  input: {
    xs: 'xs',  // 12px
    sm: 'sm',  // 16px
    md: 'sm',  // 16px
    lg: 'md',  // 20px
    xl: 'md'   // 20px
  },

  // ===== COMPONENTES QUE NECESITAN ICONOS MEDIANOS =====
  
  // DataTable: iconos medianos para buena visibilidad en contextos complejos
  datatable: {
    xs: 'sm',  // 16px
    sm: 'sm',  // 16px
    md: 'sm',  // 16px
    lg: 'md',  // 20px
    xl: 'md'   // 20px
  },
  
  // Card: iconos medianos/grandes para destacar
  card: {
    xs: 'sm',  // 16px
    sm: 'sm',  // 16px
    md: 'md',  // 20px
    lg: 'lg',  // 24px
    xl: 'lg'   // 24px
  },

  // Modal: iconos pequeños para botón de cerrar
  modal: {
    xs: 'xs',  // 12px
    sm: 'sm',  // 16px
    md: 'sm',  // 16px
    lg: 'sm',  // 16px
    xl: 'md'   // 20px
  },

  // AlertModal: iconos medianos para buena visibilidad
  'alert-modal': {
    xs: 'sm',  // 16px
    sm: 'md',  // 20px
    md: 'md',  // 20px
    lg: 'lg',  // 24px
    xl: 'lg'   // 24px
  },

  // ===== COMPONENTES LEGACY (MANTENER COMPATIBILIDAD) =====
  
  // StatsCard: iconos medianos/grandes para destacar
  statsCard: {
    sm: 'md',  // 20px
    md: 'lg',  // 24px
    lg: 'xl'   // 28px
  },
  
  // Sidebar: iconos pequeños/medianos
  sidebar: {
    collapsed: 'sm',  // 16px
    expanded: 'sm',   // 16px
    submenu: 'xs'     // 12px
  },

  // FilterBar: iconos pequeños para no dominar los botones
  filterBar: {
    xs: 'xs',  // 12px
    sm: 'xs',  // 12px
    md: 'sm',  // 16px
    lg: 'sm',  // 16px
    xl: 'md'   // 20px
  },
  
  // Avatar: iconos proporcionales al tamaño del avatar
  avatar: {
    xs: 'xs',  // 12px
    sm: 'xs',  // 12px
    md: 'sm',  // 16px
    lg: 'md',  // 20px
    xl: 'lg'   // 24px
  },

  // ===== CONTEXTO GENÉRICO =====
  
  // Generic: para componentes no especificados
  generic: {
    xs: 'xs',  // 12px
    sm: 'sm',  // 16px
    md: 'sm',  // 16px
    lg: 'md',  // 20px
    xl: 'lg'   // 24px
  }
};

/**
 * BACKWARD COMPATIBILITY: Mapeo de nombres legacy
 * Permite que componentes existentes sigan funcionando sin cambios
 */
export const COMPONENT_SIZE_MAPS = CONTEXT_ICON_MAPS;

/**
 * Función de conveniencia para crear renderizadores con mapeos contextuales inteligentes
 * 
 * ✅ SISTEMA CONTEXTUAL: Determina automáticamente el tamaño óptimo según el contexto
 * ✅ BACKWARD COMPATIBLE: Componentes existentes siguen funcionando
 * ✅ OVERRIDE DISPONIBLE: Permite especificar tamaño manual si es necesario
 * 
 * @param {string} context - Contexto del componente ('label', 'datatable', 'button', 'badge', etc.)
 * @param {string} componentSize - Tamaño del componente padre ('xs', 'sm', 'md', 'lg', 'xl')
 * @returns {Function} Función renderizadora contextual
 * 
 * @example
 * // DataTable automáticamente usa iconos medianos
 * const renderIcon = createStandardIconRenderer('datatable', 'md');
 * renderIcon('search'); // → <Icon name="search" size="sm" /> (16px)
 * 
 * // Label automáticamente usa iconos pequeños  
 * const renderIcon = createStandardIconRenderer('label', 'md');
 * renderIcon('video'); // → <Icon name="video" size="xs" /> (12px)
 * 
 * // Override manual disponible
 * renderIcon('video', 'lg'); // → <Icon name="video" size="lg" /> (24px)
 */
export const createStandardIconRenderer = (context = 'generic', componentSize = 'md') => {
  // Obtener mapeo contextual o usar generic como fallback
  const contextMap = CONTEXT_ICON_MAPS[context] || CONTEXT_ICON_MAPS.generic;
  
  // Determinar tamaño automático del icono basado en el contexto y tamaño del componente
  const autoIconSize = contextMap[componentSize] || contextMap.md || 'sm';
  
  const ContextualIconRenderer = (iconName, overrideSize, overrideColor, overrideProps = {}) => {
    // Si no hay icono, no renderizar nada
    if (!iconName) return null;
    
    // Si ya es un componente React, devolverlo tal como está (retrocompatibilidad)
    if (React.isValidElement(iconName)) return iconName;
    
    // Si es string, crear componente Icon del sistema de diseño
    if (typeof iconName === 'string') {
      // Usar tamaño override o tamaño automático contextual
      const finalSize = overrideSize || autoIconSize;
      
      // ✅ USAR ICON DEL SISTEMA DE DISEÑO (ahora siempre es el mejorado)
      return React.createElement(Icon, {
        name: iconName,
        size: finalSize,
        variant: overrideColor, // Nueva API usa variant
        ...overrideProps
      });
    }
    
    // Para cualquier otro tipo, retornar null
    return null;
  };

  ContextualIconRenderer.displayName = `ContextualIconRenderer(${context}:${componentSize})`;
  return ContextualIconRenderer;
};

/**
 * Hook personalizado para usar iconos contextuales en componentes funcionales
 * 
 * ✅ AUTOMÁTICO: Iconos del tamaño óptimo según el contexto
 * ✅ MEMOIZADO: Performance optimizada con React.useMemo
 * ✅ TYPESAFE: Contextos predefinidos para evitar errores
 * 
 * @param {string} context - Contexto del componente ('label', 'datatable', 'button', 'badge', etc.)
 * @param {string} componentSize - Tamaño del componente padre ('xs', 'sm', 'md', 'lg', 'xl')
 * @returns {Function} Función renderizadora contextual memoizada
 * 
 * @example
 * function MyLabel({ leftIcon, size = 'md' }) {
 *   const renderIcon = useIconRenderer('label', size);
 *   return <label>{renderIcon(leftIcon)} {children}</label>;
 * }
 * 
 * function MyDataTable({ size = 'md' }) {
 *   const renderIcon = useIconRenderer('datatable', size);
 *   return <div>{renderIcon('search')}</div>; // Automáticamente 16px
 * }
 */
export const useIconRenderer = (context = 'generic', componentSize = 'md') => {
  return React.useMemo(() => {
    return createStandardIconRenderer(context, componentSize);
  }, [context, componentSize]);
};

/**
 * BACKWARD COMPATIBILITY: Alias para componentes legacy
 * @deprecated Usar useIconRenderer en su lugar
 */
export const useIconRendererLegacy = (componentType, defaultSize = 'sm') => {
  console.warn('[useIconRendererLegacy] DEPRECATED: Usar useIconRenderer(context, componentSize) en su lugar');
  return useIconRenderer(componentType, defaultSize);
};