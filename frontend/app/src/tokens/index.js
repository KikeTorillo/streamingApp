// tokens/index.js - Barrel export para todos los tokens del sistema de diseño

export {
  // Constantes de valores estándar
  STANDARD_SIZES,
  STANDARD_VARIANTS,
  STANDARD_ROUNDED,
  
  // Definiciones de props
  STANDARD_PROPS_DEFINITION,
  ICON_PROPS_DEFINITION,
  STANDARD_PROPS,
  
  // Props deprecadas para migración
  DEPRECATED_PROPS,
  
  // Funciones utilitarias
  validateStandardProps,
  extractStandardProps,
  extractDOMProps,
  
  // PropTypes reutilizables
  STANDARD_PROP_TYPES,
  
  // Valores por defecto
  DEFAULT_PROPS
} from './standardProps.js';

// Design Tokens System - Completo y listo para uso
export {
  // Token principal
  DESIGN_TOKENS,
  
  // Tokens específicos por categoría
  COMPONENT_SIZES,
  COLOR_VARIANTS, 
  BORDER_RADIUS,
  SPACING,
  SHADOWS,
  TRANSITIONS,
  Z_INDEX,
  TYPOGRAPHY,
  SEMANTIC_COLORS,
  BREAKPOINTS,
  ASPECT_RATIOS,
  
  // Funciones helper para uso programático
  getSizeTokens,
  getVariantTokens,
  getRoundedToken,
  getCombinedTokens,
  tokensToStyles
} from './designTokens.js';

// Higher-Order Components para aplicar props estándar
export {
  withStandardProps,
  withButtonProps,
  withBadgeProps,
  withInputProps,
  withCardProps,
  withModalProps,
  createStandardHOC,
  getOriginalComponent,
  isStandardPropsComponent
} from '../hocs/index.js';

// Hooks para usar props estándar en componentes funcionales
export {
  useStandardProps,
  useButtonProps,
  useBadgeProps,
  useInputProps,
  useCardProps,
  useModalProps,
  useLoadingButtonProps,
  useValidatedInputProps,
  useFilterBarProps,
  createStandardHook,
  useStandardPropsDebug
} from '../hooks/useStandardProps.jsx';