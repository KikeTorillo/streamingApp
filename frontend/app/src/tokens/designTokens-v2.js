// tokens/designTokens-v2.js
// ===== SISTEMA DE DISEÑO CLASE MUNDIAL - ARQUITECTURA AMBICIOSA =====

/**
 * SISTEMA DE TOKENS DE CLASE MUNDIAL V2.0
 * 
 * 🏗️ ARQUITECTURA: Especialización por Responsabilidad
 * 🎯 FILOSOFÍA: "Diferentes escalas para diferentes propósitos"
 * 🚀 NIVEL: Competencia directa con Chakra UI, Ant Design, Material-UI
 * 
 * ✅ ESPECIALIZACIÓN: Escalas optimizadas por contexto
 * ✅ PREDICTIBILIDAD: Patrones consistentes y memorizables
 * ✅ ESCALABILIDAD: Crecimiento sin breaking changes
 * ✅ PERFORMANCE: CSS-first, mínima JavaScript overhead
 * ✅ TYPESCRIPT: Support completo con tipos específicos
 * ✅ RESPONSIVE: Breakpoint support nativo
 */

// ===== 🎛️ COMPONENT_SIZES - COMPONENTES INTERACTIVOS =====
/**
 * Para: Button, Input, Badge, Select, etc.
 * Optimizado para: Touch targets, jerarquía visual clara
 * Escala: xs → xl + full
 */
export const COMPONENT_SIZES = {
  xs: {
    height: '3.2rem',           // 32px - Touch target mínimo
    padding: '0.6rem 1.2rem',   // Padding proporcional
    fontSize: '1.3rem',         // 13px - Legibilidad mínima
    iconSize: '1.6rem',         // 16px - Iconos proporcionales
    borderRadius: 'var(--radius-xs)', // Redondeo sutil
    minWidth: '6.4rem'          // Ancho mínimo para usabilidad
  },
  sm: {
    height: '4.0rem',           // 40px - Inputs estándar
    padding: '0.8rem 1.6rem',   
    fontSize: '1.5rem',         // 15px
    iconSize: '1.8rem',         // 18px
    borderRadius: 'var(--radius-sm)',
    minWidth: '8.0rem'
  },
  md: {
    height: '4.8rem',           // 48px - DEFAULT - Buttons primarios
    padding: '1.2rem 2.0rem',   
    fontSize: '1.7rem',         // 17px - Tamaño base
    iconSize: '2.0rem',         // 20px
    borderRadius: 'var(--radius-md)',
    minWidth: '9.6rem'
  },
  lg: {
    height: '5.6rem',           // 56px - CTAs importantes
    padding: '1.4rem 2.4rem',   
    fontSize: '1.9rem',         // 19px
    iconSize: '2.4rem',         // 24px
    borderRadius: 'var(--radius-lg)',
    minWidth: '11.2rem'
  },
  xl: {
    height: '6.4rem',           // 64px - Hero buttons
    padding: '1.6rem 3.2rem',   
    fontSize: '2.1rem',         // 21px
    iconSize: '2.8rem',         // 28px
    borderRadius: 'var(--radius-xl)',
    minWidth: '12.8rem'
  },
  full: {
    width: '100%',              // Ancho completo
    display: 'block'            // Block para full width
  }
};

// ===== 📏 SPACING_SCALE - SISTEMA UNIVERSAL DE ESPACIADO =====
/**
 * Para: margin, padding, gap, grid-gap
 * Optimizado para: Ritmo visual, breathing room
 * Escala: xs → 6xl (máxima flexibilidad)
 * Base: 8px grid system + golden ratio
 */
export const SPACING_SCALE = {
  xs: '0.4rem',     // 4px - Espaciado mínimo, separación sutil
  sm: '0.8rem',     // 8px - Espaciado base, padding interno pequeño  
  md: '1.2rem',     // 12px - Espaciado estándar, DEFAULT
  lg: '1.6rem',     // 16px - Espaciado entre secciones pequeñas
  xl: '2.4rem',     // 24px - Espaciado entre componentes grandes
  '2xl': '3.2rem',  // 32px - Espaciado entre secciones principales
  '3xl': '4.8rem',  // 48px - Espaciado entre bloques de contenido
  '4xl': '6.4rem',  // 64px - Espaciado para layouts amplios
  '5xl': '9.6rem',  // 96px - Espaciado hero sections
  '6xl': '12.8rem'  // 128px - Espaciado máximo, separación dramática
};

// ===== 🎨 TYPOGRAPHY_SCALE - JERARQUÍA TIPOGRÁFICA =====
/**
 * Para: font-size, line-height
 * Optimizado para: Jerarquía editorial completa
 * Escala: xs → 6xl
 * Base: Type scale 1.25 (Major Third)
 */
export const TYPOGRAPHY_SCALE = {
  xs: {
    fontSize: '1.2rem',         // 12px - Captions, metadatos
    lineHeight: 1.4,
    letterSpacing: '0.025em',
    fontWeight: 400
  },
  sm: {
    fontSize: '1.4rem',         // 14px - Body small, labels secundarios
    lineHeight: 1.5,
    letterSpacing: '0.015em',
    fontWeight: 400
  },
  md: {
    fontSize: '1.6rem',         // 16px - Body text DEFAULT
    lineHeight: 1.6,
    letterSpacing: '0',
    fontWeight: 400
  },
  lg: {
    fontSize: '1.8rem',         // 18px - Lead text, subtítulos
    lineHeight: 1.6,
    letterSpacing: '-0.01em',
    fontWeight: 400
  },
  xl: {
    fontSize: '2.0rem',         // 20px - H6, títulos pequeños
    lineHeight: 1.5,
    letterSpacing: '-0.015em',
    fontWeight: 600
  },
  '2xl': {
    fontSize: '2.4rem',         // 24px - H5, títulos sección
    lineHeight: 1.4,
    letterSpacing: '-0.02em',
    fontWeight: 600
  },
  '3xl': {
    fontSize: '3.0rem',         // 30px - H4, títulos principales
    lineHeight: 1.3,
    letterSpacing: '-0.025em',
    fontWeight: 700
  },
  '4xl': {
    fontSize: '3.6rem',         // 36px - H3, títulos destacados
    lineHeight: 1.25,
    letterSpacing: '-0.03em',
    fontWeight: 700
  },
  '5xl': {
    fontSize: '4.8rem',         // 48px - H2, títulos página
    lineHeight: 1.2,
    letterSpacing: '-0.035em',
    fontWeight: 800
  },
  '6xl': {
    fontSize: '6.4rem',         // 64px - H1, display headers
    lineHeight: 1.1,
    letterSpacing: '-0.04em',
    fontWeight: 800
  }
};

// ===== 📦 CONTAINER_SCALE - TAMAÑOS DE CONTENEDORES =====
/**
 * Para: max-width de contenedores principales
 * Optimizado para: Diferentes tipos de layouts y contenido
 * Escala: xs → 6xl + full + screen
 */
export const CONTAINER_SCALE = {
  xs: '32rem',      // 320px - Modales pequeños, forms login
  sm: '48rem',      // 480px - Modales estándar, sidebars
  md: '64rem',      // 640px - Artículos, contenido reading
  lg: '80rem',      // 800px - Páginas principales, dashboards
  xl: '96rem',      // 960px - Layouts amplios, admin panels
  '2xl': '112rem',  // 1120px - Desktop wide layouts
  '3xl': '128rem',  // 1280px - Extra wide layouts  
  '4xl': '144rem',  // 1440px - Ultra wide monitors
  '5xl': '160rem',  // 1600px - Design/video workstations
  '6xl': '192rem',  // 1920px - Full HD layouts
  full: '100%',     // Sin restricción de ancho
  screen: '100vw'   // Ancho completo viewport
};

// ===== 🎚️ BORDER_RADIUS_SCALE - RADIOS DE BORDE =====
/**
 * Para: border-radius
 * Optimizado para: Diferentes niveles de "suavidad" visual
 * Escala: none → 3xl + full
 */
export const BORDER_RADIUS_SCALE = {
  none: '0',        // Sin redondeo - elementos técnicos
  xs: '0.2rem',     // 2px - Redondeo sutil
  sm: '0.4rem',     // 4px - Redondeo suave
  md: '0.8rem',     // 8px - Redondeo estándar, DEFAULT
  lg: '1.2rem',     // 12px - Redondeo pronunciado
  xl: '1.6rem',     // 16px - Redondeo destacado
  '2xl': '2.4rem',  // 24px - Redondeo dramático
  '3xl': '3.2rem',  // 32px - Redondeo extremo
  full: '9999px'    // Circular/pill
};

// ===== 🎭 SHADOW_SCALE - SISTEMA DE SOMBRAS =====
/**
 * Para: box-shadow
 * Optimizado para: Elevación y profundidad
 * Escala: none → 6xl
 * Inspirado en Material Design pero más sútil
 */
export const SHADOW_SCALE = {
  none: 'none',
  xs: '0 1px 2px rgba(0, 0, 0, 0.05)',           // Hover sutil
  sm: '0 1px 3px rgba(0, 0, 0, 0.1)',            // Elementos ligeramente elevados
  md: '0 4px 6px rgba(0, 0, 0, 0.1)',            // Cards, dropdowns
  lg: '0 8px 15px rgba(0, 0, 0, 0.1)',           // Modales, overlays
  xl: '0 20px 25px rgba(0, 0, 0, 0.1)',          // Elementos flotantes principales
  '2xl': '0 25px 50px rgba(0, 0, 0, 0.15)',      // Modales importantes
  '3xl': '0 35px 60px rgba(0, 0, 0, 0.15)',      // Hero elements
  '4xl': '0 45px 70px rgba(0, 0, 0, 0.2)',       // Elementos dramáticos
  '5xl': '0 50px 100px rgba(0, 0, 0, 0.2)',      // Ultra elevación
  '6xl': '0 60px 120px rgba(0, 0, 0, 0.25)'      // Máxima elevación
};

// ===== 🌐 STANDARD_WIDTHS - ANCHOS UNIVERSALES =====
/**
 * Para: width prop de todos los componentes
 * Optimizado para: Control de ancho independiente del size
 */
export const STANDARD_WIDTHS = {
  auto: 'auto',           // Ancho automático (natural del componente)
  full: '100%',           // 100% del contenedor padre
  screen: '100vw',        // 100% del viewport
  'fit-content': 'fit-content', // Ajustar al contenido
  'min-content': 'min-content', // Ancho mínimo necesario
  'max-content': 'max-content', // Ancho máximo posible
  // También acepta CONTAINER_SCALE para casos específicos
  ...CONTAINER_SCALE
};

// ===== 🎨 VARIANTES DE COLOR (MANTENIDAS) =====
export const COLOR_VARIANTS = {
  primary: {
    bg: 'var(--color-primary)',
    bgHover: 'var(--color-primary-hover)',
    bgLight: 'var(--color-primary-light)',
    bgDark: 'var(--color-primary-dark)',
    text: 'var(--text-on-primary)',
    border: 'var(--color-primary)',
    borderHover: 'var(--color-primary-hover)'
  },
  secondary: {
    bg: 'var(--color-secondary)',
    bgHover: 'var(--color-secondary-hover)',
    bgLight: 'var(--color-secondary-light)',
    bgDark: 'var(--color-secondary-dark)',
    text: 'var(--text-on-secondary)',
    border: 'var(--color-secondary)',
    borderHover: 'var(--color-secondary-hover)'
  },
  success: {
    bg: 'var(--color-success)',
    bgHover: 'var(--color-success-hover)',
    bgLight: 'var(--color-success-light)',
    bgDark: 'var(--color-success-dark)',
    text: 'var(--text-on-success)',
    border: 'var(--color-success)',
    borderHover: 'var(--color-success-hover)'
  },
  warning: {
    bg: 'var(--color-warning)',
    bgHover: 'var(--color-warning-hover)',
    bgLight: 'var(--color-warning-light)',
    bgDark: 'var(--color-warning-dark)',
    text: 'var(--text-on-warning)',
    border: 'var(--color-warning)',
    borderHover: 'var(--color-warning-hover)'
  },
  danger: {
    bg: 'var(--color-danger)',
    bgHover: 'var(--color-danger-hover)',
    bgLight: 'var(--color-danger-light)',
    bgDark: 'var(--color-danger-dark)',
    text: 'var(--text-on-danger)',
    border: 'var(--color-danger)',
    borderHover: 'var(--color-danger-hover)'
  },
  neutral: {
    bg: 'var(--gray-100)',
    bgHover: 'var(--gray-200)',
    bgLight: 'var(--gray-50)',
    bgDark: 'var(--gray-300)',
    text: 'var(--text-primary)',
    border: 'var(--border-default)',
    borderHover: 'var(--border-hover)'
  }
};

// ===== 📱 BREAKPOINTS RESPONSIVE =====
export const BREAKPOINTS = {
  sm: '640px',      // Móviles grandes
  md: '768px',      // Tablets
  lg: '1024px',     // Desktop pequeño
  xl: '1280px',     // Desktop estándar
  '2xl': '1536px'   // Desktop grande
};

// ===== 🔧 FUNCIONES HELPER AVANZADAS =====

/**
 * Obtiene tokens de tamaño para componente interactivo
 */
export const getComponentSizeTokens = (size = 'md') => {
  return COMPONENT_SIZES[size] || COMPONENT_SIZES.md;
};

/**
 * Obtiene tokens de tipografía
 */
export const getTypographyTokens = (size = 'md') => {
  return TYPOGRAPHY_SCALE[size] || TYPOGRAPHY_SCALE.md;
};

/**
 * Obtiene token de espaciado
 */
export const getSpacingToken = (size = 'md') => {
  return SPACING_SCALE[size] || SPACING_SCALE.md;
};

/**
 * Obtiene token de contenedor
 */
export const getContainerToken = (size = 'lg') => {
  return CONTAINER_SCALE[size] || CONTAINER_SCALE.lg;
};

/**
 * Manejo de responsive props
 */
export const getResponsiveValue = (prop, breakpoint = 'base') => {
  if (typeof prop === 'string') return prop;
  if (typeof prop === 'object' && prop !== null) {
    return prop[breakpoint] || prop.base || prop;
  }
  return prop;
};

/**
 * Convierte tokens a estilos CSS
 */
export const tokensToStyles = (tokens) => {
  // Validar entrada
  if (!tokens || typeof tokens !== 'object') {
    return {};
  }
  
  const styles = {};
  
  // Convertir cada token a propiedad CSS
  Object.entries(tokens).forEach(([key, value]) => {
    // Solo procesar valores string válidos
    if (value && typeof value === 'string') {
      // Mapear nombres de tokens a propiedades CSS
      const cssPropertyMap = {
        height: 'height',
        padding: 'padding', 
        fontSize: 'fontSize',
        iconSize: '--icon-size',
        borderRadius: 'borderRadius',
        minWidth: 'minWidth',
        width: 'width',
        lineHeight: 'lineHeight',
        letterSpacing: 'letterSpacing',
        fontWeight: 'fontWeight',
        boxShadow: 'boxShadow',
        margin: 'margin',
        marginTop: 'marginTop',
        marginBottom: 'marginBottom',
        marginLeft: 'marginLeft',
        marginRight: 'marginRight'
      };
      
      const cssProperty = cssPropertyMap[key] || key;
      styles[cssProperty] = value;
    }
    // También procesar objetos anidados (como variant tokens)
    else if (value && typeof value === 'object' && !Array.isArray(value)) {
      // Para objetos de tokens (como variant), agregar propiedades específicas
      if (key === 'variant' && value.bg) {
        styles.backgroundColor = value.bg;
        styles.color = value.text;
        if (value.border) styles.borderColor = value.border;
      }
    }
  });
  
  return styles;
};

// ===== 📦 EXPORT PRINCIPAL =====
export const DESIGN_TOKENS_V2 = {
  // Escalas especializadas
  componentSizes: COMPONENT_SIZES,
  spacing: SPACING_SCALE,
  typography: TYPOGRAPHY_SCALE,
  containers: CONTAINER_SCALE,
  borderRadius: BORDER_RADIUS_SCALE,
  shadows: SHADOW_SCALE,
  widths: STANDARD_WIDTHS,
  
  // Sistemas complementarios
  variants: COLOR_VARIANTS,
  breakpoints: BREAKPOINTS,
  
  // Helpers
  helpers: {
    getComponentSizeTokens,
    getTypographyTokens,
    getSpacingToken,
    getContainerToken,
    getResponsiveValue,
    tokensToStyles
  }
};

// ===== 🏷️ CONSTANTES PARA DESARROLLADORES =====

// Tamaños disponibles por categoria
export const COMPONENT_SIZE_VALUES = ['xs', 'sm', 'md', 'lg', 'xl'];
export const TYPOGRAPHY_SIZE_VALUES = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl'];
export const SPACING_SIZE_VALUES = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl'];
export const CONTAINER_SIZE_VALUES = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', 'full', 'screen'];
export const BORDER_RADIUS_VALUES = ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', 'full'];
export const SHADOW_VALUES = ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl'];
export const WIDTH_VALUES = ['auto', 'full', 'screen', 'fit-content', 'min-content', 'max-content', ...CONTAINER_SIZE_VALUES];

export default DESIGN_TOKENS_V2;