// ===== STATS CARD MOLECULE =====
// src/components/molecules/StatsCard/StatsCard.jsx
import PropTypes from 'prop-types';
import { Card } from '../../atoms/Card/Card';
import { Icon } from '../../atoms/Icon/Icon';
import { FlexContainer } from '../../atoms/FlexContainer/FlexContainer';
import { Typography } from '../../atoms/Typography/Typography';
import { useStandardProps } from '../../../hooks/useStandardProps';
import { STANDARD_PROP_TYPES, extractDOMProps } from '../../../tokens/standardProps';
import './StatsCard.css';

/**
 * StatsCard - Molécula para tarjetas de estadísticas
 * 🎯 MIGRADO AL SISTEMA DE DISEÑO ESTÁNDAR
 * 
 * ✅ NUEVAS CARACTERÍSTICAS:
 * - Hook useStandardProps() integrado para consistencia
 * - Props estándar (size, variant, rounded) con tokens automáticos
 * - Variantes semánticas estándar (success, warning, danger, etc.)
 * - Sistema de iconos unificado con Icon component
 * - FullWidth heredado de Card (sin prop custom)
 * - STANDARD_PROP_TYPES para validación consistente
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} props.title - Título de la estadística
 * @param {string|number} props.value - Valor principal a mostrar
 * @param {string} props.icon - Nombre del icono del sistema de diseño
 * @param {'xs'|'sm'|'md'|'lg'|'xl'} [props.size='md'] - Tamaño estándar
 * @param {'primary'|'secondary'|'success'|'warning'|'danger'|'neutral'} [props.variant='neutral'] - Variante semántica estándar
 * @param {'sm'|'md'|'lg'|'xl'|'full'} [props.rounded='lg'] - Radio de bordes estándar
 * @param {boolean} [props.disabled=false] - Estado deshabilitado
 * @param {boolean} [props.loading=false] - Estado de carga con skeleton
 * @param {boolean} [props.fullWidth=false] - Si ocupa todo el ancho disponible (heredado de Card)
 * @param {function} [props.onClick] - Función a ejecutar al hacer clic
 * @param {string} [props.href] - URL para convertir en enlace
 * @param {string} [props.className=''] - Clases CSS adicionales
 * 
 * DEPRECATED PROPS (mantenidas por compatibilidad):
 * @param {string|number} [props.change] - Cambio porcentual (no usado actualmente)
 * @param {string} [props.changeLabel] - Label del cambio (no usado actualmente)
 * @param {string} [props.changeDirection] - Dirección del cambio (no usado actualmente)
 * @param {string} [props.color] - DEPRECADO: Usar variant estándar
 */
function StatsCard(props) {
  // Extraer props específicas del componente
  const {
    // Contenido principal
    title = 'Estadística',
    value,
    icon = 'activity',
    
    // Props deprecadas (mantener compatibilidad)
    change,
    changeLabel,
    changeDirection,
    color, // DEPRECADO: mapear a variant
    
    // Interactividad
    onClick,
    href,
    
    // Props adicionales
    id,
    ...restProps
  } = props;

  // Hook estándar - StatsCard es tipo card/container
  const {
    size,
    variant: standardVariant,
    rounded,
    disabled,
    loading,
    fullWidth,
    className,
    // tokens, renderIcon - disponibles del hook
    ...standardProps
  } = useStandardProps(restProps, {
    componentType: 'card',
    defaultSize: 'md',
    defaultVariant: 'neutral',
    defaultRounded: 'lg'
  });

  // ===== MANEJO DE BACKWARD COMPATIBILITY =====
  // Mapear color deprecado a variant estándar
  const finalVariant = (() => {
    if (color && !restProps.variant) {
      // Mapeo de colores legacy a variantes estándar
      switch (color) {
        case 'blue': return 'primary';
        case 'green': return 'success';
        case 'red': return 'danger';
        case 'yellow': return 'warning';
        case 'purple': return 'secondary';
        case 'gray': return 'neutral';
        default: return standardVariant;
      }
    }
    return standardVariant;
  })();

  // Warning de deprecación en desarrollo
  if (color && import.meta.env?.DEV) {
    console.warn(`⚠️ StatsCard: prop "color" está deprecada. Usar "variant" estándar en su lugar.
    Mapeo automático: color="${color}" → variant="${finalVariant}"`);
  }

  // Props seguros para DOM
  const domProps = extractDOMProps({
    ...standardProps,
    id,
    disabled,
    className
  });

  /**
   * Formatea el valor para mostrar
   */
  const formatValue = (val) => {
    if (loading) return '---';
    if (val === null || val === undefined) return '0';
    
    // Si es un número, formatear con comas
    if (typeof val === 'number') {
      return val.toLocaleString('es-ES');
    }
    
    return val;
  };

  const formattedValue = formatValue(value);

  // ===== CLASES CSS =====
  const statsCardClasses = [
    'stats-card',
    `stats-card--variant-${finalVariant}`,
    `stats-card--size-${size}`,
    fullWidth && 'stats-card--full-width',
    loading && 'stats-card--loading',
    disabled && 'stats-card--disabled',
    (onClick || href) && 'stats-card--interactive',
    className
  ].filter(Boolean).join(' ');

  // Determinar dirección del cambio
  const finalChangeDirection = (() => {
    if (changeDirection) return changeDirection;
    if (change && typeof change === 'string') {
      if (change.startsWith('+')) return 'up';
      if (change.startsWith('-')) return 'down';
    }
    return 'neutral';
  })();

  const changeClasses = [
    'stats-card__change',
    `stats-card__change--${finalChangeDirection}`
  ].filter(Boolean).join(' ');


  // ===== HANDLERS =====
  const handleClick = (e) => {
    if (loading) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  const handleKeyDown = (e) => {
    if (loading) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick(e);
    }
  };

  // ===== CONTENIDO DE LA CARD =====
  const cardContent = (
    <>
      {/* Header con icono y título */}
      <FlexContainer
        direction="row"
        align="center"
        spacing="sm"
        className="stats-card__header"
      >
        {icon && (
          <FlexContainer
            align="center"
            justify="center"
            className="stats-card__icon"
            aria-hidden="true"
          >
            <Icon name={icon} size={size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'md'} />
          </FlexContainer>
        )}
        <Typography variant="h3" className="stats-card__title">
          {title}
        </Typography>
      </FlexContainer>

      {/* Valor principal */}
      <FlexContainer
        direction="column"
        align="flex-start"
        className="stats-card__value-section"
      >
        {loading ? (
          <FlexContainer align="center" className="stats-card__value stats-card__value--skeleton">
            <div className="stats-card__skeleton stats-card__skeleton--value"></div>
          </FlexContainer>
        ) : (
          <Typography variant="div" className="stats-card__value" aria-live="polite">
            {formattedValue}
          </Typography>
        )}
        
        {/* Cambio/tendencia (si existe) */}
        {change && !loading && (
          <FlexContainer direction="column" spacing="xs" className="stats-card__change-section">
            <FlexContainer
              direction="row"
              align="center"
              spacing="xs"
              className={changeClasses}
              aria-label={`Cambio: ${change}`}
            >
              <Icon 
                name={finalChangeDirection === 'up' ? 'trending-up' : finalChangeDirection === 'down' ? 'trending-down' : 'minus'} 
                size="xs" 
              />
              <Typography variant="span">{change}</Typography>
            </FlexContainer>
            {changeLabel && (
              <Typography variant="span" className="stats-card__change-label">
                {changeLabel}
              </Typography>
            )}
          </FlexContainer>
        )}
      </FlexContainer>
    </>
  );

  // ===== PROPS PARA LA CARD BASE =====
  const cardProps = {
    // Props estándar del sistema
    size,
    variant: finalVariant,
    rounded,
    disabled,
    loading,
    fullWidth,
    className: statsCardClasses,
    
    // Props específicas de Card
    hoverable: !!(onClick || href) && !loading && !disabled,
    clickable: !!(onClick || href),
    onClick: (onClick || href) ? handleClick : undefined,
    onKeyDown: (onClick || href) ? handleKeyDown : undefined,
    
    // Accesibilidad
    role: (onClick || href) ? 'button' : undefined,
    tabIndex: (onClick || href) ? 0 : undefined,
    'aria-label': (onClick || href) ? `${title}: ${formattedValue}` : undefined,
    'aria-busy': loading,
    'aria-disabled': disabled,
    
    // Props DOM seguros
    ...domProps
  };

  // ===== RENDER =====
  
  // Si es un enlace, usar un wrapper
  if (href && !loading) {
    return (
      <a 
        href={href} 
        className="stats-card__link"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
      >
        <Card {...cardProps}>
          {cardContent}
        </Card>
      </a>
    );
  }

  // Card normal
  return (
    <Card {...cardProps}>
      {cardContent}
    </Card>
  );
}

StatsCard.propTypes = {
  // Props estándar del sistema de diseño
  ...STANDARD_PROP_TYPES,
  
  // Props específicas del componente
  title: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  icon: PropTypes.string, // Nombre del icono del sistema de diseño
  
  // Interactividad
  onClick: PropTypes.func,
  href: PropTypes.string,
  
  // Props adicionales
  id: PropTypes.string,
  
  // DEPRECATED PROPS (mantener por compatibilidad)
  change: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  changeLabel: PropTypes.string,
  changeDirection: PropTypes.oneOf(['up', 'down', 'neutral']),
  color: PropTypes.oneOf(['blue', 'green', 'red', 'yellow', 'purple', 'gray']), // DEPRECADO: usar variant
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.object]) // DEPRECADO: error state se maneja por loading
};

export { StatsCard };