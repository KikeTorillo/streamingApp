// FlexContainer.jsx - ÁTOMO DEL SISTEMA DE DISEÑO

/* eslint-disable react-refresh/only-export-components */

import PropTypes from 'prop-types';
import { useStandardProps } from '../../../hooks/useStandardProps';
import { STANDARD_PROP_TYPES, extractDOMProps } from '../../../tokens';
import './FlexContainer.css';

/**
 * FlexContainer - ÁTOMO PARA LAYOUTS FLEXBOX ESTANDARIZADOS
 * 
 * ✅ OBJETIVO: Eliminar 40+ usos repetitivos de display: flex en el proyecto
 * ✅ SISTEMA ESTÁNDAR: Props unificadas con otros componentes
 * ✅ TOKENS AUTOMÁTICOS: Gap, spacing y alignment del sistema
 * ✅ RESPONSIVE: Adaptación automática por breakpoints
 * ✅ CASOS DE USO: Headers, barras de navegación, formularios, cards
 * 
 * CASOS COMUNES A REEMPLAZAR:
 * - style={{ display: 'flex', gap: 'var(--space-lg)', alignItems: 'center' }}
 * - style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
 * - style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-md)' }}
 */
function FlexContainer(props) {
  // ✅ USAR HOOK ESTÁNDAR DEL SISTEMA
  const {
    size,
    variant,
    disabled,
    loading,
    className,
    ...standardProps
  } = useStandardProps(props, {
    componentType: 'flexcontainer',
    defaultSize: 'md',
    defaultVariant: 'neutral', // Neutral por defecto para layout
    defaultRounded: 'none'
  });

  // ✅ EXTRAER PROPS ESPECÍFICAS DE FLEXBOX
  const {
    children,
    as = 'div',
    direction = 'row',
    align = 'stretch', 
    justify = 'flex-start',
    wrap = 'nowrap',
    gap,
    padding = null, // ✅ NUEVO: Padding interno del contenedor
    inline = false,
    grow = false,
    shrink = false,
    distribute = false, // Nueva prop para distribuir espacio equitativamente
    style = {}
  } = props;

  // ✅ GENERAR CLASES CSS CON SISTEMA ESTÁNDAR
  const flexClasses = [
    'flex-container',
    `flex-container--direction-${direction}`,
    `flex-container--align-${align}`,
    `flex-container--justify-${justify}`,
    `flex-container--wrap-${wrap}`,
    gap && `flex-container--gap-${gap}`,
    padding && `flex-container--padding-${padding}`, // ✅ NUEVO: Clase de padding
    `flex-container--size-${size}`,
    variant !== 'neutral' && `flex-container--variant-${variant}`,
    inline && 'flex-container--inline',
    grow && 'flex-container--grow',
    shrink && 'flex-container--shrink',
    distribute && 'flex-container--distribute',
    loading && 'flex-container--loading',
    disabled && 'flex-container--disabled',
    className
  ].filter(Boolean).join(' ');

  // ✅ ESTILOS DINÁMICOS MÍNIMOS (CSS maneja la mayoría)
  const flexStyles = {
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
      className={flexClasses}
      style={flexStyles}
    >
      {loading && (
        <div className="flex-container__loading">
          <div className="flex-container__spinner"></div>
        </div>
      )}
      {children}
    </Element>
  );
}

FlexContainer.propTypes = {
  // ✅ PROPS ESTÁNDAR DEL SISTEMA DE DISEÑO
  ...STANDARD_PROP_TYPES,
  
  /**
   * Contenido del componente
   */
  children: PropTypes.node,
  
  /**
   * Elemento HTML a renderizar
   */
  as: PropTypes.string,
  
  /**
   * Dirección del flex (row, column, row-reverse, column-reverse)
   */
  direction: PropTypes.oneOf(['row', 'column', 'row-reverse', 'column-reverse']),
  
  /**
   * Alineación en el eje transversal (align-items)
   */
  align: PropTypes.oneOf(['flex-start', 'flex-end', 'center', 'stretch', 'baseline']),
  
  /**
   * Alineación en el eje principal (justify-content)
   */
  justify: PropTypes.oneOf([
    'flex-start', 'flex-end', 'center', 'space-between', 
    'space-around', 'space-evenly'
  ]),
  
  /**
   * Comportamiento de wrap (flex-wrap)
   */
  wrap: PropTypes.oneOf(['nowrap', 'wrap', 'wrap-reverse']),
  
  /**
   * Espaciado entre elementos (gap) usando tokens del sistema
   */
  gap: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl']),
  
  /**
   * Padding interno del contenedor usando tokens del sistema
   */
  padding: PropTypes.oneOf(['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl']),
  
  /**
   * Usar display: inline-flex en lugar de flex
   */
  inline: PropTypes.bool,
  
  /**
   * Aplicar flex-grow: 1 al contenedor
   */
  grow: PropTypes.bool,
  
  /**
   * Aplicar flex-shrink: 1 al contenedor
   */
  shrink: PropTypes.bool,
  
  /**
   * Distribuir espacio equitativamente entre hijos (flex: 1 para cada hijo)
   */
  distribute: PropTypes.bool,
  
  /**
   * Estilos CSS adicionales (compatibilidad con gridArea, etc.)
   */
  style: PropTypes.object
};

FlexContainer.defaultProps = {
  size: 'md',
  variant: 'neutral',
  disabled: false,
  loading: false,
  className: '',
  as: 'div',
  direction: 'row',
  align: 'stretch',
  justify: 'flex-start',
  wrap: 'nowrap',
  padding: null, // ✅ NUEVO: Sin padding por defecto
  inline: false,
  grow: false,
  shrink: false,
  distribute: false
};

// ===== EXPORTS ===== 

export { FlexContainer };

// ✅ CONSTANTES PARA DESARROLLO
export const FLEX_DIRECTIONS = {
  ROW: 'row',
  COLUMN: 'column',
  ROW_REVERSE: 'row-reverse',
  COLUMN_REVERSE: 'column-reverse'
};

export const FLEX_ALIGNS = {
  START: 'flex-start',
  END: 'flex-end', 
  CENTER: 'center',
  STRETCH: 'stretch',
  BASELINE: 'baseline'
};

export const FLEX_JUSTIFIES = {
  START: 'flex-start',
  END: 'flex-end',
  CENTER: 'center',
  BETWEEN: 'space-between',
  AROUND: 'space-around',
  EVENLY: 'space-evenly'
};

export const FLEX_WRAPS = {
  NOWRAP: 'nowrap',
  WRAP: 'wrap',
  WRAP_REVERSE: 'wrap-reverse'
};