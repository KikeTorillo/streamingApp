// Container.jsx - MIGRADO A SISTEMA DE DISEÑO V2 (Compatibilidad preservada)

/* eslint-disable react-refresh/only-export-components */

import PropTypes from 'prop-types';
import { useContainerProps } from '../../hooks/useStandardProps.jsx';
import { CONTAINER_PROP_TYPES, extractDOMPropsV2 } from '../../index.js';
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
  // ✅ USAR HOOK ESPECIALIZADO PARA CONTENEDORES
  const {
    size: finalSize,
    variant,
    disabled,
    loading,
    className,
    tokens,
    ...standardProps
  } = useContainerProps(props, {
    componentName: 'Container',
    defaultSize: 'md',
    defaultVariant: 'neutral', // ✅ Neutral por defecto (transparente)
    defaultRounded: 'none',
    enableResponsive: true
  });

  // ✅ DEBUG: Log para verificar configuración
  if (import.meta.env?.DEV && props.debug) {
    console.log('🐛 Container Debug:', {
      variant,
      finalSize,
      className,
      tokens
    });
  }

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

  // ✅ ESTILOS MANUALES - Solo estilos especificos necesarios
  const containerStyles = {
    // Solo estilos específicos que necesitamos
    ...(spacing && { gap: `var(--space-${spacing})` }),
    ...(padding && { padding }),
    ...(props.area && { gridArea: props.area }),
    ...style // ✅ Estilos que vienen de props
    // Aplicar solo estilos necesarios sin automatización
  };

  // ✅ FILTRAR PROPS PARA DOM
  const domProps = extractDOMPropsV2({ ...standardProps, ...props });

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
  // ✅ PROPS ESTÁNDAR DEL SISTEMA DE DISEÑO V2 (especializadas para contenedor)
  ...CONTAINER_PROP_TYPES,
  
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

  /**
   * Grid area para uso con GridContainer
   * Se convierte automáticamente en style={{ gridArea: area }}
   */
  area: PropTypes.string,
  
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