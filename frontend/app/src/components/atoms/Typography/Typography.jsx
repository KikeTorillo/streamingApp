// Typography.jsx - ÁTOMO DEL SISTEMA DE DISEÑO PARA TIPOGRAFÍA

/* eslint-disable react-refresh/only-export-components */

import PropTypes from 'prop-types';
import { useStandardProps } from '../../../hooks/useStandardProps';
import { STANDARD_PROP_TYPES, extractDOMProps } from '../../../tokens';
import './Typography.css';

/**
 * Typography - ÁTOMO PARA TIPOGRAFÍA SEMÁNTICA ESTANDARIZADA
 * 
 * ✅ OBJETIVO: Eliminar 13+ usos repetitivos de fontSize inline en el proyecto
 * ✅ SISTEMA ESTÁNDAR: Props unificadas con otros componentes
 * ✅ TOKENS AUTOMÁTICOS: Font sizes, weights y line heights del sistema
 * ✅ SEMÁNTICA: Elementos HTML correctos según contexto
 * ✅ ACCESIBILIDAD: Jerarquía visual y semántica correcta
 * 
 * CASOS COMUNES A REEMPLAZAR:
 * - style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-semibold)' }}
 * - <h1 style={{ fontSize: 'var(--font-size-2xl)' }}>
 * - <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)' }}>
 */
function Typography(props) {
  // ✅ USAR HOOK ESTÁNDAR DEL SISTEMA
  const {
    size,
    variant,
    disabled,
    loading,
    className,
    ...standardProps
  } = useStandardProps(props, {
    componentType: 'typography',
    defaultSize: 'md',
    defaultVariant: 'neutral', // Neutral por defecto para texto
    defaultRounded: 'none'
  });

  // ✅ EXTRAER PROPS ESPECÍFICAS DE TIPOGRAFÍA
  const {
    children,
    as,
    element = 'p',
    weight = 'normal',
    align = 'left',
    color,
    truncate = false,
    italic = false,
    underline = false,
    lineHeight,
    maxLines,
    uppercase = false,
    lowercase = false
  } = props;

  // ✅ DETERMINAR ELEMENTO HTML AUTOMÁTICAMENTE
  const getElement = () => {
    if (as) return as;
    
    // Mapeo semántico automático según size
    const semanticMapping = {
      '3xl': 'h1',
      '2xl': 'h1', 
      'xl': 'h2',
      'lg': 'h3',
      'md': 'p',
      'sm': 'span',
      'xs': 'small'
    };
    
    return semanticMapping[size] || element;
  };

  // ✅ GENERAR CLASES CSS CON SISTEMA ESTÁNDAR
  const typographyClasses = [
    'typography',
    `typography--size-${size}`,
    `typography--weight-${weight}`,
    `typography--align-${align}`,
    variant !== 'neutral' && `typography--variant-${variant}`,
    color && `typography--color-${color}`,
    truncate && 'typography--truncate',
    italic && 'typography--italic',
    underline && 'typography--underline',
    uppercase && 'typography--uppercase',
    lowercase && 'typography--lowercase',
    lineHeight && `typography--line-height-${lineHeight}`,
    maxLines && `typography--max-lines-${maxLines}`,
    loading && 'typography--loading',
    disabled && 'typography--disabled',
    className
  ].filter(Boolean).join(' ');

  // ✅ ESTILOS DINÁMICOS MÍNIMOS
  const typographyStyles = {
    opacity: disabled ? '0.5' : '1',
    // Limitar líneas si se especifica
    ...(maxLines && {
      display: '-webkit-box',
      WebkitLineClamp: maxLines,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden'
    })
  };

  // ✅ FILTRAR PROPS PARA DOM
  const domProps = extractDOMProps(standardProps);

  // ✅ CREAR ELEMENTO DINÁMICO
  const Element = getElement();

  return (
    <Element 
      className={typographyClasses}
      style={typographyStyles}
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
  // ✅ PROPS ESTÁNDAR DEL SISTEMA DE DISEÑO
  ...STANDARD_PROP_TYPES,
  
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
   * Peso de la fuente
   */
  weight: PropTypes.oneOf([
    'light', 'normal', 'medium', 'semibold', 'bold', 'extrabold'
  ]),
  
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

// ✅ CONSTANTES PARA DESARROLLO
export const TYPOGRAPHY_SIZES = {
  XS: 'xs',      // 1.2rem - Small text, captions
  SM: 'sm',      // 1.4rem - Secondary text
  MD: 'md',      // 1.6rem - Body text (default)
  LG: 'lg',      // 1.8rem - Subheadings
  XL: 'xl',      // 2.4rem - Headings
  '2XL': '2xl',  // 3.0rem - Large headings
  '3XL': '3xl'   // 3.6rem - Display headings
};

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