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

// TODO: Agregar en próximas tareas
// export { DESIGN_TOKENS } from './designTokens';
// export { COLOR_TOKENS } from './colors';
// export { SPACING_TOKENS } from './spacing';