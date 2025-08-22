// GridContainer.jsx - ÁTOMO DEL SISTEMA DE DISEÑO PARA LAYOUTS GRID

/* eslint-disable react-refresh/only-export-components */

import { Children, cloneElement } from 'react';
import PropTypes from 'prop-types';
import { useStandardProps } from '../../../hooks/useStandardProps';
import { STANDARD_PROP_TYPES, extractDOMProps } from '../../../tokens';
import './GridContainer.css';

/**
 * GridContainer - ÁTOMO PARA LAYOUTS CSS GRID ESTANDARIZADOS
 * 
 * ✅ OBJETIVO: Eliminar 31+ usos repetitivos de display: grid en el proyecto
 * ✅ SISTEMA ESTÁNDAR: Props unificadas con otros componentes
 * ✅ TOKENS AUTOMÁTICOS: Gap, spacing y columnas del sistema
 * ✅ RESPONSIVE: Adaptación automática por breakpoints
 * ✅ GRID AREAS: Manejo automático de grid-area para children con prop 'area'
 * ✅ CASOS DE USO: Dashboards, galerías de contenido, formularios grid, layouts admin
 * 
 * CASOS COMUNES A REEMPLAZAR:
 * - style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(20rem, 1fr))', gap: 'var(--space-lg)' }}
 * - style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}
 * - style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}
 * 
 * NUEVO: Grid Areas automáticas
 * <GridContainer areas='"sidebar header" "sidebar main"'>
 *   <Sidebar area="sidebar" />
 *   <Header area="header" />
 *   <Main area="main" />
 * </GridContainer>
 */
function GridContainer(props) {
  // ✅ USAR HOOK ESTÁNDAR DEL SISTEMA
  const {
    size,
    variant,
    disabled,
    loading,
    className,
    ...standardProps
  } = useStandardProps(props, {
    componentType: 'gridcontainer',
    defaultSize: 'md',
    defaultVariant: 'neutral', // Neutral por defecto para layout
    defaultRounded: 'none'
  });

  // ✅ EXTRAER PROPS ESPECÍFICAS DE CSS GRID
  const {
    children,
    as = 'div',
    columns = 'auto-fit',
    minColumnWidth = '20rem',
    rows = 'auto',
    gap,
    columnGap,
    rowGap,
    padding = null, // ✅ NUEVO: Padding interno del contenedor
    align = 'stretch',
    justify = 'stretch',
    autoRows = 'auto',
    areas,
    inline = false,
    dense = false,
    style = {}
  } = props;

  // ✅ GENERAR CLASES CSS CON SISTEMA ESTÁNDAR
  const gridClasses = [
    'grid-container',
    `grid-container--size-${size}`,
    variant !== 'neutral' && `grid-container--variant-${variant}`,
    gap && `grid-container--gap-${gap}`,
    columnGap && `grid-container--column-gap-${columnGap}`,
    rowGap && `grid-container--row-gap-${rowGap}`,
    padding && `grid-container--padding-${padding}`, // ✅ NUEVO: Clase de padding
    `grid-container--align-${align}`,
    `grid-container--justify-${justify}`,
    inline && 'grid-container--inline',
    dense && 'grid-container--dense',
    loading && 'grid-container--loading',
    disabled && 'grid-container--disabled',
    className
  ].filter(Boolean).join(' ');

  // ✅ ESTILOS DINÁMICOS PARA GRID ESPECÍFICO
  const gridStyles = {
    // Configuración dinámica de columnas
    gridTemplateColumns: typeof columns === 'number' 
      ? `repeat(${columns}, 1fr)`
      : columns === 'auto-fit'
      ? `repeat(auto-fit, minmax(${minColumnWidth}, 1fr))`
      : columns === 'auto-fill'
      ? `repeat(auto-fill, minmax(${minColumnWidth}, 1fr))`
      : columns,
    
    // Configuración de filas si se especifica
    ...(rows !== 'auto' && { 
      gridTemplateRows: typeof rows === 'number' 
        ? `repeat(${rows}, 1fr)` 
        : rows 
    }),
    
    // Auto rows
    ...(autoRows !== 'auto' && { gridAutoRows: autoRows }),
    
    // Grid areas si se especifican
    ...(areas && { gridTemplateAreas: areas }),
    
    // Estados
    opacity: disabled ? '0.5' : '1',
    pointerEvents: disabled ? 'none' : 'auto',
    ...style // ✅ COMBINAR con estilos que vienen de props
  };

  // ✅ PROCESAR CHILDREN CON GRID AREAS AUTOMÁTICAS
  const processedChildren = areas ? 
    Children.map(children, child => {
      // Si el child tiene prop 'area', agregar gridArea automáticamente
      if (child && child.props && child.props.area) {
        const childArea = child.props.area;
        return cloneElement(child, {
          style: { 
            gridArea: childArea,
            ...child.props.style // Preservar estilos existentes
          },
          // Remover la prop 'area' para que no se pase al DOM
          area: undefined
        });
      }
      return child;
    }) : children;

  // ✅ FILTRAR PROPS PARA DOM
  const domProps = extractDOMProps(standardProps);

  // ✅ CREAR ELEMENTO DINÁMICO
  const Element = as;

  return (
    <Element 
      {...domProps}
      className={gridClasses}
      style={gridStyles}
    >
      {loading && (
        <div className="grid-container__loading">
          <div className="grid-container__spinner"></div>
        </div>
      )}
      {processedChildren}
    </Element>
  );
}

GridContainer.propTypes = {
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
   * Configuración de columnas:
   * - Número: repeat(N, 1fr)
   * - 'auto-fit': repeat(auto-fit, minmax(minWidth, 1fr))
   * - 'auto-fill': repeat(auto-fill, minmax(minWidth, 1fr))
   * - String custom: '1fr 2fr 1fr'
   */
  columns: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.oneOf(['auto-fit', 'auto-fill']),
    PropTypes.string
  ]),
  
  /**
   * Ancho mínimo de columna para auto-fit/auto-fill
   */
  minColumnWidth: PropTypes.string,
  
  /**
   * Configuración de filas:
   * - 'auto': sin configuración específica
   * - Número: repeat(N, 1fr)
   * - String custom: '100px auto 50px'
   */
  rows: PropTypes.oneOfType([
    PropTypes.oneOf(['auto']),
    PropTypes.number,
    PropTypes.string
  ]),
  
  /**
   * Gap general usando tokens del sistema
   */
  gap: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl']),
  
  /**
   * Gap específico para columnas
   */
  columnGap: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl']),
  
  /**
   * Gap específico para filas
   */
  rowGap: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl']),
  
  /**
   * Padding interno del contenedor usando tokens del sistema
   */
  padding: PropTypes.oneOf(['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl']),
  
  /**
   * Alineación de elementos (align-items)
   */
  align: PropTypes.oneOf(['start', 'end', 'center', 'stretch']),
  
  /**
   * Justificación de elementos (justify-items)
   */
  justify: PropTypes.oneOf(['start', 'end', 'center', 'stretch']),
  
  /**
   * Altura automática de filas
   */
  autoRows: PropTypes.string,
  
  /**
   * Grid template areas (string CSS)
   */
  areas: PropTypes.string,
  
  /**
   * Usar display: inline-grid en lugar de grid
   */
  inline: PropTypes.bool,
  
  /**
   * Activar grid-auto-flow: dense
   */
  dense: PropTypes.bool,
  
  /**
   * Estilos CSS adicionales (compatibilidad con gridArea, etc.)
   */
  style: PropTypes.object,

  /**
   * NUEVO: Grid area automática para children
   * Se pasa como prop a los children que tengan prop 'area'
   * Ejemplo: <Component area="sidebar" /> → style={{ gridArea: 'sidebar' }}
   */
  area: PropTypes.string
};

GridContainer.defaultProps = {
  size: 'md',
  variant: 'neutral',
  disabled: false,
  loading: false,
  className: '',
  as: 'div',
  columns: 'auto-fit',
  minColumnWidth: '20rem',
  rows: 'auto',
  align: 'stretch',
  justify: 'stretch',
  autoRows: 'auto',
  padding: null, // ✅ NUEVO: Sin padding por defecto
  inline: false,
  dense: false
};

// ===== EXPORTS ===== 

export { GridContainer };

// ✅ CONSTANTES PARA DESARROLLO
export const GRID_COLUMNS = {
  AUTO_FIT: 'auto-fit',
  AUTO_FILL: 'auto-fill',
  ONE: 1,
  TWO: 2,
  THREE: 3,
  FOUR: 4,
  FIVE: 5,
  SIX: 6
};

export const GRID_ALIGNS = {
  START: 'start',
  END: 'end',
  CENTER: 'center', 
  STRETCH: 'stretch'
};

export const GRID_JUSTIFIES = {
  START: 'start',
  END: 'end',
  CENTER: 'center',
  STRETCH: 'stretch'
};