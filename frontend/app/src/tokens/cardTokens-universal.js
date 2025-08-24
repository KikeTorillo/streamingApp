// tokens/cardTokens-universal.js
// ===== CARD SYSTEM UNIVERSAL - 100% REUTILIZABLE =====

/**
 * CARD SYSTEM TOKENS UNIVERSALES
 * 
 * 🎯 OBJETIVO: Sistema de cards reutilizable para cualquier dominio
 * ✅ UNIVERSAL: Sin acoplamientos a streaming, e-commerce, etc.
 * 🏗️ FILOSOFÍA: "Aspectos y tamaños base, dominio se configura externamente"
 */

// ===== ASPECT RATIOS UNIVERSALES =====
export const UNIVERSAL_ASPECT_RATIOS = {
  square: '1/1',           // Perfiles, avatars, iconos
  portrait: '2/3',         // Posters, carátulas, libros
  landscape: '3/2',        // Fotos, paisajes
  wide: '16/9',           // Videos, banners, hero images
  ultrawide: '21/9',      // Banners promocionales, headers
  golden: '1.618/1',      // Proporción áurea
  card: '5/7',           // Tarjetas tradicionales
  mobile: '9/16'         // Móvil vertical
};

// ===== TAMAÑOS UNIFICADOS UNIVERSALES =====
export const UNIVERSAL_CARD_SIZES = {
  xs: { 
    width: '8rem',       // 128px
    minHeight: '10rem',  // Altura mínima adaptativa
    iconSize: '1.2rem',
    fontSize: '0.75rem',
    padding: '0.5rem'
  },
  sm: { 
    width: '12rem',      // 192px
    minHeight: '15rem',  
    iconSize: '1.4rem',
    fontSize: '0.875rem',
    padding: '0.75rem'
  },
  md: { 
    width: '16rem',      // 256px - DEFAULT
    minHeight: '20rem',  
    iconSize: '1.6rem',
    fontSize: '1rem',
    padding: '1rem'
  },
  lg: { 
    width: '20rem',      // 320px
    minHeight: '25rem',  
    iconSize: '1.8rem',
    fontSize: '1.125rem',
    padding: '1.25rem'
  },
  xl: { 
    width: '24rem',      // 384px
    minHeight: '30rem',  
    iconSize: '2rem',
    fontSize: '1.25rem',
    padding: '1.5rem'
  },
  full: {
    width: '100%',       // Ancho completo
    minHeight: 'auto',
    iconSize: '1.6rem',
    fontSize: '1rem',
    padding: '1rem'
  }
};

// ===== VARIANTES VISUALES UNIVERSALES =====
export const UNIVERSAL_CARD_VARIANTS = {
  flat: {
    background: 'var(--bg-default)',
    border: 'none',
    shadow: 'none',
    borderRadius: 'var(--radius-sm)'
  },
  elevated: {
    background: 'var(--bg-elevated)',
    border: 'none',
    shadow: 'var(--shadow-sm)',
    borderRadius: 'var(--radius-md)'
  },
  outlined: {
    background: 'var(--bg-default)',
    border: '1px solid var(--border-default)',
    shadow: 'none',
    borderRadius: 'var(--radius-md)'
  },
  soft: {
    background: 'var(--bg-muted)',
    border: 'none',
    shadow: 'none',
    borderRadius: 'var(--radius-lg)'
  },
  glass: {
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    shadow: 'var(--shadow-lg)',
    borderRadius: 'var(--radius-xl)',
    backdropFilter: 'blur(10px)'
  }
};

// ===== ESTADOS UNIVERSALES =====
export const UNIVERSAL_CARD_STATES = {
  default: {
    opacity: '1',
    cursor: 'default',
    transform: 'none'
  },
  hover: {
    transform: 'translateY(-2px)',
    shadow: 'var(--shadow-md)',
    transition: 'all 150ms cubic-bezier(0.25, 0.46, 0.45, 0.94)'
  },
  focus: {
    outline: '2px solid var(--color-primary-focus)',
    outlineOffset: '2px',
    transition: 'outline 150ms cubic-bezier(0.16, 1, 0.3, 1)'
  },
  active: {
    transform: 'translateY(0)',
    transition: 'transform 50ms ease'
  },
  loading: {
    opacity: '0.7',
    cursor: 'progress',
    pointerEvents: 'none'
  },
  disabled: {
    opacity: '0.5',
    cursor: 'not-allowed',
    pointerEvents: 'none',
    transform: 'none'
  }
};

// ===== CONFIGURACIÓN UNIVERSAL =====
export const UNIVERSAL_CARD_CONFIG = {
  defaultSize: 'md',
  defaultVariant: 'elevated',
  defaultAspectRatio: 'portrait',
  
  // Configuración de comportamiento
  enableHover: true,
  enableFocus: true,
  enableAnimation: true,
  
  // Accesibilidad
  focusable: true,
  keyboardNavigation: true
};

// ===== FUNCIONES HELPER UNIVERSALES =====

/**
 * Generar CSS Properties para cualquier configuración
 */
export function generateUniversalCardCSS(size = 'md', variant = 'elevated', aspectRatio = null) {
  const sizeTokens = UNIVERSAL_CARD_SIZES[size] || UNIVERSAL_CARD_SIZES.md;
  const variantTokens = UNIVERSAL_CARD_VARIANTS[variant] || UNIVERSAL_CARD_VARIANTS.elevated;
  
  const baseProperties = {
    // Dimensiones
    '--card-width': sizeTokens.width,
    '--card-min-height': sizeTokens.minHeight,
    '--card-padding': sizeTokens.padding,
    '--card-font-size': sizeTokens.fontSize,
    '--card-icon-size': sizeTokens.iconSize,
    
    // Variante visual
    '--card-background': variantTokens.background,
    '--card-border': variantTokens.border,
    '--card-shadow': variantTokens.shadow,
    '--card-border-radius': variantTokens.borderRadius
  };
  
  // Agregar aspect ratio si se especifica
  if (aspectRatio && UNIVERSAL_ASPECT_RATIOS[aspectRatio]) {
    baseProperties['--card-aspect-ratio'] = UNIVERSAL_ASPECT_RATIOS[aspectRatio];
  }
  
  // Agregar backdrop filter si es glass
  if (variant === 'glass' && variantTokens.backdropFilter) {
    baseProperties['--card-backdrop-filter'] = variantTokens.backdropFilter;
  }
  
  return baseProperties;
}

/**
 * Validadores universales
 */
export function isValidUniversalSize(size) {
  return Object.keys(UNIVERSAL_CARD_SIZES).includes(size);
}

export function isValidUniversalVariant(variant) {
  return Object.keys(UNIVERSAL_CARD_VARIANTS).includes(variant);
}

export function isValidUniversalAspectRatio(aspectRatio) {
  return Object.keys(UNIVERSAL_ASPECT_RATIOS).includes(aspectRatio);
}

/**
 * Helper para obtener configuración de tamaño
 */
export function getUniversalCardSize(size = 'md') {
  return UNIVERSAL_CARD_SIZES[size] || UNIVERSAL_CARD_SIZES.md;
}

/**
 * Helper para obtener aspect ratio
 */
export function getUniversalAspectRatio(aspectRatio = 'portrait') {
  return UNIVERSAL_ASPECT_RATIOS[aspectRatio] || UNIVERSAL_ASPECT_RATIOS.portrait;
}

// ===== TOKENS PRINCIPALES =====
export const UNIVERSAL_CARD_TOKENS = {
  sizes: UNIVERSAL_CARD_SIZES,
  variants: UNIVERSAL_CARD_VARIANTS,
  aspectRatios: UNIVERSAL_ASPECT_RATIOS,
  states: UNIVERSAL_CARD_STATES,
  config: UNIVERSAL_CARD_CONFIG
};

export default UNIVERSAL_CARD_TOKENS;
