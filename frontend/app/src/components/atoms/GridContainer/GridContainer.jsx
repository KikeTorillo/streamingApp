// GridContainer.jsx - ÁTOMO DEL SISTEMA DE DISEÑO PARA LAYOUTS GRID

/* eslint-disable react-refresh/only-export-components */

import { Children, cloneElement } from 'react';
import PropTypes from 'prop-types';
import { useContainerProps } from '../../../hooks/useStandardProps-v2.jsx';
import { CONTAINER_PROP_TYPES, extractDOMPropsV2 } from '../../../tokens/standardProps-v2';
import './GridContainer.css';

/**
 * GridContainer - ÁTOMO V2.0 PARA LAYOUTS CSS GRID ESPECIALIZADOS
 * 
 * 🚀 MIGRADO: Sistema V2.0 con arquitectura especializada para contenedores
 * ✅ CONTAINER SPECIALIZED: Tokens específicos para layouts y composición
 * ✅ RESPONSIVE: Soporte nativo para breakpoints en columnas y spacing
 * ✅ TYPE-SAFE: Validación especializada para componentes contenedores
 * ✅ GRID AREAS: Manejo automático de grid-area para children
 * ✅ PERFORMANCE: Tokens especializados + memoización
 * 
 * CASOS DE USO:
 * - <GridContainer columns="repeat(auto-fit, minmax(20rem, 1fr))" gap="lg">Cards responsivas</GridContainer>
 * - <GridContainer columns="1fr 1fr" gap="md">Layout 2 columnas</GridContainer>
 * - <GridContainer columns={{ base: "1fr", md: "repeat(3, 1fr)" }}>Responsive grid</GridContainer>
 * 
 * GRID AREAS V2.0:
 * <GridContainer areas='"header header" "sidebar main"' gap="lg">
 *   <Header area="header" />
 *   <Sidebar area="sidebar" />
 *   <Main area="main" />
 * </GridContainer>
 */
function GridContainer(props) {
  // ✅ USAR HOOK ESPECIALIZADO PARA CONTENEDORES
  const {
    size,
    variant,
    padding,
    gap,
    margin,
    disabled,
    loading,
    className,
    tokens,
    generateClassName,
    generateStyles,
    currentBreakpoint,
    componentType,
    ...standardProps
  } = useContainerProps(props, {
    componentName: 'GridContainer',
    defaultSize: 'lg',
    defaultVariant: 'neutral', // ✅ Neutral para ser transparente
    enableResponsive: true
  });

  // ✅ EXTRAER PROPS ESPECÍFICAS DE CSS GRID
  const {
    children,
    as = 'div',
    columns = 'auto-fit',
    minColumnWidth = '20rem',
    rows = 'auto',
    gap: legacyGap, // Propiedad legacy (conflicto con hook)
    spacing: legacySpacing, // Nueva propiedad estandarizada (conflicto con hook)
    columnGap,
    rowGap,
    padding: legacyPadding = null, // Conflicto con hook
    align = 'stretch',
    justify = 'stretch',
    autoRows = 'auto',
    areas,
    inline = false,
    dense = false,
    style = {}
  } = props;

  // ✅ MAPEO DE PROPS V2.0: Priorizar props del hook, luego legacy
  const effectiveGap = gap || legacySpacing || legacyGap;
  const effectivePadding = padding || legacyPadding;

  // ✅ DEPRECATION WARNINGS V2.0 para props legacy
  if (import.meta.env?.DEV && (legacyGap || legacySpacing || legacyPadding)) {
    const warnings = [];
    if (legacyGap) warnings.push('prop "gap" deprecada → usar hook V2.0 gap');
    if (legacySpacing) warnings.push('prop "spacing" deprecada → usar hook V2.0 gap');
    if (legacyPadding) warnings.push('prop "padding" deprecada → usar hook V2.0 padding');
    
    console.warn(`🔄 GridContainer (V2): ${warnings.join(', ')}`);
  }

  // ✅ GENERAR CLASES CSS CON GENERADOR V2.0
  const baseClassName = generateClassName('grid-container');
  
  const gridClasses = [
    baseClassName,
    columnGap && `grid-container--column-gap-${columnGap}`,
    rowGap && `grid-container--row-gap-${rowGap}`,
    `grid-container--align-${align}`,
    `grid-container--justify-${justify}`,
    inline && 'grid-container--inline',
    dense && 'grid-container--dense'
  ].filter(Boolean).join(' ');

  // ✅ ESTILOS MANUALES - EVITAR generateStyles AUTOMÁTICO
  const gridStyles = {
    // Solo estilos específicos de grid que necesitamos
    display: inline ? 'inline-grid' : 'grid',
    
    // Gap desde hook o props
    ...(effectiveGap && { gap: tokens?.gap || `var(--space-${effectiveGap})` }),
    ...(columnGap && { columnGap: `var(--space-${columnGap})` }),
    ...(rowGap && { rowGap: `var(--space-${rowGap})` }),
    
    // Padding desde hook o props
    ...(effectivePadding && { padding: `var(--space-${effectivePadding})` }),
    
    // Alineación
    alignItems: align,
    justifyItems: justify,
    
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
    
    // Dense packing
    ...(dense && { gridAutoFlow: 'dense' }),
    
    // Combinar con estilos que vienen de props
    ...style
    // NO usar generateStyles para evitar estilos automáticos no deseados
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

  // ✅ FILTRAR PROPS PARA DOM V2.0 - extractDOMPropsV2 ya filtra todo lo necesario
  const domProps = extractDOMPropsV2({
    ...standardProps,
    ...props,
    // Props del hook V2 que NO deben ir al DOM
    tokens,
    generateClassName,
    generateStyles,
    currentBreakpoint,
    componentType
  });

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
  // ✅ PROPS ESPECIALIZADAS V2.0 PARA COMPONENTES CONTENEDORES
  ...CONTAINER_PROP_TYPES,
  
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
  
  /** Gap general usando tokens del sistema (deprecado, usar spacing) */
  gap: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl']),
  
  /** Espaciado general usando tokens del sistema */
  spacing: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl']),
  
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
  size: 'lg',
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