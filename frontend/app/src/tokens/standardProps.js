// tokens/standardProps.js
// ===== STANDARD PROPS INTERFACE - SISTEMA DE DISEÑO =====
import PropTypes from 'prop-types';

/**
 * Props base obligatorias para TODOS los componentes del sistema de diseño
 * 
 * ✅ CONSISTENCIA: Mismas props disponibles en todos los componentes
 * ✅ ESCALABILIDAD: Fácil agregar nuevos tamaños/variantes 
 * ✅ PREDICTIBILIDAD: Developers saben qué esperar
 * ✅ MANTENIBILIDAD: Un solo lugar para cambiar APIs
 */

/**
 * Tamaños estándar del sistema de diseño
 * Disponibles en TODOS los componentes
 */
export const STANDARD_SIZES = {
  xs: 'xs',
  sm: 'sm', 
  md: 'md',   // Tamaño por defecto recomendado
  lg: 'lg',
  xl: 'xl'
};

/**
 * Variantes semánticas estándar
 * Reducidas a 6 core variants para consistencia
 */
export const STANDARD_VARIANTS = {
  primary: 'primary',     // Acción principal - azul oceánico
  secondary: 'secondary', // Acción secundaria - naranja/dorado
  success: 'success',     // Éxito - verde o azul success
  warning: 'warning',     // Advertencia - amarillo/dorado
  danger: 'danger',       // Error/eliminar - rojo
  neutral: 'neutral'      // Neutro - gris
};

/**
 * Radios de borde estándar
 * Consistentes con las variables CSS del sistema
 */
export const STANDARD_ROUNDED = {
  sm: 'sm',     // 0.6rem
  md: 'md',     // 1.2rem - Por defecto recomendado
  lg: 'lg',     // 1.8rem
  xl: 'xl',     // 2.4rem
  full: 'full'  // 9999px - Circular
};

/**
 * Props base que TODOS los componentes deben soportar
 * 
 * @typedef {Object} StandardProps
 * @property {'xs'|'sm'|'md'|'lg'|'xl'} [size='md'] - Tamaño del componente
 * @property {'primary'|'secondary'|'success'|'warning'|'danger'|'neutral'} [variant='primary'] - Variante semántica
 * @property {'sm'|'md'|'lg'|'xl'|'full'} [rounded='md'] - Radio de bordes
 * @property {boolean} [disabled=false] - Si está deshabilitado
 * @property {boolean} [loading=false] - Estado de carga
 * @property {string} [className=''] - Clases CSS adicionales
 * @property {Object} [style] - Estilos inline (uso limitado)
 * @property {string} [testId] - ID para testing (data-testid)
 * @property {string} [ariaLabel] - Label para accesibilidad
 */
export const STANDARD_PROPS_DEFINITION = {
  // Props de tamaño y apariencia
  size: {
    type: 'string',
    enum: Object.values(STANDARD_SIZES),
    default: 'md',
    description: 'Tamaño del componente según design system'
  },
  
  variant: {
    type: 'string', 
    enum: Object.values(STANDARD_VARIANTS),
    default: 'primary',
    description: 'Variante semántica que determina colores y comportamiento'
  },
  
  rounded: {
    type: 'string',
    enum: Object.values(STANDARD_ROUNDED), 
    default: 'md',
    description: 'Radio de bordes del componente'
  },

  // Props de estado
  disabled: {
    type: 'boolean',
    default: false,
    description: 'Deshabilita la interacción con el componente'
  },

  loading: {
    type: 'boolean', 
    default: false,
    description: 'Muestra estado de carga (spinner, skeleton, etc.)'
  },

  // Props de personalización
  className: {
    type: 'string',
    default: '',
    description: 'Clases CSS adicionales para personalización'
  },

  style: {
    type: 'object',
    default: {},
    description: 'Estilos inline (usar solo cuando sea necesario)'
  },

  // Props de testing y accesibilidad
  testId: {
    type: 'string',
    description: 'ID para testing automatizado (data-testid)'
  },

  ariaLabel: {
    type: 'string', 
    description: 'Label descriptivo para screen readers'
  }
};

/**
 * Sistema de iconos unificado
 * Elimina la confusión de props legacy
 * 
 * @typedef {Object} IconProps
 * @property {string|React.ReactNode} [leftIcon] - Icono izquierdo
 * @property {string|React.ReactNode} [rightIcon] - Icono derecho  
 * @property {boolean} [iconOnly=false] - Solo mostrar icono (solo Button)
 */
export const ICON_PROPS_DEFINITION = {
  leftIcon: {
    type: 'string|ReactNode',
    description: 'Icono a mostrar en el lado izquierdo. String para iconos del sistema, ReactNode para iconos custom'
  },

  rightIcon: {
    type: 'string|ReactNode', 
    description: 'Icono a mostrar en el lado derecho. String para iconos del sistema, ReactNode para iconos custom'
  },

  iconOnly: {
    type: 'boolean',
    default: false,
    description: 'Solo mostrar el icono, ocultar texto (disponible solo en Button)'
  }
};

/**
 * Props deprecadas que deben eliminarse gradualmente
 * Incluidas aquí para facilitar la migración
 * 
 * ❌ NO USAR EN COMPONENTES NUEVOS
 * ⚠️ MOSTRAR WARNING EN COMPONENTES EXISTENTES
 */
export const DEPRECATED_PROPS = {
  // Props de iconos legacy
  icon: {
    replacement: 'leftIcon o rightIcon', 
    reason: 'API inconsistente, usar leftIcon/rightIcon específicos'
  },
  
  iconPosition: {
    replacement: 'leftIcon o rightIcon',
    reason: 'Eliminado en favor de props específicas'
  },

  // Variantes inconsistentes
  'variant.default': {
    replacement: 'variant="primary"',
    reason: 'Standardización de variantes'
  },

  'variant.info': {
    replacement: 'variant="primary" o variant="neutral"', 
    reason: 'Reducción a 6 variantes core'
  },

  'variant.outline': {
    replacement: 'appearance="outline" (para Badge) o variant="neutral"',
    reason: 'Clarificación entre variant y appearance'
  },

  'variant.ghost': {
    replacement: 'appearance="ghost" (específico por componente)',
    reason: 'Ghost es más appearance que variant semántica'
  }
};

/**
 * Función para validar props estándar en desarrollo
 * Ayuda a developers a seguir las convenciones
 * 
 * @param {Object} props - Props del componente
 * @param {string} componentName - Nombre del componente para debugging
 * @param {Object} allowedProps - Props específicas adicionales del componente
 * @returns {Object} Props validadas con warnings
 */
export const validateStandardProps = (props, componentName = 'Component') => {
  if (!import.meta.env?.DEV) {
    return props; // Solo validar en desarrollo
  }

  const warnings = [];
  const validatedProps = { ...props };

  // Validar tamaño
  if (props.size && !Object.values(STANDARD_SIZES).includes(props.size)) {
    warnings.push(`${componentName}: size="${props.size}" no es válido. Usar: ${Object.values(STANDARD_SIZES).join(', ')}`);
  }

  // Validar variante
  if (props.variant && !Object.values(STANDARD_VARIANTS).includes(props.variant)) {
    warnings.push(`${componentName}: variant="${props.variant}" no es válido. Usar: ${Object.values(STANDARD_VARIANTS).join(', ')}`);
  }

  // Validar rounded
  if (props.rounded && !Object.values(STANDARD_ROUNDED).includes(props.rounded)) {
    warnings.push(`${componentName}: rounded="${props.rounded}" no es válido. Usar: ${Object.values(STANDARD_ROUNDED).join(', ')}`);
  }

  // Detectar props deprecadas
  Object.keys(DEPRECATED_PROPS).forEach(deprecatedProp => {
    if (Object.prototype.hasOwnProperty.call(props, deprecatedProp)) {
      const { replacement, reason } = DEPRECATED_PROPS[deprecatedProp];
      warnings.push(`${componentName}: prop "${deprecatedProp}" está deprecada. ${reason}. Usar: ${replacement}`);
    }
  });

  // Mostrar warnings agrupados
  if (warnings.length > 0) {
    console.group(`⚠️ ${componentName} - Props Warnings`);
    warnings.forEach(warning => console.warn(warning));
    console.groupEnd();
  }

  return validatedProps;
};

/**
 * Función helper para extraer solo props estándar
 * Útil para filtrar props antes de pasarlas al DOM
 * 
 * @param {Object} props - Props completas del componente
 * @returns {Object} Solo props estándar 
 */
export const extractStandardProps = (props) => {
  const {
    size,
    variant, 
    rounded,
    disabled,
    loading,
    className,
    style,
    testId,
    ariaLabel,
    leftIcon,
    rightIcon,
    iconOnly
  } = props;

  return {
    size,
    variant,
    rounded, 
    disabled,
    loading,
    className,
    style,
    testId,
    ariaLabel,
    leftIcon,
    rightIcon,
    iconOnly
  };
};

/**
 * Función helper para extraer props DOM-safe
 * Filtra props del sistema de diseño y del hook useStandardProps que no deben ir al DOM
 * 
 * @param {Object} props - Props completas del componente
 * @returns {Object} Props seguras para elementos DOM
 */
export const extractDOMProps = (props) => {
  const {
    // Props del sistema de diseño (NO van al DOM)
    size, variant, rounded, loading, leftIcon, rightIcon, iconOnly,
    
    // Props adicionales del hook useStandardProps (NO van al DOM)  
    tokens, renderIcon, hasLeftIcon, hasRightIcon, hasAnyIcon,
    isDisabled, isLoading, isEmpty,
    
    // Props que SÍ van al DOM pero necesitan transformación
    className, style, disabled, ariaLabel, testId,
    ...domProps
  } = props;

  // Marcar variables como utilizadas para evitar warnings de linting
  void size; void variant; void rounded; void loading; void leftIcon; void rightIcon; void iconOnly;
  void tokens; void renderIcon; void hasLeftIcon; void hasRightIcon; void hasAnyIcon;
  void isDisabled; void isLoading; void isEmpty;

  // Solo incluir props que son válidas en DOM
  const safeDOMProps = {
    ...domProps,
    className,
    style,
    disabled
  };

  // Agregar props de accesibilidad si están presentes
  if (ariaLabel) safeDOMProps['aria-label'] = ariaLabel;
  if (testId) safeDOMProps['data-testid'] = testId;

  return safeDOMProps;
};

/**
 * Constantes para PropTypes
 * Reutilizables en todos los componentes
 * 
 * Nota: Importar PropTypes en el componente que use esto:
 * import PropTypes from 'prop-types';
 * import { STANDARD_PROP_TYPES } from '../tokens/standardProps';
 */
export const STANDARD_PROP_TYPES = {
  size: PropTypes.oneOf(Object.values(STANDARD_SIZES)),
  variant: PropTypes.oneOf(Object.values(STANDARD_VARIANTS)), 
  rounded: PropTypes.oneOf(Object.values(STANDARD_ROUNDED)),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
  testId: PropTypes.string,
  ariaLabel: PropTypes.string,
  leftIcon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  rightIcon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  iconOnly: PropTypes.bool
};

/**
 * Export principal - Props estándar completas
 */
export const STANDARD_PROPS = {
  ...STANDARD_PROPS_DEFINITION,
  ...ICON_PROPS_DEFINITION
};

// Valores por defecto recomendados
export const DEFAULT_PROPS = {
  size: 'md',
  variant: 'primary', 
  rounded: 'md',
  disabled: false,
  loading: false,
  className: '',
  iconOnly: false
};