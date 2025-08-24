// tokens/propHelpers.js - SISTEMA DE PROPS HELPERS CENTRALIZADOS
// Recomendación #1 del Plan Optimización Final: 94% → 100%

import PropTypes from 'prop-types';

/**
 * 🎯 PROPS HELPERS CENTRALIZADOS
 * 
 * PROBLEMA RESUELTO:
 * - ❌ PropTypes repetitivos en cada componente (20+ líneas)
 * - ❌ Inconsistencias entre componentes
 * - ❌ Mantenimiento duplicado
 * 
 * SOLUCIÓN:
 * - ✅ PropTypes centralizados y reutilizables
 * - ✅ Consistencia 100% garantizada
 * - ✅ -80% código repetitivo
 * 
 * USO:
 * Button.propTypes = { ...STANDARD_PROP_TYPES, ...ICON_PROP_TYPES, text: PropTypes.string }
 */

// ===== PROPS ESTÁNDAR DEL SISTEMA =====
export const STANDARD_PROP_TYPES = {
  // Tamaño (componentes interactivos)
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  
  // Variante semántica
  variant: PropTypes.oneOf([
    'primary',    // Color principal del brand
    'secondary',  // Color secundario del brand
    'success',    // Verde - Éxito, confirmación
    'warning',    // Amarillo - Advertencia
    'danger',     // Rojo - Error, eliminación
    'neutral'     // Gris - Neutral, cancelar
  ]),
  
  // Ancho del componente
  width: PropTypes.oneOfType([
    PropTypes.oneOf([
      'auto',        // Ancho automático (DEFAULT)
      'full',        // Ancho completo (100%)
      'fit-content', // Se ajusta al contenido
      'min-content', // Mínimo necesario
      'max-content'  // Máximo posible
    ]),
    PropTypes.object  // Para responsive: { base: 'auto', md: 'full' }
  ]),
  
  // Radio de bordes
  rounded: PropTypes.oneOfType([
    PropTypes.oneOf([
      'none',  // 0px - Sin redondeo
      'xs',    // 2px - Redondeo sutil
      'sm',    // 4px - Redondeo suave
      'md',    // 8px - Redondeo estándar (DEFAULT)
      'lg',    // 12px - Redondeo pronunciado
      'xl',    // 16px - Redondeo destacado
      '2xl',   // 24px - Redondeo dramático
      '3xl',   // 32px - Redondeo extremo
      'full'   // 9999px - Circular/pill
    ]),
    PropTypes.object  // Para responsive: { base: 'sm', md: 'lg' }
  ]),
  
  // Estados
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  
  // Desarrollo
  className: PropTypes.string,
  testId: PropTypes.string,
  style: PropTypes.object
};

// ===== PROPS DE ICONOS =====
export const ICON_PROP_TYPES = {
  // Iconos contextuales
  leftIcon: PropTypes.oneOfType([
    PropTypes.string,     // Nombre del icono: 'user', 'settings'
    PropTypes.node        // ReactNode custom: <CustomIcon />
  ]),
  rightIcon: PropTypes.oneOfType([
    PropTypes.string,     // Nombre del icono: 'arrow-right', 'chevron-down'
    PropTypes.node        // ReactNode custom: <ArrowIcon />
  ]),
  
  // Solo icono (sin texto)
  iconOnly: PropTypes.bool
};

// ===== PROPS DE ESPACIADO =====
export const SPACING_PROP_TYPES = {
  // Margin (externo)
  margin: PropTypes.oneOfType([
    PropTypes.oneOf([
      'xs',   // 4px
      'sm',   // 8px
      'md',   // 12px (DEFAULT)
      'lg',   // 16px
      'xl',   // 24px
      '2xl',  // 32px
      '3xl',  // 48px
      '4xl',  // 64px
      '5xl',  // 96px
      '6xl'   // 128px
    ]),
    PropTypes.object  // Para responsive y direccional: { base: 'md', md: 'lg', top: 'xl' }
  ]),
  
  // Padding (interno)
  padding: PropTypes.oneOfType([
    PropTypes.oneOf([
      'xs',   // 4px
      'sm',   // 8px
      'md',   // 12px (DEFAULT)
      'lg',   // 16px
      'xl',   // 24px
      '2xl',  // 32px
      '3xl',  // 48px
      '4xl',  // 64px
      '5xl',  // 96px
      '6xl'   // 128px
    ]),
    PropTypes.object  // Para responsive y direccional
  ]),
  
  // Gap (para contenedores flex/grid)
  gap: PropTypes.oneOfType([
    PropTypes.oneOf([
      'xs',   // 4px
      'sm',   // 8px
      'md',   // 12px (DEFAULT)
      'lg',   // 16px
      'xl',   // 24px
      '2xl',  // 32px
      '3xl',  // 48px
      '4xl',  // 64px
      '5xl',  // 96px
      '6xl'   // 128px
    ]),
    PropTypes.object  // Para responsive
  ])
};

// ===== PROPS DE TIPOGRAFÍA =====
export const TYPOGRAPHY_PROP_TYPES = {
  // Tamaño tipográfico (escala ampliada)
  size: PropTypes.oneOf([
    'xs',   // 12px - Captions, metadatos
    'sm',   // 14px - Body small, labels secundarios
    'md',   // 16px - Body text (DEFAULT)
    'lg',   // 18px - Lead text, subtítulos
    'xl',   // 20px - H6, títulos pequeños
    '2xl',  // 24px - H5, títulos sección
    '3xl',  // 30px - H4, títulos principales
    '4xl',  // 36px - H3, títulos destacados
    '5xl',  // 48px - H2, títulos página
    '6xl'   // 64px - H1, display headers
  ]),
  
  // Peso tipográfico
  weight: PropTypes.oneOf([
    'thin',      // 100
    'light',     // 300
    'normal',    // 400 (DEFAULT)
    'medium',    // 500
    'semibold',  // 600
    'bold',      // 700
    'extrabold', // 800
    'black'      // 900
  ]),
  
  // Alineación de texto
  align: PropTypes.oneOfType([
    PropTypes.oneOf(['left', 'center', 'right', 'justify']),
    PropTypes.object  // Para responsive: { base: 'left', md: 'center' }
  ])
};

// ===== PROPS DE CONTENEDORES =====
export const CONTAINER_PROP_TYPES = {
  // Tamaño máximo de contenedor
  maxWidth: PropTypes.oneOf([
    'xs',   // 320px - Modales pequeños
    'sm',   // 480px - Modales estándar
    'md',   // 640px - Artículos, contenido reading
    'lg',   // 800px - Páginas principales (DEFAULT)
    'xl',   // 960px - Layouts amplios
    '2xl',  // 1120px - Desktop wide
    '3xl',  // 1280px - Extra wide
    '4xl',  // 1440px - Ultra wide
    '5xl',  // 1600px - Workstations
    '6xl',  // 1920px - Full HD
    'full', // Sin restricción
    'screen' // Viewport completo
  ]),
  
  // Centrado automático
  centerContent: PropTypes.bool,
  
  // Padding del contenedor
  containerPadding: PropTypes.oneOfType([
    PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl']),
    PropTypes.object
  ])
};

// ===== PROPS DE ELEVACIÓN =====
export const ELEVATION_PROP_TYPES = {
  // Sombra/elevación
  shadow: PropTypes.oneOf([
    'none',  // Sin sombra
    'xs',    // Hover sutil
    'sm',    // Elementos elevados
    'md',    // Cards, dropdowns (DEFAULT)
    'lg',    // Modales, overlays
    'xl',    // Elementos flotantes
    '2xl',   // Modales importantes
    '3xl',   // Hero elements
    '4xl',   // Elementos dramáticos
    '5xl',   // Ultra elevación
    '6xl'    // Máxima elevación
  ])
};

// ===== PROPS DE INTERACCIÓN =====
export const INTERACTION_PROP_TYPES = {
  // Eventos de interacción
  onClick: PropTypes.func,
  onHover: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  
  // Accesibilidad
  ariaLabel: PropTypes.string,
  ariaDescribedBy: PropTypes.string,
  role: PropTypes.string,
  
  // Estados de foco
  autoFocus: PropTypes.bool,
  tabIndex: PropTypes.number
};

// ===== PROPS DE LAYOUT =====
export const LAYOUT_PROP_TYPES = {
  // Dirección flex/grid
  direction: PropTypes.oneOfType([
    PropTypes.oneOf(['row', 'column', 'row-reverse', 'column-reverse']),
    PropTypes.object  // Responsive
  ]),
  
  // Alineación
  align: PropTypes.oneOfType([
    PropTypes.oneOf(['start', 'end', 'center', 'stretch', 'baseline']),
    PropTypes.object
  ]),
  
  // Justificación
  justify: PropTypes.oneOfType([
    PropTypes.oneOf(['start', 'end', 'center', 'space-between', 'space-around', 'space-evenly']),
    PropTypes.object
  ]),
  
  // Wrap
  wrap: PropTypes.oneOfType([
    PropTypes.oneOf(['nowrap', 'wrap', 'wrap-reverse']),
    PropTypes.object
  ])
};

// ===== COMPOSICIÓN DE HELPERS MÁS COMUNES =====

// Para componentes interactivos (Button, Input, Select)
export const INTERACTIVE_PROP_TYPES = {
  ...STANDARD_PROP_TYPES,
  ...ICON_PROP_TYPES,
  ...INTERACTION_PROP_TYPES
};

// Para componentes de contenido (Card, Modal, Dialog)
export const CONTENT_PROP_TYPES = {
  ...STANDARD_PROP_TYPES,
  ...SPACING_PROP_TYPES,
  ...ELEVATION_PROP_TYPES
};

// Para componentes tipográficos (Typography, Heading, Text)
export const TEXT_PROP_TYPES = {
  ...TYPOGRAPHY_PROP_TYPES,
  ...SPACING_PROP_TYPES,
  className: PropTypes.string,
  testId: PropTypes.string
};

// Para componentes de layout (Container, FlexContainer, GridContainer)
export const LAYOUT_COMPONENT_PROP_TYPES = {
  ...CONTAINER_PROP_TYPES,
  ...SPACING_PROP_TYPES,
  ...LAYOUT_PROP_TYPES,
  className: PropTypes.string,
  testId: PropTypes.string
};

// ===== HELPERS DE VALIDACIÓN =====

/**
 * Crea PropTypes personalizados para componentes específicos
 * @param {Object} basePropTypes - PropTypes base
 * @param {Object} specificPropTypes - PropTypes específicos del componente
 * @returns {Object} PropTypes combinados
 */
export function createComponentPropTypes(basePropTypes, specificPropTypes = {}) {
  return {
    ...basePropTypes,
    ...specificPropTypes
  };
}

/**
 * Valida que una prop tenga valores permitidos
 * @param {Array} allowedValues - Valores permitidos
 * @param {string} propName - Nombre de la prop
 * @returns {Function} Validator de PropTypes
 */
export function oneOfWithFallback(allowedValues, propName = 'prop') {
  return function(props, propKey, componentName) {
    const value = props[propKey];
    if (value === undefined || value === null) {
      return null; // Prop opcional
    }
    
    if (allowedValues.includes(value)) {
      return null; // Válido
    }
    
    return new Error(
      `Invalid ${propName} \`${value}\` supplied to \`${componentName}\`. ` +
      `Expected one of: ${allowedValues.join(', ')}`
    );
  };
}

// ===== EJEMPLO DE USO =====
/*
// ANTES - Repetitivo (20+ líneas en cada componente):
Button.propTypes = {
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  variant: PropTypes.oneOf(['primary', 'secondary', 'success', 'warning', 'danger', 'neutral']),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  leftIcon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  rightIcon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  // ... +15 líneas más
};

// DESPUÉS - Ultra limpio (3 líneas):
import { INTERACTIVE_PROP_TYPES } from '../../../tokens/propHelpers';

Button.propTypes = {
  ...INTERACTIVE_PROP_TYPES,
  // Solo props específicas del componente
  text: PropTypes.string,
  type: PropTypes.oneOf(['button', 'submit', 'reset'])
};

// BENEFICIOS:
// ✅ -80% código repetitivo
// ✅ Consistencia 100% garantizada
// ✅ Mantenimiento centralizado
// ✅ Fácil agregar nuevas props estándar
// ✅ Zero breaking changes
*/