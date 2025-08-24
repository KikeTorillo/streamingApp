// components/molecules/ClusterLayout/ClusterLayout.jsx - LAYOUT HORIZONTAL INTELIGENTE  
// Recomendación #3 del Plan Optimización Final: 94% → 100%

import PropTypes from 'prop-types';
import { useInteractiveProps } from '../../../hooks/useStandardProps-v2.jsx';
import { LAYOUT_COMPONENT_PROP_TYPES } from '../../../tokens/propHelpers.js';
import { 
  LAYOUT_PATTERNS, 
  createClusterLayoutConfig,
  getResponsiveSpacing 
} from '../../../tokens/layoutPatterns.js';
import './ClusterLayout.css';

/**
 * ClusterLayout - LAYOUT HORIZONTAL RESPONSIVE AUTOMÁTICO
 * 
 * ✅ PROBLEMA RESUELTO: Agrupaciones horizontales que se adaptan a mobile
 * ✅ RESPONSIVE AUTOMÁTICO: row → column según breakpoint
 * ✅ PATTERNS PREDEFINIDOS: cluster, clusterSpaceBetween, tableActions, etc.
 * ✅ WRAPPING INTELIGENTE: Elementos que no caben pasan a nueva línea
 * 
 * @param {Object} props - Propiedades del componente
 * @param {'cluster'|'clusterSpaceBetween'|'clusterCenter'|'tableActions'|'tableFilters'} [props.pattern='cluster'] - Pattern predefinido
 * @param {'row'|'row-reverse'|Object} [props.direction] - Dirección del cluster (override pattern)
 * @param {string} [props.gap] - Gap entre elementos (override pattern)
 * @param {'start'|'center'|'end'|'stretch'|'baseline'} [props.align] - Alineación de elementos (override pattern)
 * @param {'flex-start'|'center'|'flex-end'|'space-between'|'space-around'|'space-evenly'} [props.justify] - Justificación de elementos
 * @param {boolean} [props.wrap=true] - Si permite wrapping de elementos
 * @param {string|Object} [props.padding] - Padding del contenedor
 * @param {string|Object} [props.margin] - Margin del contenedor
 * @param {React.ReactNode} props.children - Contenido del cluster
 */
function ClusterLayout(props) {
  // Configuración del cluster layout
  const clusterConfig = createClusterLayoutConfig(props);
  
  // ✅ V2 HOOK: Procesamiento completo con layout tokens
  const {
    // Props procesadas
    pattern = 'cluster',
    gap,
    align,
    justify,
    wrap = true,
    padding,
    margin,
    
    // Tokens especializados para layout
    tokens,
    
    // Helpers de estado  
    isDisabled,
    
    // Generadores
    generateClassName,
    generateStyles,
    
    // Meta información
    currentBreakpoint,
    
    // Debugging
    _debug
  } = useInteractiveProps(props, {
    componentName: 'ClusterLayout',
    componentType: 'container',
    defaultSize: 'md'
  });

  // Props específicas de ClusterLayout
  const {
    children,
    direction,
    testId,
    className: userClassName
  } = props;

  // ✅ PATTERN RESOLUTION: Resolver pattern a configuración
  const resolvedPattern = LAYOUT_PATTERNS[pattern] || LAYOUT_PATTERNS.cluster;
  
  // ✅ RESPONSIVE DIRECTION: Resolver dirección responsive
  const getResponsiveDirection = () => {
    if (direction) return direction;
    
    const patternDirection = resolvedPattern.direction;
    if (typeof patternDirection === 'string') {
      return patternDirection;
    }
    
    // Responsive direction object
    if (typeof patternDirection === 'object') {
      return patternDirection[currentBreakpoint] || patternDirection.base || 'row';
    }
    
    return 'row';
  };
  
  // ✅ RESPONSIVE SPACING: Calcular spacing automático
  const responsiveGap = gap || getResponsiveSpacing(
    resolvedPattern.gap || 'normal', 
    currentBreakpoint
  );
  
  // ✅ RESPONSIVE ALIGNMENT: Resolver alignment responsive
  const getResponsiveAlign = () => {
    const patternAlign = align || resolvedPattern.align;
    if (typeof patternAlign === 'string') {
      return patternAlign;
    }
    
    if (typeof patternAlign === 'object') {
      return patternAlign[currentBreakpoint] || patternAlign.base || 'center';
    }
    
    return 'center';
  };
  
  // ✅ RESPONSIVE JUSTIFY: Resolver justify responsive
  const getResponsiveJustify = () => {
    const patternJustify = justify || resolvedPattern.justify;
    if (typeof patternJustify === 'string') {
      return patternJustify;
    }
    
    if (typeof patternJustify === 'object') {
      return patternJustify[currentBreakpoint] || patternJustify.base || 'flex-start';
    }
    
    return 'flex-start';
  };

  const resolvedDirection = getResponsiveDirection();
  const resolvedAlign = getResponsiveAlign();
  const resolvedJustify = getResponsiveJustify();

  // ✅ DEBUGGING V2: Solo en desarrollo
  if (import.meta.env?.DEV && _debug) {
    console.log('ClusterLayout V2 Debug:', {
      pattern, resolvedPattern, responsiveGap, currentBreakpoint,
      resolvedDirection, resolvedAlign, resolvedJustify
    });
  }

  // ✅ GENERAR CLASES CSS CON PATTERN
  const clusterClasses = [
    'cluster-layout',
    `cluster-layout--${pattern}`,
    `cluster-layout--direction-${resolvedDirection}`,
    resolvedAlign && `cluster-layout--align-${resolvedAlign}`,
    resolvedJustify && `cluster-layout--justify-${resolvedJustify.replace('flex-', '')}`,
    wrap && 'cluster-layout--wrap',
    isDisabled && 'cluster-layout--disabled',
    userClassName
  ].filter(Boolean).join(' ');

  // ✅ ESTILOS AUTOMÁTICOS CON PATTERN + RESPONSIVE
  const clusterStyles = {
    // Layout básico
    display: 'flex',
    flexDirection: resolvedDirection,
    alignItems: resolvedAlign,
    justifyContent: resolvedJustify,
    flexWrap: wrap ? 'wrap' : 'nowrap',
    
    // Spacing automático responsive
    gap: `var(--spacing-${responsiveGap})`,
    
    // Padding y margin responsive
    ...(padding && typeof padding === 'string' && {
      padding: `var(--spacing-${padding})`
    }),
    ...(margin && typeof margin === 'string' && {
      margin: `var(--spacing-${margin})`
    }),
    
    // Pattern-specific styles
    ...(resolvedPattern.borderTop && { borderTop: resolvedPattern.borderTop }),
    ...(resolvedPattern.borderBottom && { borderBottom: resolvedPattern.borderBottom }),
    
    // Tokens del sistema
    ...generateStyles(),
    
    // User overrides
    ...props.style
  };

  return (
    <div 
      className={clusterClasses}
      style={clusterStyles}
      data-pattern={pattern}
      data-testid={testId}
      {...(import.meta.env?.DEV && _debug && {
        'data-debug': 'true',
        'data-gap': responsiveGap,
        'data-breakpoint': currentBreakpoint,
        'data-direction': resolvedDirection
      })}
    >
      {children}
    </div>
  );
}

// ✅ V2 PROPTYPES: Layout Component Props
ClusterLayout.propTypes = {
  // Props del sistema de layout
  ...LAYOUT_COMPONENT_PROP_TYPES,
  
  // Props específicas de ClusterLayout
  pattern: PropTypes.oneOf([
    'cluster',              // Agrupación horizontal básica
    'clusterSpaceBetween',  // Elementos en los extremos
    'clusterCenter',        // Agrupación centrada
    'tableActions',         // Acciones en fila de tabla
    'tableFilters'          // Filtros de tabla responsive
  ]),
  
  direction: PropTypes.oneOfType([
    PropTypes.oneOf(['row', 'row-reverse']),
    PropTypes.object  // Para responsive: { base: 'column', md: 'row' }
  ]),
  
  wrap: PropTypes.bool,
  children: PropTypes.node.isRequired
};

// ✅ V2 DEFAULT PROPS: Minimales
ClusterLayout.defaultProps = {
  pattern: 'cluster',
  wrap: true
};

export { ClusterLayout };

// ===== EJEMPLOS DE USO =====
/*
// PAGE HEADER - Título y acciones automáticamente organizadas
<ClusterLayout pattern="clusterSpaceBetween">
  <Typography size="3xl" weight="bold">Películas</Typography>
  <ClusterLayout pattern="cluster">
    <Button leftIcon="plus" variant="primary">Nueva Película</Button>
    <Button leftIcon="filter" variant="neutral">Filtros</Button>
  </ClusterLayout>
</ClusterLayout>

// TABLE ACTIONS - Acciones en tabla
<ClusterLayout pattern="tableActions">
  <Button size="sm" leftIcon="edit" iconOnly />
  <Button size="sm" leftIcon="trash" variant="danger" iconOnly />
  <Button size="sm" leftIcon="more" variant="neutral" iconOnly />
</ClusterLayout>

// FORM FILTERS - Filtros que se adaptan a mobile
<ClusterLayout pattern="tableFilters">
  <Input placeholder="Buscar películas..." leftIcon="search" />
  <Select options={categories} placeholder="Categoría" />
  <Button variant="neutral">Limpiar</Button>
</ClusterLayout>

// BENEFICIOS OBTENIDOS:
// ✅ Responsive automático: row → column en mobile
// ✅ Spacing inteligente y contextual
// ✅ Wrapping automático cuando no cabe
// ✅ Patterns predefinidos para casos comunes
// ✅ Zero configuración responsive manual
*/