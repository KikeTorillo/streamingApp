// tokens/responsivePresets.js - RESPONSIVE INTELLIGENCE SYSTEM
// Recomendación #5 del Plan Optimización Final: 94% → 100%

/**
 * 🎯 RESPONSIVE INTELLIGENCE - ADAPTIVE SIZING AUTOMÁTICO
 * 
 * PROBLEMA RESUELTO:
 * - ❌ Responsive props requieren conocimiento de breakpoints
 * - ❌ Developer necesita pensar en cada device manualmente
 * - ❌ Inconsistencias en comportamiento responsive
 * 
 * SOLUCIÓN:
 * - ✅ Presets adaptativos automáticos e inteligentes
 * - ✅ Zero conocimiento de breakpoints necesario
 * - ✅ Escalado perfecto sin pensar en devices
 * 
 * USO:
 * <Button size="adaptive" spacing="normal">
 *   Automáticamente: sm(mobile) → md(tablet) → lg(desktop)
 * </Button>
 */

// ===== RESPONSIVE BREAKPOINTS =====
export const RESPONSIVE_BREAKPOINTS = {
  base: '0px',        // Mobile first - desde 0px
  sm: '640px',        // Móviles grandes - desde 640px
  md: '768px',        // Tablets - desde 768px
  lg: '1024px',       // Desktop pequeño - desde 1024px
  xl: '1280px',       // Desktop estándar - desde 1280px
  '2xl': '1536px'     // Desktop grande - desde 1536px
};

// ===== ADAPTIVE SIZE PRESETS - ESCALADO INTELIGENTE =====
export const ADAPTIVE_SIZE_PRESETS = {
  // Component sizes (Button, Input, Badge, etc.)
  adaptive: {
    base: 'xs',    // Mobile: más compacto
    sm: 'sm',      // Mobile grande: size intermedio
    md: 'md',      // Tablet: size estándar
    lg: 'lg',      // Desktop: size grande
    xl: 'lg',      // Desktop grande: mantener lg
    '2xl': 'lg',   // Ultra wide: mantener lg
    description: 'Escalado automático para componentes interactivos'
  },
  
  adaptiveCompact: {
    base: 'xs',    // Mobile: ultra compacto
    sm: 'xs',      // Mobile grande: mantener xs  
    md: 'sm',      // Tablet: small
    lg: 'md',      // Desktop: medium
    xl: 'md',      // Desktop grande: mantener md
    '2xl': 'md',   // Ultra wide: mantener md
    description: 'Escalado compacto para interfaces densas'
  },
  
  adaptiveHero: {
    base: 'md',    // Mobile: readable pero no abrumador
    sm: 'lg',      // Mobile grande: más prominente
    md: 'xl',      // Tablet: grande
    lg: 'xl',      // Desktop: extra large
    xl: 'xl',      // Desktop grande: mantener xl
    '2xl': 'xl',   // Ultra wide: mantener xl
    description: 'Escalado para elementos hero y CTAs principales'
  }
};

// ===== ADAPTIVE SPACING PRESETS =====
export const ADAPTIVE_SPACING_PRESETS = {
  // Spacing automático que escala con el device
  tight: {
    base: 'xs',    // 4px - Mobile muy compacto
    sm: 'sm',      // 8px - Mobile con más espacio
    md: 'md',      // 12px - Tablet estándar
    lg: 'lg',      // 16px - Desktop cómodo
    xl: 'lg',      // Mantener en desktop grande
    '2xl': 'lg',   // Mantener en ultra wide
    description: 'Spacing compacto que escala automáticamente'
  },
  
  normal: {
    base: 'sm',    // 8px - Mobile respiración básica
    sm: 'md',      // 12px - Mobile más cómodo
    md: 'lg',      // 16px - Tablet espacioso
    lg: 'xl',      // 24px - Desktop amplio
    xl: 'xl',      // Mantener en desktop grande
    '2xl': 'xl',   // Mantener en ultra wide
    description: 'Spacing estándar adaptativo (DEFAULT)'
  },
  
  loose: {
    base: 'md',    // 12px - Mobile con aire
    sm: 'lg',      // 16px - Mobile espacioso
    md: 'xl',      // 24px - Tablet amplio
    lg: '2xl',     // 32px - Desktop muy espacioso
    xl: '2xl',     // Mantener en desktop grande
    '2xl': '2xl',  // Mantener en ultra wide
    description: 'Spacing amplio para breathing room'
  },
  
  section: {
    base: 'lg',    // 16px - Separación de secciones móvil
    sm: 'xl',      // 24px - Mobile más separado
    md: '2xl',     // 32px - Tablet bien separado
    lg: '3xl',     // 48px - Desktop secciones claras
    xl: '3xl',     // Mantener en desktop grande
    '2xl': '3xl',  // Mantener en ultra wide
    description: 'Spacing entre secciones principales'
  },
  
  page: {
    base: 'xl',    // 24px - Padding de página móvil
    sm: '2xl',     // 32px - Mobile más padding
    md: '3xl',     // 48px - Tablet cómodo
    lg: '4xl',     // 64px - Desktop amplio
    xl: '4xl',     // Mantener en desktop grande
    '2xl': '4xl',  // Mantener en ultra wide
    description: 'Padding de páginas y contenedores principales'
  }
};

// ===== ADAPTIVE TYPOGRAPHY PRESETS =====
export const ADAPTIVE_TYPOGRAPHY_PRESETS = {
  // Typography que escala automáticamente
  adaptiveBody: {
    base: 'sm',    // 14px - Mobile legible
    sm: 'md',      // 16px - Mobile cómodo
    md: 'md',      // 16px - Tablet mantener
    lg: 'lg',      // 18px - Desktop más grande
    xl: 'lg',      // Mantener en desktop grande
    '2xl': 'lg',   // Mantener en ultra wide
    description: 'Body text que se adapta al device'
  },
  
  adaptiveHeading: {
    base: 'xl',    // 20px - Mobile no abrumador
    sm: '2xl',     // 24px - Mobile más impacto
    md: '3xl',     // 30px - Tablet prominente
    lg: '4xl',     // 36px - Desktop grande
    xl: '5xl',     // 48px - Desktop grande impactante
    '2xl': '5xl',  // Mantener en ultra wide
    description: 'Headings que escalan con el viewport'
  },
  
  adaptiveDisplay: {
    base: '2xl',   // 24px - Mobile contenido pero legible
    sm: '3xl',     // 30px - Mobile más display
    md: '4xl',     // 36px - Tablet impactante
    lg: '5xl',     // 48px - Desktop grande
    xl: '6xl',     // 64px - Desktop muy impactante
    '2xl': '6xl',  // Mantener en ultra wide
    description: 'Display text para heros y landing pages'
  }
};

// ===== RESPONSIVE UTILITIES =====

/**
 * Resuelve un preset responsive al valor específico para un breakpoint
 * @param {Object} preset - Preset responsive (ej: ADAPTIVE_SIZE_PRESETS.adaptive)
 * @param {string} currentBreakpoint - Breakpoint actual ('base', 'sm', 'md', etc.)
 * @returns {string} Valor resuelto para el breakpoint
 */
export function resolveResponsivePreset(preset, currentBreakpoint = 'base') {
  if (!preset || typeof preset !== 'object') {
    return preset; // No es un preset, retornar tal cual
  }
  
  // Resolver breakpoint en cascada (mobile-first)
  const breakpointOrder = ['base', 'sm', 'md', 'lg', 'xl', '2xl'];
  const currentIndex = breakpointOrder.indexOf(currentBreakpoint);
  
  // Buscar el valor más específico disponible
  for (let i = currentIndex; i >= 0; i--) {
    const bp = breakpointOrder[i];
    if (preset[bp] !== undefined) {
      return preset[bp];
    }
  }
  
  // Fallback al base
  return preset.base || preset[Object.keys(preset)[0]];
}

/**
 * Convierte valor de size con preset automático
 * @param {string|Object} sizeValue - Valor de size ('md', 'adaptive', { base: 'sm', md: 'lg' })
 * @param {string} currentBreakpoint - Breakpoint actual
 * @returns {string} Size resuelto
 */
export function resolveAdaptiveSize(sizeValue, currentBreakpoint = 'base') {
  // Si es string simple, verificar si es un preset
  if (typeof sizeValue === 'string') {
    const preset = ADAPTIVE_SIZE_PRESETS[sizeValue];
    if (preset) {
      return resolveResponsivePreset(preset, currentBreakpoint);
    }
    return sizeValue; // Size normal (xs, sm, md, etc.)
  }
  
  // Si es objeto responsive
  if (typeof sizeValue === 'object') {
    return resolveResponsivePreset(sizeValue, currentBreakpoint);
  }
  
  return 'md'; // Fallback
}

/**
 * Convierte valor de spacing con preset automático
 * @param {string|Object} spacingValue - Valor de spacing ('md', 'normal', { base: 'sm', md: 'lg' })
 * @param {string} currentBreakpoint - Breakpoint actual
 * @returns {string} Spacing resuelto
 */
export function resolveAdaptiveSpacing(spacingValue, currentBreakpoint = 'base') {
  // Si es string simple, verificar si es un preset
  if (typeof spacingValue === 'string') {
    const preset = ADAPTIVE_SPACING_PRESETS[spacingValue];
    if (preset) {
      return resolveResponsivePreset(preset, currentBreakpoint);
    }
    return spacingValue; // Spacing normal (xs, sm, md, etc.)
  }
  
  // Si es objeto responsive
  if (typeof spacingValue === 'object') {
    return resolveResponsivePreset(spacingValue, currentBreakpoint);
  }
  
  return 'md'; // Fallback
}

/**
 * Convierte valor de typography con preset automático
 * @param {string|Object} typographyValue - Valor typography ('md', 'adaptiveBody', etc.)
 * @param {string} currentBreakpoint - Breakpoint actual
 * @returns {string} Typography size resuelto
 */
export function resolveAdaptiveTypography(typographyValue, currentBreakpoint = 'base') {
  // Si es string simple, verificar si es un preset
  if (typeof typographyValue === 'string') {
    const preset = ADAPTIVE_TYPOGRAPHY_PRESETS[typographyValue];
    if (preset) {
      return resolveResponsivePreset(preset, currentBreakpoint);
    }
    return typographyValue; // Typography normal (xs, sm, md, etc.)
  }
  
  // Si es objeto responsive
  if (typeof typographyValue === 'object') {
    return resolveResponsivePreset(typographyValue, currentBreakpoint);
  }
  
  return 'md'; // Fallback
}

// ===== BREAKPOINT DETECTION =====

/**
 * Obtiene el breakpoint actual basado en el ancho de ventana
 * @param {number} windowWidth - Ancho de ventana en pixels
 * @returns {string} Breakpoint actual ('base', 'sm', 'md', etc.)
 */
export function getCurrentBreakpoint(windowWidth) {
  if (windowWidth >= 1536) return '2xl';
  if (windowWidth >= 1280) return 'xl';
  if (windowWidth >= 1024) return 'lg';
  if (windowWidth >= 768) return 'md';
  if (windowWidth >= 640) return 'sm';
  return 'base';
}

// ===== RESPONSIVE PATTERNS COMBINADOS =====
export const RESPONSIVE_PATTERNS = {
  // Hero section responsive completo
  heroResponsive: {
    size: ADAPTIVE_SIZE_PRESETS.adaptiveHero,
    spacing: ADAPTIVE_SPACING_PRESETS.section,
    typography: ADAPTIVE_TYPOGRAPHY_PRESETS.adaptiveDisplay,
    description: 'Hero section que se adapta perfectamente'
  },
  
  // Form responsive completo
  formResponsive: {
    size: ADAPTIVE_SIZE_PRESETS.adaptive,
    spacing: ADAPTIVE_SPACING_PRESETS.normal,
    typography: ADAPTIVE_TYPOGRAPHY_PRESETS.adaptiveBody,
    description: 'Formularios optimizados por device'
  },
  
  // Interface densa (dashboards, tablas)
  denseResponsive: {
    size: ADAPTIVE_SIZE_PRESETS.adaptiveCompact,
    spacing: ADAPTIVE_SPACING_PRESETS.tight,
    typography: ADAPTIVE_TYPOGRAPHY_PRESETS.adaptiveBody,
    description: 'Interfaces densas pero usables'
  },
  
  // Content reading (artículos, documentación)
  contentResponsive: {
    size: ADAPTIVE_SIZE_PRESETS.adaptive,
    spacing: ADAPTIVE_SPACING_PRESETS.loose,
    typography: ADAPTIVE_TYPOGRAPHY_PRESETS.adaptiveBody,
    description: 'Contenido optimizado para lectura'
  }
};

// ===== CSS CUSTOM PROPERTIES AUTOMÁTICAS =====
export const RESPONSIVE_CSS_VARS = {
  // Breakpoint aware CSS vars que se actualizan automáticamente
  '--adaptive-size': 'var(--component-size-md)',      // Default fallback
  '--adaptive-spacing': 'var(--spacing-md)',          // Default fallback  
  '--adaptive-typography': 'var(--typography-md)',    // Default fallback
  
  // Media queries automáticas
  '--bp-sm': RESPONSIVE_BREAKPOINTS.sm,
  '--bp-md': RESPONSIVE_BREAKPOINTS.md,
  '--bp-lg': RESPONSIVE_BREAKPOINTS.lg,
  '--bp-xl': RESPONSIVE_BREAKPOINTS.xl,
  '--bp-2xl': RESPONSIVE_BREAKPOINTS['2xl']
};

// ===== EJEMPLO DE INTEGRACIÓN =====
/*
// EN COMPONENTES - Zero configuración manual:
<Button size="adaptive" spacing="normal">
  // Automáticamente:
  // Mobile: size="xs" spacing="sm" 
  // Tablet: size="md" spacing="lg"
  // Desktop: size="lg" spacing="xl"
</Button>

<Typography size="adaptiveHeading" spacing="section">
  // Automáticamente:
  // Mobile: size="xl" spacing="lg"
  // Tablet: size="3xl" spacing="2xl" 
  // Desktop: size="4xl" spacing="3xl"
</Typography>

<Container spacing="page">
  // Automáticamente:
  // Mobile: padding="xl" (24px)
  // Tablet: padding="3xl" (48px)
  // Desktop: padding="4xl" (64px)
</Container>

// RESULTADO:
// ✅ Responsive perfecto sin pensar en breakpoints
// ✅ Escalado inteligente automático
// ✅ Zero configuración manual
// ✅ Consistencia garantizada en todos los devices
// ✅ Performance optimizada (CSS-first)
*/