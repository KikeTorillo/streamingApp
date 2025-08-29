// tokens/propHelpers.js - SISTEMA MINIMALISTA PARA INPUT
// Empezamos simple y crecemos paso a paso

import PropTypes from 'prop-types';

/**
 * 🎯 PROPS BÁSICOS PARA INPUT
 * Comenzamos con lo mínimo que funciona
 */

// ===== PROPS ESTÁNDAR BÁSICOS =====
export const STANDARD_PROP_TYPES = {
  // Tamaño básico para Input
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  
  // Variante básica para Input
  variant: PropTypes.oneOf([
    'primary',
    'secondary', 
    'success',
    'warning',
    'danger',
    'neutral'
  ]),
  
  // Ancho para Input (simple)
  width: PropTypes.oneOfType([
    PropTypes.oneOf([
      'auto',
      'full',
      'fit-content',
      'min-content', 
      'max-content',
      'xs',
      'sm',
      'md',
      'lg',
      'xl'
    ]),
    PropTypes.object
  ]),
  
  // Radio de bordes básico
  rounded: PropTypes.oneOf([
    'none',
    'xs',
    'sm', 
    'md',
    'lg',
    'xl',
    '2xl',
    '3xl',
    'full'
  ]),
  
  // Estados básicos
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  
  // Básicos para desarrollo
  className: PropTypes.string,
  style: PropTypes.object
};

// ===== PROPS DE ICONOS PARA INPUT =====
export const ICON_PROP_TYPES = {
  leftIcon: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ]),
  rightIcon: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ])
};

// ===== PROPS INTERACTIVOS (PARA INPUT) =====
export const INTERACTIVE_PROP_TYPES = {
  ...STANDARD_PROP_TYPES,
  ...ICON_PROP_TYPES
};

// ===== FUNCIÓN SIMPLE PARA FILTRAR PROPS DOM =====
export const extractDOMPropsV2 = (props) => {
  const {
    // Filtrar props del design system
    size, variant, rounded, width, disabled, loading,
    leftIcon, rightIcon,
    className, style,
    // El resto son props DOM válidas
    ...domProps
  } = props;

  return domProps;
};

// ===== FUNCIÓN SIMPLE DE VALIDACIÓN =====
export const validateStandardProps = (props, componentName = 'Component') => {
  // Por ahora solo retornamos las props tal como están
  // Más tarde agregaremos validaciones
  return props;
};

// ===== EXPORTS ADICIONALES PARA COMPATIBILIDAD =====
// Por si otros componentes los necesitan (como DataTable)
export const TEXT_PROP_TYPES = STANDARD_PROP_TYPES;
export const TYPOGRAPHY_PROP_TYPES = STANDARD_PROP_TYPES;
export const CONTENT_PROP_TYPES = STANDARD_PROP_TYPES;
export const SPACING_PROP_TYPES = {};
export const INTERACTION_PROP_TYPES = {};

// Para DataTable específicamente
export const CONTAINER_PROP_TYPES = {
  ...STANDARD_PROP_TYPES,
  // Básicos para contenedores
  maxWidth: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', 'full']),
  padding: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  margin: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl'])
};

export const LAYOUT_COMPONENT_PROP_TYPES = CONTAINER_PROP_TYPES;