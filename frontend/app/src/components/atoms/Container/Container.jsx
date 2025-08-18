// Container.jsx - MIGRADO AL SISTEMA DE DISEÑO ESTÁNDAR

/* eslint-disable react-refresh/only-export-components */

import PropTypes from 'prop-types';
import { useStandardProps } from '../../../hooks/useStandardProps';
import { STANDARD_PROP_TYPES, extractDOMProps } from '../../../tokens';
import './Container.css';

/**
 * Container - ÁTOMO MIGRADO AL SISTEMA DE DISEÑO ESTÁNDAR
 * 
 * ✅ MIGRADO: Hook useStandardProps integrado
 * ✅ PROPS ESTÁNDAR: size, variant, rounded, loading, className
 * ✅ TOKENS AUTOMÁTICOS: Spacing y sizing del sistema
 * ✅ BACKWARD COMPATIBILITY: Deprecation warnings para props legacy
 * ✅ VARIANTES ESTÁNDAR: 6 variantes semánticas unificadas
 * 
 * CAMBIOS EN LA MIGRACIÓN:
 * - variant="default" → variant="primary" (con deprecation warning)
 * - Integración con sistema de tokens automáticos
 * - Props estándar unificadas con otros componentes
 * - Deprecation warning para prop 'debug' (usar className en su lugar)
 */
function Container(props) {
  // ✅ MANEJAR TAMAÑOS ESPECÍFICOS DE CONTAINER ANTES DE useStandardProps
  const { size: originalSize, ...propsForStandardHook } = props;
  
  // Container acepta tamaños adicionales: 'full'
  const containerSpecificSizes = ['full'];
  const isContainerSpecificSize = containerSpecificSizes.includes(originalSize);
  
  // Si es un tamaño específico de Container, usar 'xl' para useStandardProps (evitar warning)
  const propsForHook = isContainerSpecificSize 
    ? { ...propsForStandardHook, size: 'xl' }
    : props;

  // ✅ USAR HOOK ESTÁNDAR CON CONFIGURACIÓN ESPECÍFICA
  const {
    size: standardSize,
    variant,
    disabled,
    loading,
    className,
    ...standardProps
  } = useStandardProps(propsForHook, {
    componentType: 'container',
    defaultSize: 'md',
    defaultVariant: 'neutral', // ✅ Neutral por defecto para layout
    defaultRounded: 'none'      // ✅ Sin bordes por defecto para layout
  });

  // ✅ USAR EL TAMAÑO ORIGINAL SI ES ESPECÍFICO DE CONTAINER
  const finalSize = isContainerSpecificSize ? originalSize : standardSize;

  // ✅ EXTRAER PROPS ESPECÍFICAS DE CONTAINER
  const {
    children,
    as = 'div',
    debug,
    spacing,
    padding,
    style = {},
    // Props legacy con warnings
    variant: originalVariant
  } = props;

  // ✅ DEPRECATION WARNING para variant="default"
  if (originalVariant === 'default' && typeof window !== 'undefined') {
    console.warn(
      '⚠️ DEPRECATION WARNING: Container variant="default" is deprecated. Use variant="primary" instead.',
      '\n📖 Migration guide: https://docs.streamingapp.com/components/container#migration'
    );
  }

  // ✅ DEPRECATION WARNING para prop debug
  if (debug !== undefined && typeof window !== 'undefined') {
    console.warn(
      '⚠️ DEPRECATION WARNING: Container debug prop is deprecated. Use className="debug-containers" instead.',
      '\n📖 Migration guide: https://docs.streamingapp.com/components/container#migration'
    );
  }

  // ✅ GENERAR CLASES CSS CON SISTEMA ESTÁNDAR
  const containerClasses = [
    `container-${finalSize}`,
    `container-${finalSize}--${variant}`,
    loading && 'container--loading',
    debug && 'debug-containers', // Mantener temporalmente
    className
  ].filter(Boolean).join(' ');

  // ✅ ESTILOS AUTOMÁTICOS CON TOKENS (aplicados via CSS)
  const containerStyles = {
    // Espaciado personalizado opcional
    ...(spacing && { gap: `var(--space-${spacing})` }),
    ...(padding && { padding }),
    // Estados
    opacity: disabled ? '0.5' : '1',
    pointerEvents: disabled ? 'none' : 'auto',
    ...style // ✅ COMBINAR con estilos que vienen de props
  };

  // ✅ FILTRAR PROPS PARA DOM
  const domProps = extractDOMProps(standardProps);

  // ✅ CREAR ELEMENTO DINÁMICO
  const Element = as;

  return (
    <Element 
      {...domProps}
      className={containerClasses}
      style={containerStyles}
    >
      {loading && (
        <div className="container__loading">
          <div className="container__spinner"></div>
        </div>
      )}
      {children}
    </Element>
  );
}

Container.propTypes = {
  // ✅ PROPS ESTÁNDAR DEL SISTEMA DE DISEÑO
  ...STANDARD_PROP_TYPES,
  
  /**
   * Contenido del componente
   */
  children: PropTypes.node.isRequired,
  
  /**
   * Elemento HTML a renderizar (div, section, main, etc.)
   */
  as: PropTypes.string,
  
  /**
   * Espaciado interno personalizado (sobrescribe tokens automáticos)
   */
  padding: PropTypes.string,
  
  /**
   * Espaciado entre elementos hijos (gap)
   */
  spacing: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', '2xl']),
  
  /**
   * Estilos CSS adicionales (compatibilidad con gridArea, etc.)
   */
  style: PropTypes.object,
  
  // ✅ PROPS LEGACY CON DEPRECATION WARNINGS
  /**
   * @deprecated Usar className="debug-containers" en su lugar
   */
  debug: PropTypes.bool
};

Container.defaultProps = {
  size: 'md',
  variant: 'neutral', // ✅ Neutral por defecto para layout
  rounded: 'none',    // ✅ Sin bordes por defecto para layout
  disabled: false,
  loading: false,
  className: '',
  as: 'div'
};

// ===== EXPORTS ACTUALIZADOS =====

export { Container };

// ✅ TAMAÑOS ESTÁNDAR DEL SISTEMA
export const CONTAINER_SIZES = {
  XS: 'xs',    // 480px - Modales, formularios login
  SM: 'sm',    // 640px - Artículos, detalles
  MD: 'md',    // 800px - Páginas estándar
  LG: 'lg',    // 1200px - Dashboards, admin
  XL: 'xl',    // 1440px - Layout principal
  FULL: 'full' // Sin límite - Páginas wide
};

// ✅ VARIANTES ESTÁNDAR DEL SISTEMA (6 variantes semánticas)
export const CONTAINER_VARIANTS = {
  PRIMARY: 'primary',      // Azul oceánico - contenedor principal
  SECONDARY: 'secondary',  // Naranja/dorado - contenedor secundario
  SUCCESS: 'success',      // Verde/azul - contenedor de éxito
  WARNING: 'warning',      // Amarillo/dorado - contenedor de advertencia
  DANGER: 'danger',        // Rojo - contenedor de error
  NEUTRAL: 'neutral'       // Gris - contenedor neutro (DEFAULT para layouts)
};

// ✅ MAPEO DE COMPATIBILIDAD (Legacy → Estándar)
export const CONTAINER_VARIANT_MAPPING = {
  'default': 'primary',
  'simple': 'neutral',
  'compact': 'primary',
  'flexible': 'neutral',
  'fullheight': 'primary',
  'centered': 'primary'
};