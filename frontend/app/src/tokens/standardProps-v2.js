// tokens/standardProps-v2.js
// ===== PROPS ESTÁNDAR V2.0 - SISTEMA ESPECIALIZADO DE CLASE MUNDIAL =====

import PropTypes from 'prop-types';
import { 
  COMPONENT_SIZE_VALUES,
  TYPOGRAPHY_SIZE_VALUES, 
  SPACING_SIZE_VALUES,
  CONTAINER_SIZE_VALUES,
  BORDER_RADIUS_VALUES,
  SHADOW_VALUES,
  WIDTH_VALUES
} from './designTokens-v2.js';

/**
 * SISTEMA DE PROPS V2.0 - ARQUITECTURA ESPECIALIZADA
 * 
 * 🏗️ FILOSOFÍA: "Props especializadas por tipo de componente"
 * 🎯 OBJETIVO: API predecible y type-safe para cada categoría
 * 🚀 NIVEL: Competencia directa con sistemas de clase mundial
 * 
 * ✅ ESPECIALIZACIÓN: Props específicas por tipo de componente
 * ✅ RESPONSIVE: Soporte nativo para breakpoints
 * ✅ VALIDACIÓN: Type checking avanzado en desarrollo
 * ✅ MIGRACIÓN: Backward compatibility con deprecation warnings
 * ✅ PERFORMANCE: Tree-shaking friendly
 */

// ===== 🎛️ PROPS PARA COMPONENTES INTERACTIVOS =====
/**
 * Para: Button, Input, Badge, Select, etc.
 * Características: Touch targets, interacción, estados
 */
export const INTERACTIVE_COMPONENT_PROPS = {
  // Tamaño del componente (altura, padding, font-size)
  size: {
    type: 'string',
    enum: COMPONENT_SIZE_VALUES,  // ['xs', 'sm', 'md', 'lg', 'xl']
    default: 'md',
    description: 'Tamaño del componente interactivo (altura y padding proporcional)'
  },
  
  // Ancho del componente (independiente del size)
  width: {
    type: 'string|object',
    enum: WIDTH_VALUES,
    default: 'auto', 
    description: 'Ancho del componente, acepta responsive object'
  },
  
  // Estado de carga
  loading: {
    type: 'boolean',
    default: false,
    description: 'Muestra estado de carga (spinner, skeleton)'
  },
  
  // Estado deshabilitado
  disabled: {
    type: 'boolean',
    default: false,
    description: 'Deshabilita la interacción'
  }
};

// ===== 🎨 PROPS PARA COMPONENTES TIPOGRÁFICOS =====
/**
 * Para: Typography, Heading, Text, etc.
 * Características: Jerarquía visual, legibilidad, contenido
 */
export const TYPOGRAPHY_COMPONENT_PROPS = {
  // Tamaño tipográfico (escala editorial)
  size: {
    type: 'string|object',
    enum: TYPOGRAPHY_SIZE_VALUES,  // ['xs' → '6xl']
    default: 'md',
    description: 'Tamaño tipográfico según jerarquía editorial'
  },
  
  // Peso de fuente
  weight: {
    type: 'string',
    enum: ['light', 'normal', 'medium', 'semibold', 'bold'],
    default: 'normal',
    description: 'Peso de la fuente'
  },
  
  // Ancho del contenedor de texto
  width: {
    type: 'string|object', 
    enum: WIDTH_VALUES,
    default: 'auto',
    description: 'Ancho del contenedor de texto'
  },
  
  // Espaciado externo del texto
  spacing: {
    type: 'object',
    description: 'Margin responsive: { top, bottom, left, right } con breakpoints'
  }
};

// ===== 📦 PROPS PARA COMPONENTES CONTENEDORES =====
/**
 * Para: Container, FlexContainer, GridContainer, etc.
 * Características: Layout, composición, organización espacial
 */
export const CONTAINER_COMPONENT_PROPS = {
  // Tamaño del contenedor (max-width)
  size: {
    type: 'string|object',
    enum: CONTAINER_SIZE_VALUES,  // ['xs' → '6xl', 'full', 'screen']
    default: 'lg',
    description: 'Tamaño máximo del contenedor'
  },
  
  // Espaciado interno
  padding: {
    type: 'string|object',
    enum: SPACING_SIZE_VALUES,    // ['xs' → '6xl']
    default: null,
    description: 'Padding interno responsive'
  },
  
  // Espaciado entre elementos hijos
  gap: {
    type: 'string|object',
    enum: SPACING_SIZE_VALUES,
    default: null,
    description: 'Gap entre elementos hijos'
  },
  
  // Espaciado externo
  margin: {
    type: 'string|object',
    enum: SPACING_SIZE_VALUES,
    default: null,
    description: 'Margin externo responsive'
  }
};

// ===== 🎨 PROPS UNIVERSALES COMPARTIDAS =====
/**
 * Props que TODOS los componentes deben soportar
 * Características: Personalización, accesibilidad, testing
 */
export const UNIVERSAL_PROPS = {
  // Variante semántica
  variant: {
    type: 'string',
    enum: ['primary', 'secondary', 'success', 'warning', 'danger', 'neutral'],
    default: 'primary',
    description: 'Variante semántica que determina colores'
  },
  
  // Radio de bordes
  rounded: {
    type: 'string|object',
    enum: BORDER_RADIUS_VALUES,  // ['none' → '3xl', 'full']
    default: 'md',
    description: 'Radio de bordes, acepta responsive'
  },
  
  // Sombra
  shadow: {
    type: 'string',
    enum: SHADOW_VALUES,         // ['none' → '6xl']
    default: 'none',
    description: 'Nivel de sombra/elevación'
  },
  
  // Clases CSS personalizadas
  className: {
    type: 'string',
    default: '',
    description: 'Clases CSS adicionales'
  },
  
  // Estilos inline (uso limitado)
  style: {
    type: 'object',
    default: {},
    description: 'Estilos CSS inline (usar con moderación)'
  },
  
  // Testing ID
  testId: {
    type: 'string',
    description: 'ID para testing automatizado (data-testid)'
  },
  
  // Accesibilidad
  ariaLabel: {
    type: 'string',
    description: 'Label descriptivo para screen readers'
  }
};

// ===== 🔧 PROPS ESPECÍFICAS DE ICONOS =====
export const ICON_PROPS = {
  leftIcon: {
    type: 'string|ReactNode',
    description: 'Icono izquierdo (string para sistema, ReactNode para custom)'
  },
  
  rightIcon: {
    type: 'string|ReactNode', 
    description: 'Icono derecho (string para sistema, ReactNode para custom)'
  },
  
  iconOnly: {
    type: 'boolean',
    default: false,
    description: 'Solo mostrar icono, ocultar texto (Button únicamente)'
  }
};

// ===== 📱 RESPONSIVE PROPS SUPPORT =====
/**
 * Estructura para props responsive
 * Soporta breakpoints: base, sm, md, lg, xl, 2xl
 */
export const RESPONSIVE_PROP_SHAPE = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.shape({
    base: PropTypes.string,    // Valor por defecto (móvil)
    sm: PropTypes.string,      // 640px+
    md: PropTypes.string,      // 768px+  
    lg: PropTypes.string,      // 1024px+
    xl: PropTypes.string,      // 1280px+
    '2xl': PropTypes.string    // 1536px+
  })
]);

// ===== 🏷️ PROPTYPES ESPECIALIZADOS =====

// PropTypes para componentes interactivos
export const INTERACTIVE_PROP_TYPES = {
  size: PropTypes.oneOf(COMPONENT_SIZE_VALUES),
  width: RESPONSIVE_PROP_SHAPE,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  ...UNIVERSAL_PROPS,
  ...ICON_PROPS
};

// PropTypes para componentes tipográficos  
export const TYPOGRAPHY_PROP_TYPES = {
  size: RESPONSIVE_PROP_SHAPE,
  weight: PropTypes.oneOf(['light', 'normal', 'medium', 'semibold', 'bold']),
  width: RESPONSIVE_PROP_SHAPE,
  spacing: PropTypes.shape({
    top: RESPONSIVE_PROP_SHAPE,
    bottom: RESPONSIVE_PROP_SHAPE,
    left: RESPONSIVE_PROP_SHAPE,
    right: RESPONSIVE_PROP_SHAPE
  }),
  ...UNIVERSAL_PROPS
};

// PropTypes para componentes contenedores
export const CONTAINER_PROP_TYPES = {
  size: RESPONSIVE_PROP_SHAPE,
  padding: RESPONSIVE_PROP_SHAPE,
  gap: RESPONSIVE_PROP_SHAPE, 
  margin: RESPONSIVE_PROP_SHAPE,
  ...UNIVERSAL_PROPS
};

// ===== ⚠️ PROPS DEPRECADAS =====
export const DEPRECATED_PROPS_V2 = {
  // Props legacy de iconos
  icon: {
    replacement: 'leftIcon o rightIcon',
    reason: 'API inconsistente, usar props específicas'
  },
  
  iconPosition: {
    replacement: 'leftIcon o rightIcon',
    reason: 'Props específicas más claras'
  },
  
  // Props legacy de ancho
  fullWidth: {
    replacement: 'width="full"',
    reason: 'Sistema de anchos unificado'
  },
  
  // Props legacy de tamaños en Typography
  '2xl_in_component_size': {
    replacement: 'size="xl" (máximo para componentes) o migrar a Typography',
    reason: 'Separación entre escalas de componentes vs tipográficas'
  },
  
  // Props legacy de variantes
  'variant.default': {
    replacement: 'variant="primary"',
    reason: 'Estandarización de variantes'
  },
  
  'variant.info': {
    replacement: 'variant="primary" o variant="neutral"',
    reason: 'Reducción a 6 variantes core'
  }
};

// ===== 🔍 VALIDACIÓN AVANZADA V2 =====

/**
 * Validador avanzado con soporte responsive y tipos especializados
 */
export const validateStandardPropsV2 = (props, componentName = 'Component', componentType = 'interactive') => {
  if (!import.meta.env?.DEV) {
    return props; // Solo en desarrollo
  }

  const warnings = [];
  const validatedProps = { ...props };

  // Seleccionar validaciones según tipo de componente
  const validationRules = {
    interactive: {
      size: COMPONENT_SIZE_VALUES,
      allowedProps: INTERACTIVE_COMPONENT_PROPS
    },
    typography: {
      size: TYPOGRAPHY_SIZE_VALUES,
      allowedProps: TYPOGRAPHY_COMPONENT_PROPS  
    },
    container: {
      size: CONTAINER_SIZE_VALUES,
      allowedProps: CONTAINER_COMPONENT_PROPS
    }
  };

  const rules = validationRules[componentType] || validationRules.interactive;

  // Validar size según tipo de componente
  if (props.size) {
    const sizeValue = getResponsiveValue(props.size);
    if (sizeValue && !rules.size.includes(sizeValue)) {
      warnings.push(
        `${componentName} (${componentType}): size="${sizeValue}" no válido. ` +
        `Usar: ${rules.size.join(', ')}`
      );
    }
  }

  // Validar width universal
  if (props.width) {
    const widthValue = getResponsiveValue(props.width);
    if (widthValue && !WIDTH_VALUES.includes(widthValue)) {
      warnings.push(
        `${componentName}: width="${widthValue}" no válido. ` +
        `Usar: ${WIDTH_VALUES.slice(0, 6).join(', ')}...`
      );
    }
  }

  // Validar props deprecadas
  Object.keys(DEPRECATED_PROPS_V2).forEach(deprecatedProp => {
    if (Object.prototype.hasOwnProperty.call(props, deprecatedProp)) {
      const { replacement, reason } = DEPRECATED_PROPS_V2[deprecatedProp];
      warnings.push(
        `${componentName}: prop "${deprecatedProp}" deprecada. ${reason}. ` +
        `Usar: ${replacement}`
      );
    }
  });

  // Validar uso incorrecto de tamaños tipográficos en componentes
  if (componentType === 'interactive' && props.size) {
    const sizeValue = getResponsiveValue(props.size);
    if (['2xl', '3xl', '4xl', '5xl', '6xl'].includes(sizeValue)) {
      warnings.push(
        `${componentName}: size="${sizeValue}" no disponible para componentes interactivos. ` +
        `Máximo: xl. Para texto grande usar componente Typography.`
      );
    }
  }

  // Mostrar warnings agrupados
  if (warnings.length > 0) {
    console.group(`⚠️ ${componentName} - Props Warnings (V2)`);
    warnings.forEach(warning => console.warn(warning));
    console.groupEnd();
  }

  return validatedProps;
};

/**
 * Helper para obtener valor responsive
 */
export const getResponsiveValue = (prop, breakpoint = 'base') => {
  if (typeof prop === 'string') return prop;
  if (typeof prop === 'object' && prop !== null) {
    return prop[breakpoint] || prop.base || Object.values(prop)[0];
  }
  return prop;
};

/**
 * Extrae props estándar según tipo de componente
 */
export const extractStandardPropsV2 = (props, componentType = 'interactive') => {
  const standardPropKeys = {
    interactive: Object.keys(INTERACTIVE_COMPONENT_PROPS),
    typography: Object.keys(TYPOGRAPHY_COMPONENT_PROPS),
    container: Object.keys(CONTAINER_COMPONENT_PROPS)
  };

  const universalKeys = Object.keys(UNIVERSAL_PROPS);
  const iconKeys = Object.keys(ICON_PROPS);
  
  const allowedKeys = [
    ...standardPropKeys[componentType] || [],
    ...universalKeys,
    ...(componentType === 'interactive' ? iconKeys : [])
  ];

  const standardProps = {};
  allowedKeys.forEach(key => {
    if (props[key] !== undefined) {
      standardProps[key] = props[key];
    }
  });

  return standardProps;
};

/**
 * Extrae props DOM-safe (filtra props del sistema de diseño)
 */
export const extractDOMPropsV2 = (props) => {
  const {
    // Props del sistema V2 (NO van al DOM)
    size, width, weight, spacing, padding, gap, margin,
    variant, rounded, shadow, loading, leftIcon, rightIcon, iconOnly,
    
    // Props adicionales computadas del hook V2 (NO van al DOM)
    tokens, renderIcon, hasLeftIcon, hasRightIcon, hasAnyIcon,
    isDisabled, isLoading, isEmpty, isInteractive,
    generateClassName, generateStyles, currentBreakpoint, componentType,
    
    // ❌ PROPS LEGACY (NO van al DOM)
    icon, iconPosition, fullWidth, text,
    
    // Props específicas de Typography (NO van al DOM)
    as, element, align, color, truncate, italic, underline, 
    lineHeight, maxLines, uppercase, lowercase,
    
    // Props específicas de GridContainer (NO van al DOM)
    columns, minColumnWidth, rows, columnGap, rowGap, autoRows, areas, inline, dense,
    
    // Props específicas de FlexContainer (NO van al DOM)
    direction, justify, wrap, grow, shrink, distribute,
    
    // Props que SÍ van al DOM (con transformación)
    className, style, disabled, ariaLabel, testId,
    ...domProps
  } = props;

  // Marcar como usadas (evitar warnings de linting)
  void size; void width; void weight; void spacing; void padding; void gap; void margin;
  void variant; void rounded; void shadow; void loading; void leftIcon; void rightIcon; void iconOnly;
  void tokens; void renderIcon; void hasLeftIcon; void hasRightIcon; void hasAnyIcon;
  void isDisabled; void isLoading; void isEmpty; void isInteractive;
  void generateClassName; void generateStyles; void currentBreakpoint; void componentType;
  // Props legacy
  void icon; void iconPosition; void fullWidth; void text;
  void as; void element; void align; void color; void truncate; void italic; void underline;
  void lineHeight; void maxLines; void uppercase; void lowercase;
  void columns; void minColumnWidth; void rows; void columnGap; void rowGap; void autoRows; 
  void areas; void inline; void dense; void direction; void justify; void wrap; void grow; 
  void shrink; void distribute;

  // Crear props DOM seguras
  const safeDOMProps = {
    ...domProps,
    className,
    style,
    disabled
  };

  // Agregar props de accesibilidad
  if (ariaLabel) safeDOMProps['aria-label'] = ariaLabel;
  if (testId) safeDOMProps['data-testid'] = testId;

  return safeDOMProps;
};

// ===== 📦 EXPORT PRINCIPAL V2 =====

export const STANDARD_PROPS_V2 = {
  // Props por tipo de componente
  interactive: INTERACTIVE_COMPONENT_PROPS,
  typography: TYPOGRAPHY_COMPONENT_PROPS,
  container: CONTAINER_COMPONENT_PROPS,
  universal: UNIVERSAL_PROPS,
  icons: ICON_PROPS,
  
  // PropTypes especializados
  propTypes: {
    interactive: INTERACTIVE_PROP_TYPES,
    typography: TYPOGRAPHY_PROP_TYPES,
    container: CONTAINER_PROP_TYPES
  },
  
  // Helpers
  validate: validateStandardPropsV2,
  extract: extractStandardPropsV2,
  extractDOM: extractDOMPropsV2,
  getResponsive: getResponsiveValue
};

// ===== 🚀 EXPORT PARA BACKWARD COMPATIBILITY =====

// Mantener exports legacy para migración gradual
export const STANDARD_SIZES = COMPONENT_SIZE_VALUES;
export const STANDARD_VARIANTS = ['primary', 'secondary', 'success', 'warning', 'danger', 'neutral'];
export const STANDARD_ROUNDED = BORDER_RADIUS_VALUES;
export const STANDARD_WIDTHS = WIDTH_VALUES;

export default STANDARD_PROPS_V2;