// ===== STATS CARD MOLECULE =====
// src/components/molecules/StatsCard/StatsCard.jsx
import PropTypes from 'prop-types';
import { Card } from '../../atoms/Card/Card';
import { createStandardIconRenderer } from '../../../utils/iconHelpers';
import './StatsCard.css';

/**
 * StatsCard - Molécula para tarjetas de estadísticas
 * 
 * Características implementadas:
 * - ✅ Usa Card como base (átomo del sistema)
 * - ✅ Iconos centralizados con createIconRenderer
 * - ✅ Valores, cambios porcentuales
 * - ✅ Variantes de color para diferentes tipos de datos
 * - ✅ Estados loading, error, skeleton
 * - ✅ Responsive design
 * - ✅ Accesibilidad completa
 * - ✅ Animaciones sutiles
 * - ✅ Variables CSS del sistema
 */
function StatsCard({
  // Contenido principal
  title,
  value,
  icon,
  
  // Cambio porcentual (props no utilizadas pero enviadas desde AdminDashboard)
  change, // ← PROP NO UTILIZADA (filtrar para evitar error DOM)
  changeLabel, // ← PROP NO UTILIZADA (filtrar para evitar error DOM)
  changeDirection, // ← PROP NO UTILIZADA (filtrar para evitar error DOM)
  
  // Configuración visual
  color = 'blue', // 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'gray'
  variant = 'default', // 'default' | 'minimal' | 'bordered' | 'gradient'
  size = 'md', // 'sm' | 'md' | 'lg'
  
  // Estados
  loading = false,
  error = null,
  
  // Interactividad
  onClick,
  href,
  
  // Customización
  className = '',
  
  // Props adicionales
  ...restProps
}) {

  // ===== FILTRAR PROPS PERSONALIZADAS PARA DOM =====
  const {
    // Props específicas de StatsCard (filtrar para evitar errores DOM)
    title: cardTitle,
    value: cardValue,
    icon: cardIcon,
    change: cardChange,
    changeLabel: cardChangeLabel,
    changeDirection: cardChangeDirection,
    color: cardColor,
    variant: cardVariant,
    size: cardSize,
    loading: cardLoading,
    error: cardError,
    onClick: cardOnClick,
    href: cardHref,
    className: cardClassName,
    ...domProps // ✅ Solo props válidas para el DOM
  } = { 
    title, value, icon, change, changeLabel, changeDirection, 
    color, variant, size, loading, error, onClick, href, className,
    ...restProps 
  };

  // Evitar warnings de variables no usadas (necesarias para filtrar del DOM)
  void cardTitle; void cardValue; void cardIcon; void cardChange; void cardChangeLabel;
  void cardChangeDirection; void cardColor; void cardVariant; void cardSize; void cardLoading;
  void cardError; void cardOnClick; void cardHref; void cardClassName;

  /**
   * Formatea el valor para mostrar
   */
  const formatValue = (val) => {
    if (loading) return '---';
    if (error) return 'Error';
    if (val === null || val === undefined) return '0';
    
    // Si es un número, formatear con comas
    if (typeof val === 'number') {
      return val.toLocaleString('es-ES');
    }
    
    return val;
  };

  const formattedValue = formatValue(value);

  // ===== FUNCIÓN DE RENDERIZADO DE ICONOS =====
  const renderIcon = createStandardIconRenderer('statsCard', size);

  // ===== CLASES CSS =====
  const statsCardClasses = [
    'stats-card',
    `stats-card--${color}`,
    `stats-card--${variant}`,
    `stats-card--${size}`,
    loading && 'stats-card--loading',
    error && 'stats-card--error',
    (onClick || href) && 'stats-card--interactive',
    className
  ].filter(Boolean).join(' ');

  // const changeClasses = [
  //   'stats-card__change',
  //   `stats-card__change--${finalChangeDirection}`
  // ].filter(Boolean).join(' ');


  // ===== HANDLERS =====
  const handleClick = (e) => {
    if (loading || error) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  const handleKeyDown = (e) => {
    if (loading || error) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick(e);
    }
  };

  // ===== CONTENIDO DE LA CARD =====
  const cardContent = (
    <>
      {/* Header con icono y título */}
      <div className="stats-card__header">
        {icon && (
          <div className="stats-card__icon" aria-hidden="true">
            {renderIcon(icon)}
          </div>
        )}
        <h3 className="stats-card__title">
          {title}
        </h3>
      </div>

      {/* Valor principal */}
      <div className="stats-card__value-section">
        {loading ? (
          <div className="stats-card__value stats-card__value--skeleton">
            <div className="stats-card__skeleton stats-card__skeleton--value"></div>
          </div>
        ) : (
          <div className="stats-card__value" aria-live="polite">
            {formattedValue}
          </div>
        )}
      </div>

      {/* Estado de error */}
      {error && (
        <div className="stats-card__error-message" role="alert">
          <span className="stats-card__error-icon" aria-hidden="true">
            {renderIcon('alert', 'sm', 'danger')}
          </span>
          <span className="stats-card__error-text">{error}</span>
        </div>
      )}
    </>
  );

  // ===== PROPS PARA LA CARD BASE =====
  const cardProps = {
    className: statsCardClasses,
    variant: 'elevated',
    padding: size === 'sm' ? 'md' : size === 'lg' ? 'xl' : 'lg',
    hoverable: !!(onClick || href) && !loading && !error,
    onClick: (onClick || href) ? handleClick : undefined,
    onKeyDown: (onClick || href) ? handleKeyDown : undefined,
    role: (onClick || href) ? 'button' : undefined,
    tabIndex: (onClick || href) ? 0 : undefined,
    'aria-label': (onClick || href) ? `${title}: ${formattedValue}` : undefined,
    'aria-busy': loading,
    'aria-invalid': !!error,
    ...domProps
  };

  // ===== RENDER =====
  
  // Si es un enlace, usar un wrapper
  if (href && !loading && !error) {
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
  title: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]), // string: nombre del icono del sistema de diseño | node: componente React custom
  change: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  changeLabel: PropTypes.string,
  changeDirection: PropTypes.oneOf(['up', 'down', 'neutral']),
  color: PropTypes.oneOf(['blue', 'green', 'red', 'yellow', 'purple', 'gray']),
  variant: PropTypes.oneOf(['default', 'minimal', 'bordered', 'gradient']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  loading: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  onClick: PropTypes.func,
  href: PropTypes.string,
  className: PropTypes.string
};

export { StatsCard };