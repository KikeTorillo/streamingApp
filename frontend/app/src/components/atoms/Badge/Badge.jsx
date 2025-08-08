// atoms/Badge.jsx
import React from 'react';
import PropTypes from 'prop-types';
import './Badge.css';

/**
 * Componente Badge siguiendo el sistema de diseño
 * Átomo para mostrar etiquetas, estados, contadores y categorías
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string|React.ReactNode} [props.children] - Contenido del badge (texto o elementos)
 * @param {string} [props.text] - Texto del badge (alternativa a children)
 * @param {'primary'|'secondary'|'success'|'warning'|'danger'|'info'|'neutral'} [props.variant='primary'] - Variante visual
 * @param {'xs'|'sm'|'md'|'lg'|'xl'} [props.size='md'] - Tamaño del badge
 * @param {'soft'|'solid'|'outline'|'dot'} [props.appearance='solid'] - Estilo visual
 * @param {'sm'|'md'|'lg'|'xl'|'full'} [props.rounded='full'] - Radio de bordes
 * @param {string} [props.className=''] - Clases CSS adicionales
 * @param {function} [props.onClick] - Función a ejecutar al hacer clic (hace el badge clickeable)
 * @param {function} [props.onRemove] - Función para remover el badge (muestra X)
 * @param {string|React.ReactNode} [props.leftIcon] - Icono izquierdo (preferido)
 * @param {string|React.ReactNode} [props.rightIcon] - Icono derecho (preferido)
 * @param {string|React.ReactNode} [props.icon] - Icono legacy (usar con iconPosition)
 * @param {'left'|'right'} [props.iconPosition='left'] - Posición del icono legacy
 * @param {boolean} [props.pulse=false] - Animación de pulso (útil para notificaciones)
 * @param {boolean} [props.loading=false] - Estado de carga con spinner
 * @param {boolean} [props.disabled=false] - Estado deshabilitado
 * @param {boolean} [props.uppercase=false] - Texto en mayúsculas
 * @param {number} [props.maxCount=99] - Número máximo antes de mostrar "+"
 * @param {string} [props.ariaLabel] - Label para accesibilidad
 * @param {string} [props.title] - Tooltip text
 */
const Badge = ({
  children,
  text,
  variant = 'primary',
  size = 'md',
  appearance = 'solid',
  rounded = 'full',
  className = '',
  onClick,
  onRemove,
  leftIcon,
  rightIcon,
  icon, // Legacy support
  iconPosition = 'left', // Legacy support
  pulse = false,
  loading = false,
  disabled = false,
  uppercase = false,
  maxCount = 99,
  ariaLabel,
  title
}) => {
  // Determinar el contenido final del badge
  const badgeContent = children || text || '';
  
  // Formatear números con maxCount
  const formatCount = (content) => {
    if (typeof content === 'number') {
      return content > maxCount ? `${maxCount}+` : content.toString();
    }
    return content;
  };

  const finalContent = formatCount(badgeContent);

  // Determinar iconos finales (nueva lógica unified)
  const hasLeftIcon = leftIcon || (icon && iconPosition === 'left');
  const hasRightIcon = rightIcon || (icon && iconPosition === 'right');
  const finalLeftIcon = leftIcon || (icon && iconPosition === 'left' ? icon : null);
  const finalRightIcon = rightIcon || (icon && iconPosition === 'right' ? icon : null);

  // Construir clases CSS dinámicamente
  const badgeClasses = [
    'badge',
    `badge--${variant}`,
    `badge--${size}`,
    `badge--${appearance}`,
    rounded !== 'full' && `badge--rounded-${rounded}`,
    onClick && 'badge--clickable',
    onRemove && 'badge--removable',
    pulse && 'badge--pulse',
    loading && 'badge--loading',
    disabled && 'badge--disabled',
    uppercase && 'badge--uppercase',
    (hasLeftIcon || hasRightIcon) && 'badge--with-icon',
    !finalContent && appearance === 'dot' && 'badge--dot-only',
    className
  ].filter(Boolean).join(' ');

  // Manejar click
  const handleClick = (e) => {
    if (disabled || loading) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  // Manejar remove
  const handleRemove = (e) => {
    e.stopPropagation(); // Evitar propagación si el badge también es clickeable
    if (disabled || loading) return;
    onRemove?.(e);
  };

  // Función para renderizar iconos
  const renderIcon = (iconContent) => {
    if (React.isValidElement(iconContent)) {
      return iconContent;
    }
    
    if (typeof iconContent === 'string') {
      // Detectar clases de iconos
      if (iconContent.includes('fa-') || iconContent.includes('icon-') || 
          iconContent.includes('bi-') || iconContent.includes('material-icons')) {
        return <i className={iconContent} aria-hidden="true" />;
      }
      // Para emojis y texto
      return <span aria-hidden="true">{iconContent}</span>;
    }
    
    return iconContent;
  };

  // Determinar role y propiedades de accesibilidad
  const badgeRole = onClick ? 'button' : 'status';
  const finalAriaLabel = ariaLabel || (typeof finalContent === 'string' ? finalContent : undefined);

  return (
    <span 
      className={badgeClasses}
      role={badgeRole}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick ? handleClick : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick(e);
        }
      } : undefined}
      aria-label={finalAriaLabel}
      aria-disabled={disabled}
      title={title}
    >
      {/* Contenido principal del badge */}
      <span className="badge__content">
        {/* Icono izquierdo (nueva lógica unificada) */}
        {hasLeftIcon && (
          <span className="badge__icon badge__icon--left">
            {renderIcon(finalLeftIcon)}
          </span>
        )}
        
        {/* Texto principal (solo si no es dot-only) */}
        {finalContent && !(appearance === 'dot' && !finalContent) && (
          <span className="badge__text">
            {finalContent}
          </span>
        )}
        
        {/* Icono derecho (nueva lógica unificada) */}
        {hasRightIcon && (
          <span className="badge__icon badge__icon--right">
            {renderIcon(finalRightIcon)}
          </span>
        )}
        
        {/* Spinner de loading */}
        {loading && (
          <span className="badge__spinner" aria-hidden="true">
            <svg className="badge__spinner-svg" viewBox="0 0 24 24">
              <circle 
                className="badge__spinner-circle" 
                cx="12" 
                cy="12" 
                r="10" 
                strokeWidth="2"
              />
            </svg>
          </span>
        )}
      </span>
      
      {/* Botón de remover */}
      {onRemove && !loading && (
        <button
          type="button"
          className="badge__remove"
          onClick={handleRemove}
          aria-label="Remover"
          title="Remover"
          disabled={disabled}
        >
          <svg className="badge__remove-icon" viewBox="0 0 24 24" fill="none">
            <path 
              d="M6 6L18 18M6 18L18 6" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </span>
  );
};

Badge.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  text: PropTypes.string,
  variant: PropTypes.oneOf(['primary', 'secondary', 'success', 'warning', 'danger', 'info', 'neutral']),
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  appearance: PropTypes.oneOf(['soft', 'solid', 'outline', 'dot']),
  rounded: PropTypes.oneOf(['sm', 'md', 'lg', 'xl', 'full']),
  className: PropTypes.string,
  onClick: PropTypes.func,
  onRemove: PropTypes.func,
  leftIcon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  rightIcon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]), // Legacy support
  iconPosition: PropTypes.oneOf(['left', 'right']), // Legacy support
  pulse: PropTypes.bool,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  uppercase: PropTypes.bool,
  maxCount: PropTypes.number,
  ariaLabel: PropTypes.string,
  title: PropTypes.string
};

export { Badge };