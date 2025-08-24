// tokens/cardTokens-v2.js
// ===== CARD SYSTEM TOKENS V2.0 - SISTEMA UNIFICADO PARA CARDS =====

/**
 * TOKENS ESPECIALIZADOS PARA SISTEMA DE CARDS
 * 
 * 🎯 OBJETIVO: Unificar dimensiones, aspectos y comportamientos
 * ✅ SOLUCIÓN: Tokens que garantizan consistencia entre Card, ContentImage, ContentCard
 * 🏗️ FILOSOFÍA: "Un token, múltiples componentes, cero conflictos"
 */

export const CARD_SYSTEM_TOKENS = {
  // ===== TAMAÑOS UNIFICADOS =====
  sizes: {
    xs: { 
      width: '8rem',       // 128px
      height: '12rem',     // 192px (ratio 2:3)
      aspectRatio: '2/3',
      iconSize: '1.2rem',
      fontSize: '0.75rem'
    },
    sm: { 
      width: '12rem',      // 192px
      height: '18rem',     // 288px (ratio 2:3)
      aspectRatio: '2/3',
      iconSize: '1.4rem',
      fontSize: '0.875rem'
    },
    md: { 
      width: '16rem',      // 256px
      height: '24rem',     // 384px (ratio 2:3)
      aspectRatio: '2/3',
      iconSize: '1.6rem',
      fontSize: '1rem'
    },
    lg: { 
      width: '20rem',      // 320px
      height: '30rem',     // 480px (ratio 2:3)
      aspectRatio: '2/3',
      iconSize: '1.8rem',
      fontSize: '1.125rem'
    },
    xl: { 
      width: '24rem',      // 384px
      height: '36rem',     // 576px (ratio 2:3)
      aspectRatio: '2/3',
      iconSize: '2rem',
      fontSize: '1.25rem'
    }
  },

  // ===== VARIANTES DE CARD (SEPARADAS DE VARIANTES SEMÁNTICAS) =====
  cardVariants: {
    default: {
      background: 'var(--bg-default)',
      border: 'none',
      shadow: 'none'
    },
    elevated: {
      background: 'var(--bg-elevated)',
      border: 'none',
      shadow: 'var(--shadow-sm)'
    },
    outlined: {
      background: 'var(--bg-default)',
      border: '1px solid var(--border-muted)',
      shadow: 'none'
    },
    soft: {
      background: 'var(--bg-muted)',
      border: 'none',
      shadow: 'none'
    }
  },

  // ===== ESPACIADO ESPECIALIZADO =====
  spacing: {
    cardPadding: {
      xs: 'var(--space-xs)', // 0.4rem
      sm: 'var(--space-sm)', // 0.8rem
      md: 'var(--space-md)', // 1.2rem
      lg: 'var(--space-lg)', // 1.6rem
      xl: 'var(--space-xl)'  // 2.4rem
    },
    badgeOffset: {
      xs: 'var(--space-xs)', // 0.4rem
      sm: 'var(--space-xs)', // 0.4rem
      md: 'var(--space-sm)', // 0.8rem
      lg: 'var(--space-sm)', // 0.8rem
      xl: 'var(--space-md)'  // 1.2rem
    },
    contentGap: {
      xs: 'var(--space-2xs)', // 0.2rem
      sm: 'var(--space-xs)',  // 0.4rem
      md: 'var(--space-sm)',  // 0.8rem
      lg: 'var(--space-md)',  // 1.2rem
      xl: 'var(--space-lg)'   // 1.6rem
    }
  },

  // ===== ANIMACIONES ESPECIALIZADAS =====
  animations: {
    hover: {
      transform: 'translateY(-2px)',
      shadow: 'var(--shadow-md)',
      duration: 'var(--transition-fast, 150ms)',
      easing: 'var(--easing-hover, cubic-bezier(0.25, 0.46, 0.45, 0.94))'
    },
    focus: {
      ring: '2px solid var(--color-primary-focus)',
      duration: 'var(--transition-fast, 150ms)',
      easing: 'var(--easing-focus, cubic-bezier(0.16, 1, 0.3, 1))'
    },
    loading: {
      opacity: '0.7',
      cursor: 'progress'
    },
    disabled: {
      opacity: '0.5',
      cursor: 'not-allowed',
      transform: 'none'
    }
  },

  // ===== TIPOS DE CONTENIDO =====
  contentTypes: {
    movie: { 
      aspectRatio: '2/3', 
      objectFit: 'cover',
      placeholder: '🎬',
      defaultSize: 'md'
    },
    series: { 
      aspectRatio: '2/3', 
      objectFit: 'cover',
      placeholder: '📺',
      defaultSize: 'md'
    },
    episode: { 
      aspectRatio: '16/9', 
      objectFit: 'cover',
      placeholder: '🎥',
      defaultSize: 'lg'
    },
    profile: { 
      aspectRatio: '1/1', 
      objectFit: 'cover',
      placeholder: '👤',
      defaultSize: 'sm'
    },
    banner: { 
      aspectRatio: '21/9', 
      objectFit: 'cover',
      placeholder: '🖼️',
      defaultSize: 'xl'
    }
  },

  // ===== CSS CUSTOM PROPERTIES =====
  cssVars: {
    // Generar variables CSS dinámicamente
    generateSizeVars: (size) => {
      const tokens = CARD_SYSTEM_TOKENS.sizes[size];
      return {
        '--card-width': tokens.width,
        '--card-height': tokens.height,
        '--card-aspect-ratio': tokens.aspectRatio,
        '--card-icon-size': tokens.iconSize,
        '--card-font-size': tokens.fontSize
      };
    },
    
    generateContentVars: (contentType) => {
      const tokens = CARD_SYSTEM_TOKENS.contentTypes[contentType];
      return {
        '--content-aspect-ratio': tokens.aspectRatio,
        '--content-object-fit': tokens.objectFit,
        '--content-placeholder': `"${tokens.placeholder}"`
      };
    }
  }
};

/**
 * Helper para generar CSS Custom Properties completas
 */
export function generateCardCSSProperties(size = 'md', contentType = 'movie', cardVariant = 'elevated') {
  const sizeTokens = CARD_SYSTEM_TOKENS.sizes[size];
  const contentTokens = CARD_SYSTEM_TOKENS.contentTypes[contentType];
  const variantTokens = CARD_SYSTEM_TOKENS.cardVariants[cardVariant];
  const spacingTokens = CARD_SYSTEM_TOKENS.spacing;

  return {
    // Dimensiones
    '--card-width': sizeTokens.width,
    '--card-height': sizeTokens.height,
    '--card-aspect-ratio': contentTokens.aspectRatio,
    
    // Variante visual
    '--card-background': variantTokens.background,
    '--card-border': variantTokens.border,
    '--card-shadow': variantTokens.shadow,
    
    // Espaciado
    '--card-padding': spacingTokens.cardPadding[size],
    '--card-badge-offset': spacingTokens.badgeOffset[size],
    '--card-content-gap': spacingTokens.contentGap[size],
    
    // Objeto fit para imágenes
    '--card-object-fit': contentTokens.objectFit,
    
    // Tipografía e iconos
    '--card-font-size': sizeTokens.fontSize,
    '--card-icon-size': sizeTokens.iconSize
  };
}

/**
 * Validaciones de tipos
 */
export function isValidCardSize(size) {
  return Object.keys(CARD_SYSTEM_TOKENS.sizes).includes(size);
}

export function isValidContentType(contentType) {
  return Object.keys(CARD_SYSTEM_TOKENS.contentTypes).includes(contentType);
}

export function isValidCardVariant(variant) {
  return Object.keys(CARD_SYSTEM_TOKENS.cardVariants).includes(variant);
}

/**
 * Configuración por defecto
 */
export const CARD_SYSTEM_DEFAULTS = {
  size: 'md',
  contentType: 'movie',
  cardVariant: 'elevated',
  showRating: true,
  showMeta: true,
  showCategory: true
};

/**
 * Helper para obtener dimensiones de card por tamaño
 */
export const getCardDimensions = (size = 'md') => {
  return CARD_SYSTEM_TOKENS.sizes[size] || CARD_SYSTEM_TOKENS.sizes.md;
};

/**
 * Helper para obtener configuración de tipo de contenido
 */
export const getContentTypeConfig = (contentType = 'movie') => {
  return CARD_SYSTEM_TOKENS.contentTypes[contentType] || CARD_SYSTEM_TOKENS.contentTypes.movie;
};

/**
 * Helper para generar estilos completos de card
 */
export const generateCardStyles = (size = 'md', contentType = 'movie') => {
  const sizeTokens = getCardDimensions(size);
  const contentTokens = getContentTypeConfig(contentType);
  
  return {
    width: sizeTokens.width,
    height: sizeTokens.height,
    aspectRatio: contentTokens.aspectRatio,
    fontSize: sizeTokens.fontSize,
    '--card-icon-size': sizeTokens.iconSize,
    '--content-object-fit': contentTokens.objectFit
  };
};
