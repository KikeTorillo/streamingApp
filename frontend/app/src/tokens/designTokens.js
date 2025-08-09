// tokens/designTokens.js
// ===== DESIGN TOKENS CENTRALIZADOS - SISTEMA DE DISEÑO =====

/**
 * Sistema completo de design tokens extraído de variables CSS
 * Permite uso programático de tokens en componentes JavaScript
 * 
 * ✅ CENTRALIZADO: Un solo lugar para todos los tokens
 * ✅ PROGRAMÁTICO: Acceso desde JavaScript con IntelliSense
 * ✅ TIPADO: Preparado para TypeScript
 * ✅ ESCALABLE: Fácil agregar nuevos tokens
 * ✅ CONSISTENTE: Mapeo directo con variables CSS
 */

// ===== TAMAÑOS DE COMPONENTES =====
export const COMPONENT_SIZES = {
  xs: {
    height: 'var(--component-height-xs)',      // 2.8rem (28px)
    padding: 'var(--component-padding-xs)',    // 0.6rem 1.2rem
    fontSize: 'var(--component-font-xs)',      // 1.3rem (13px)
    borderRadius: 'var(--radius-sm)',          // 0.6rem
    iconSize: 'xs'
  },
  sm: {
    height: 'var(--component-height-sm)',      // 3.2rem (32px)
    padding: 'var(--component-padding-sm)',    // 1.2rem 1.8rem
    fontSize: 'var(--component-font-sm)',      // 1.5rem (15px)
    borderRadius: 'var(--radius-md)',          // 1.2rem
    iconSize: 'xs'
  },
  md: {
    height: 'var(--component-height-md)',      // 4.0rem (40px)
    padding: 'var(--component-padding-md)',    // 1.2rem 1.8rem
    fontSize: 'var(--component-font-md)',      // 1.7rem (17px)
    borderRadius: 'var(--radius-md)',          // 1.2rem
    iconSize: 'sm'
  },
  lg: {
    height: 'var(--component-height-lg)',      // 5.6rem (56px) - ESTÁNDAR
    padding: 'var(--component-padding-lg)',    // 1.8rem 2.4rem
    fontSize: 'var(--component-font-lg)',      // 2.1rem (21px)
    borderRadius: 'var(--radius-lg)',          // 1.8rem
    iconSize: 'sm'
  },
  xl: {
    height: 'var(--component-height-xl)',      // 5.6rem (56px)
    padding: 'var(--component-padding-xl)',    // 1.8rem 4.8rem
    fontSize: 'var(--component-font-xl)',      // 2.5rem (25px)
    borderRadius: 'var(--radius-xl)',          // 2.4rem
    iconSize: 'md'
  }
};

// ===== VARIANTES DE COLOR =====
export const COLOR_VARIANTS = {
  primary: {
    bg: 'var(--color-primary)',                // --matcha-400
    bgHover: 'var(--color-primary-hover)',     // --matcha-600
    bgLight: 'var(--color-primary-light)',     // --matcha-100
    bgDark: 'var(--color-primary-dark)',       // --matcha-700
    text: 'var(--text-on-primary)',            // #ffffff
    border: 'var(--color-primary)',
    borderHover: 'var(--color-primary-hover)'
  },
  secondary: {
    bg: 'var(--color-secondary)',              // --accent-400
    bgHover: 'var(--color-secondary-hover)',   // --accent-500
    bgLight: 'var(--color-secondary-light)',   // --accent-100
    bgDark: 'var(--color-secondary-dark)',     // --accent-600
    text: 'var(--text-on-secondary)',          // #ffffff
    border: 'var(--color-secondary)',
    borderHover: 'var(--color-secondary-hover)'
  },
  success: {
    bg: 'var(--color-success)',                // --matcha-500
    bgHover: 'var(--color-success-hover)',     // --matcha-600
    bgLight: 'var(--color-success-light)',     // --matcha-100
    bgDark: 'var(--color-success-dark)',       // --matcha-700
    text: 'var(--text-on-success)',            // #ffffff
    border: 'var(--color-success)',
    borderHover: 'var(--color-success-hover)'
  },
  warning: {
    bg: 'var(--color-warning)',                // --accent-300
    bgHover: 'var(--color-warning-hover)',     // --accent-400
    bgLight: 'var(--color-warning-light)',     // --accent-100
    bgDark: 'var(--color-warning-dark)',       // --accent-500
    text: 'var(--text-on-warning)',            // --gray-900
    border: 'var(--color-warning)',
    borderHover: 'var(--color-warning-hover)'
  },
  danger: {
    bg: 'var(--color-danger)',                 // --red-500
    bgHover: 'var(--color-danger-hover)',      // --red-600
    bgLight: 'var(--color-danger-light)',      // --red-100
    bgDark: 'var(--color-danger-dark)',        // --red-700
    text: 'var(--text-on-danger)',             // #ffffff
    border: 'var(--color-danger)',
    borderHover: 'var(--color-danger-hover)'
  },
  neutral: {
    bg: 'var(--gray-100)',                     // Fondo neutral claro
    bgHover: 'var(--gray-200)',                // Hover neutral
    bgLight: 'var(--gray-50)',                 // Fondo muy claro
    bgDark: 'var(--gray-300)',                 // Fondo neutral oscuro
    text: 'var(--text-primary)',               // Texto principal
    border: 'var(--border-default)',           // Borde por defecto
    borderHover: 'var(--border-hover)'         // Borde hover
  }
};

// ===== RADIOS DE BORDE =====
export const BORDER_RADIUS = {
  sm: 'var(--radius-sm)',      // 0.6rem (6px)
  md: 'var(--radius-md)',      // 1.2rem (12px) - ESTÁNDAR
  lg: 'var(--radius-lg)',      // 1.8rem (18px)
  xl: 'var(--radius-xl)',      // 2.4rem (24px)
  full: 'var(--radius-full)'   // 9999px (círculo)
};

// ===== ESPACIADO =====
export const SPACING = {
  xs: 'var(--space-xs)',       // 0.6rem (6px)
  sm: 'var(--space-sm)',       // 1.2rem (12px)
  md: 'var(--space-md)',       // 1.8rem (18px)
  lg: 'var(--space-lg)',       // 2.4rem (24px)
  xl: 'var(--space-xl)',       // 3.6rem (36px)
  '2xl': 'var(--space-2xl)',   // 4.8rem (48px)
  '3xl': 'var(--space-3xl)',   // 7.2rem (72px)
  '4xl': 'var(--space-4xl)'    // 9.6rem (96px)
};

// ===== SOMBRAS =====
export const SHADOWS = {
  none: 'var(--shadow-none)',
  sm: 'var(--shadow-sm)',      // Suave
  md: 'var(--shadow-md)',      // Media - ESTÁNDAR
  lg: 'var(--shadow-lg)',      // Grande
  xl: 'var(--shadow-xl)'       // Extra grande
};

// ===== TRANSICIONES =====
export const TRANSITIONS = {
  fast: 'var(--transition-fast)',     // 0.15s
  normal: 'var(--transition-normal)', // 0.2s - ESTÁNDAR
  slow: 'var(--transition-slow)'      // 0.3s
};

// ===== Z-INDEX =====
export const Z_INDEX = {
  dropdown: 'var(--z-dropdown)',      // 1000
  sticky: 'var(--z-sticky)',          // 1020
  fixed: 'var(--z-fixed)',            // 1030
  modalBackdrop: 'var(--z-modal-backdrop)', // 1040
  modal: 'var(--z-modal)',            // 1050
  popover: 'var(--z-popover)',        // 1060
  tooltip: 'var(--z-tooltip)',        // 1070
  toast: 'var(--z-toast)'             // 1080
};

// ===== TIPOGRAFÍA =====
export const TYPOGRAPHY = {
  fontFamily: {
    base: 'var(--font-family-base)',
    mono: 'var(--font-family-mono)'
  },
  fontSize: {
    xs: 'var(--font-size-xs)',        // 1.3rem (13px)
    sm: 'var(--font-size-sm)',        // 1.5rem (15px)
    base: 'var(--font-size-base)',    // 1.7rem (17px)
    md: 'var(--font-size-md)',        // 1.9rem (19px)
    lg: 'var(--font-size-lg)',        // 2.1rem (21px)
    xl: 'var(--font-size-xl)',        // 2.5rem (25px)
    '2xl': 'var(--font-size-2xl)',    // 3.1rem (31px)
    '3xl': 'var(--font-size-3xl)',    // 3.7rem (37px)
    '4xl': 'var(--font-size-4xl)'     // 4.9rem (49px)
  },
  fontWeight: {
    light: 'var(--font-weight-light)',       // 300
    normal: 'var(--font-weight-normal)',     // 400
    medium: 'var(--font-weight-medium)',     // 500
    semibold: 'var(--font-weight-semibold)', // 600
    bold: 'var(--font-weight-bold)'          // 700
  },
  lineHeight: {
    tight: 'var(--line-height-tight)',       // 1.25
    normal: 'var(--line-height-normal)',     // 1.5
    relaxed: 'var(--line-height-relaxed)'    // 1.75
  }
};

// ===== COLORES SEMÁNTICOS =====
export const SEMANTIC_COLORS = {
  background: {
    primary: 'var(--bg-primary)',
    secondary: 'var(--bg-secondary)',
    tertiary: 'var(--bg-tertiary)',
    muted: 'var(--bg-muted)',
    disabled: 'var(--bg-disabled)',
    hover: 'var(--bg-hover)'
  },
  text: {
    primary: 'var(--text-primary)',
    secondary: 'var(--text-secondary)',
    tertiary: 'var(--text-tertiary)',
    muted: 'var(--text-muted)',
    placeholder: 'var(--text-placeholder)',
    disabled: 'var(--text-disabled)',
    white: 'var(--text-white)'
  },
  border: {
    default: 'var(--border-default)',
    light: 'var(--border-light)',
    medium: 'var(--border-medium)',
    dark: 'var(--border-dark)',
    focus: 'var(--border-focus)',
    primary: 'var(--border-primary)',
    hover: 'var(--border-hover)'
  }
};

// ===== BREAKPOINTS =====
export const BREAKPOINTS = {
  sm: 'var(--breakpoint-sm)',     // 640px
  md: 'var(--breakpoint-md)',     // 768px
  lg: 'var(--breakpoint-lg)',     // 1024px
  xl: 'var(--breakpoint-xl)',     // 1280px
  '2xl': 'var(--breakpoint-2xl)'  // 1536px
};

// ===== ASPECTOS DE RATIO =====
export const ASPECT_RATIOS = {
  square: 'var(--aspect-square)',   // 1/1
  video: 'var(--aspect-video)',     // 16/9
  photo: 'var(--aspect-photo)',     // 4/3
  card: 'var(--aspect-card)'        // 2/3
};

// ===== TOKEN COMPLETO PARA USO EN COMPONENTES =====
export const DESIGN_TOKENS = {
  sizes: COMPONENT_SIZES,
  variants: COLOR_VARIANTS,
  rounded: BORDER_RADIUS,
  spacing: SPACING,
  shadows: SHADOWS,
  transitions: TRANSITIONS,
  zIndex: Z_INDEX,
  typography: TYPOGRAPHY,
  colors: SEMANTIC_COLORS,
  breakpoints: BREAKPOINTS,
  aspectRatios: ASPECT_RATIOS
};

// ===== FUNCIONES HELPER =====

/**
 * Obtiene el token de tamaño para un componente específico
 * @param {keyof COMPONENT_SIZES} size - Tamaño del componente
 * @returns {object} Objeto con tokens de tamaño
 */
export const getSizeTokens = (size = 'md') => {
  return COMPONENT_SIZES[size] || COMPONENT_SIZES.md;
};

/**
 * Obtiene el token de variante para un componente específico
 * @param {keyof COLOR_VARIANTS} variant - Variante del componente
 * @returns {object} Objeto con tokens de color
 */
export const getVariantTokens = (variant = 'primary') => {
  return COLOR_VARIANTS[variant] || COLOR_VARIANTS.primary;
};

/**
 * Obtiene el token de border radius
 * @param {keyof BORDER_RADIUS} rounded - Radio de borde
 * @returns {string} Variable CSS del radio
 */
export const getRoundedToken = (rounded = 'md') => {
  return BORDER_RADIUS[rounded] || BORDER_RADIUS.md;
};

/**
 * Combina tokens de tamaño, variante y radio en un objeto
 * @param {string} size - Tamaño del componente
 * @param {string} variant - Variante del componente  
 * @param {string} rounded - Radio de bordes
 * @returns {object} Objeto combinado con todos los tokens
 */
export const getCombinedTokens = (size = 'md', variant = 'primary', rounded = 'md') => {
  return {
    size: getSizeTokens(size),
    variant: getVariantTokens(variant),
    rounded: getRoundedToken(rounded)
  };
};

/**
 * Crea un objeto de estilos CSS a partir de tokens
 * @param {object} tokens - Tokens a convertir en estilos
 * @returns {object} Objeto de estilos CSS
 */
export const tokensToStyles = (tokens) => {
  const { size, variant, rounded } = tokens;
  
  return {
    height: size?.height,
    padding: size?.padding,
    fontSize: size?.fontSize,
    borderRadius: rounded,
    backgroundColor: variant?.bg,
    color: variant?.text,
    border: `1px solid ${variant?.border}`,
    transition: TRANSITIONS.normal
  };
};

// ===== EXPORTS DEFAULT =====
export default DESIGN_TOKENS;