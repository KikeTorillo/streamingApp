// Typography.jsx - ÁTOMO DEL SISTEMA DE DISEÑO PARA TIPOGRAFÍA

/* eslint-disable react-refresh/only-export-components */

import PropTypes from 'prop-types';
import { useTypographyProps } from '../../../hooks/useStandardProps-v2.jsx';
import { TYPOGRAPHY_PROP_TYPES, extractDOMPropsV2 } from '../../../tokens/standardProps-v2';
import './Typography.css';

/**
 * Typography - ÁTOMO V2.0 PARA TIPOGRAFÍA ESPECIALIZADA
 * 
 * 🚀 MIGRADO: Sistema V2.0 con arquitectura especializada
 * ✅ JERARQUÍA COMPLETA: xs → 6xl (escala tipográfica profesional)
 * ✅ RESPONSIVE: Breakpoint support nativo
 * ✅ TYPE-SAFE: Validación especializada para tipografía
 * ✅ SEMÁNTICA: Mapeo automático HTML según tamaño
 * ✅ PERFORMANCE: Tokens especializados + memoización
 * 
 * CASOS DE USO:
 * - <Typography size="6xl">H1 Display headers</Typography>
 * - <Typography size="3xl">H2 Page titles</Typography>
 * - <Typography size="md">Body text (default)</Typography>
 * - <Typography size="xs">Captions, metadata</Typography>
 * 
 * RESPONSIVE:
 * - <Typography size={{ base: 'lg', md: '2xl', lg: '4xl' }}>Responsive heading</Typography>
 */
function Typography(props) {
  // ✅ USAR HOOK ESPECIALIZADO V2.0 PARA TIPOGRAFÍA
  const hookResult = useTypographyProps(props, {
    componentName: 'Typography',
    defaultSize: 'md',
    defaultVariant: 'neutral',
    enableResponsive: true
  });
  
  const {
    size,
    variant,
    weight,
    width,
    spacing,
    disabled,
    loading,
    className,
    tokens,
    generateClassName,
    generateStyles,
    currentBreakpoint,
    isInteractive,
    componentType,
    ...standardProps
  } = hookResult;

  // ✅ EXTRAER PROPS ESPECÍFICAS DE TIPOGRAFÍA
  const {
    children,
    as,
    element = 'p',
    align = 'left',
    color,
    truncate = false,
    italic = false,
    underline = false,
    lineHeight,
    maxLines,
    uppercase = false,
    lowercase = false,
    style: originalStyle = {}
  } = props;

  // ✅ DETERMINAR ELEMENTO HTML AUTOMÁTICAMENTE - ESCALA AMPLIADA V2
  const getElement = () => {
    if (as) return as;
    
    // Mapeo semántico automático según escala tipográfica completa
    const semanticMapping = {
      '6xl': 'h1',  // Display headers - máximo impacto
      '5xl': 'h1',  // Page headers - impacto alto
      '4xl': 'h1',  // Section headers - destacados
      '3xl': 'h2',  // Subsection headers
      '2xl': 'h3',  // Component headers
      'xl': 'h4',   // Small headers
      'lg': 'h5',   // Lead text, subtitles
      'md': 'p',    // Body text (default)
      'sm': 'span', // Small text, labels
      'xs': 'small' // Captions, metadata
    };
    
    return semanticMapping[size] || element;
  };

  // ✅ GENERAR CLASES CSS CON GENERADOR V2.0
  const baseClassName = generateClassName('typography');
  
  const typographyClasses = [
    baseClassName,
    `typography--align-${align}`,
    color && `typography--color-${color}`,
    truncate && 'typography--truncate',
    italic && 'typography--italic',
    underline && 'typography--underline',
    uppercase && 'typography--uppercase',
    lowercase && 'typography--lowercase',
    lineHeight && `typography--line-height-${lineHeight}`,
    maxLines && `typography--max-lines-${maxLines}`
  ].filter(Boolean).join(' ');

  // ✅ GENERAR ESTILOS CSS CON GENERADOR V2.0 + ESPECIFICOS
  const specificStyles = {
    // Limitar líneas si se especifica
    ...(maxLines && {
      display: '-webkit-box',
      WebkitLineClamp: maxLines,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden'
    })
  };
  
  const baseStyles = generateStyles(specificStyles);
  
  // ✅ ASEGURAR QUE STYLES SEA SIEMPRE UN OBJETO Y COMBINAR CON STYLE ORIGINAL
  const safeOriginalStyle = originalStyle && typeof originalStyle === 'object' && !Array.isArray(originalStyle) ? originalStyle : {};
  const safeBaseStyles = baseStyles && typeof baseStyles === 'object' && !Array.isArray(baseStyles) ? baseStyles : {};
  
  const finalStyles = {
    ...safeBaseStyles,
    ...safeOriginalStyle
  };

  // ✅ FILTRAR PROPS PARA DOM V2.0 - extractDOMPropsV2 ya filtra todo lo necesario
  const domProps = extractDOMPropsV2({
    ...standardProps,
    ...props,
    // Props del hook V2 que NO deben ir al DOM
    tokens,
    generateClassName,
    generateStyles, 
    currentBreakpoint,
    isInteractive,
    componentType
  });

  // ✅ CREAR ELEMENTO DINÁMICO
  const Element = getElement();

  return (
    <Element 
      className={typographyClasses}
      style={finalStyles}
      {...domProps}
    >
      {loading ? (
        <span className="typography__skeleton">Loading...</span>
      ) : (
        children
      )}
    </Element>
  );
}

Typography.propTypes = {
  // ✅ PROPS ESPECIALIZADAS V2.0 PARA TIPOGRAFÍA
  ...TYPOGRAPHY_PROP_TYPES,
  
  /**
   * Contenido del texto
   */
  children: PropTypes.node,
  
  /**
   * Elemento HTML específico (sobrescribe mapeo automático)
   */
  as: PropTypes.string,
  
  /**
   * Elemento HTML por defecto si no hay mapeo automático
   */
  element: PropTypes.string,
  
  /**
   * Peso de la fuente (ya incluido en TYPOGRAPHY_PROP_TYPES)
   * Valores: light, normal, medium, semibold, bold
   */
  // weight: ya incluido en TYPOGRAPHY_PROP_TYPES
  
  /**
   * Alineación del texto
   */
  align: PropTypes.oneOf(['left', 'center', 'right', 'justify']),
  
  /**
   * Color semántico del texto
   */
  color: PropTypes.oneOf([
    'primary', 'secondary', 'success', 'warning', 'danger', 
    'muted', 'light', 'dark'
  ]),
  
  /**
   * Truncar texto con ellipsis
   */
  truncate: PropTypes.bool,
  
  /**
   * Aplicar estilo italic
   */
  italic: PropTypes.bool,
  
  /**
   * Aplicar subrayado
   */
  underline: PropTypes.bool,
  
  /**
   * Altura de línea usando tokens
   */
  lineHeight: PropTypes.oneOf(['tight', 'normal', 'relaxed', 'loose']),
  
  /**
   * Limitar número de líneas (con ellipsis)
   */
  maxLines: PropTypes.number,
  
  /**
   * Transformar a mayúsculas
   */
  uppercase: PropTypes.bool,
  
  /**
   * Transformar a minúsculas
   */
  lowercase: PropTypes.bool
};

Typography.defaultProps = {
  size: 'md',
  variant: 'neutral',
  disabled: false,
  loading: false,
  className: '',
  element: 'p',
  weight: 'normal',
  align: 'left',
  truncate: false,
  italic: false,
  underline: false,
  uppercase: false,
  lowercase: false
};

// ===== EXPORTS =====

export { Typography };

// ✅ CONSTANTES V2.0 - ESCALA TIPOGRÁFICA COMPLETA
export const TYPOGRAPHY_SIZES_V2 = {
  XS: 'xs',      // 1.2rem - Captions, metadatos, texto legal
  SM: 'sm',      // 1.4rem - Body small, labels secundarios
  MD: 'md',      // 1.6rem - Body text (DEFAULT)
  LG: 'lg',      // 1.8rem - Lead text, subtítulos
  XL: 'xl',      // 2.0rem - H6, títulos pequeños
  '2XL': '2xl',  // 2.4rem - H5, títulos sección
  '3XL': '3xl',  // 3.0rem - H4, títulos principales
  '4XL': '4xl',  // 3.6rem - H3, títulos destacados
  '5XL': '5xl',  // 4.8rem - H2, títulos página
  '6XL': '6xl'   // 6.4rem - H1, display headers
};

// ✅ BACKWARD COMPATIBILITY
export const TYPOGRAPHY_SIZES = TYPOGRAPHY_SIZES_V2;

export const TYPOGRAPHY_WEIGHTS = {
  LIGHT: 'light',         // 300
  NORMAL: 'normal',       // 400 (default)
  MEDIUM: 'medium',       // 500
  SEMIBOLD: 'semibold',   // 600
  BOLD: 'bold',           // 700
  EXTRABOLD: 'extrabold'  // 800
};

export const TYPOGRAPHY_ALIGNS = {
  LEFT: 'left',
  CENTER: 'center',
  RIGHT: 'right',
  JUSTIFY: 'justify'
};

export const TYPOGRAPHY_COLORS = {
  PRIMARY: 'primary',     // Color principal del tema
  SECONDARY: 'secondary', // Color secundario
  SUCCESS: 'success',     // Verde
  WARNING: 'warning',     // Amarillo
  DANGER: 'danger',       // Rojo
  MUTED: 'muted',         // Gris claro
  LIGHT: 'light',         // Blanco/gris muy claro
  DARK: 'dark'            // Negro/gris oscuro
};

export const TYPOGRAPHY_LINE_HEIGHTS = {
  TIGHT: 'tight',     // 1.25
  NORMAL: 'normal',   // 1.5 (default)
  RELAXED: 'relaxed', // 1.625
  LOOSE: 'loose'      // 2
};