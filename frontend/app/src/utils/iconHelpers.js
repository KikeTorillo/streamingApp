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
 * Mapeos de tamaños predefinidos para componentes comunes
 * Cada componente puede usar estos mapeos o definir los suyos propios
 */
export const COMPONENT_SIZE_MAPS = {
  // Button: iconos progresivamente más grandes
  button: {
    xs: 'xs',
    sm: 'xs', 
    md: 'sm',
    lg: 'sm',
    xl: 'md'
  },
  
  // Badge: siempre iconos pequeños
  badge: {
    xs: 'xs',
    sm: 'xs',
    md: 'xs', 
    lg: 'sm',
    xl: 'sm'
  },
  
  // StatsCard: iconos medianos/grandes para destacar
  statsCard: {
    sm: 'md',
    md: 'lg',
    lg: 'xl'
  },
  
  // Sidebar: iconos pequeños/medianos
  sidebar: {
    collapsed: 'sm',
    expanded: 'sm',
    submenu: 'xs'
  },

  // FilterBar: iconos pequeños para no dominar los botones
  filterBar: {
    xs: 'xs',
    sm: 'xs', 
    md: 'sm',
    lg: 'sm',
    xl: 'md'
  }
};

/**
 * Función de conveniencia para crear renderizadores con mapeos predefinidos
 * 
 * @param {string} componentType - Tipo de componente ('button', 'badge', 'statsCard', 'sidebar')
 * @param {string} defaultSize - Tamaño por defecto
 * @returns {Function} Función renderizadora configurada
 * 
 * @example
 * const renderIcon = createStandardIconRenderer('button', 'md');
 */
export const createStandardIconRenderer = (componentType, defaultSize = 'sm') => {
  const sizeMap = COMPONENT_SIZE_MAPS[componentType] || {};
  return createIconRenderer(defaultSize, sizeMap);
};

/**
 * Hook personalizado para usar iconos en componentes funcionales
 * 
 * @param {string} componentType - Tipo de componente
 * @param {string} defaultSize - Tamaño por defecto
 * @returns {Function} Función renderizadora
 * 
 * @example
 * function MyButton({ leftIcon, size }) {
 *   const renderIcon = useIconRenderer('button', size);
 *   return <button>{renderIcon(leftIcon)}</button>;
 * }
 */
export const useIconRenderer = (componentType, defaultSize = 'sm') => {
  return React.useMemo(() => {
    return createStandardIconRenderer(componentType, defaultSize);
  }, [componentType, defaultSize]);
};