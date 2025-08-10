// atoms/Badge.jsx
import PropTypes from 'prop-types';
import { createStandardIconRenderer } from '../../../utils/iconHelpers';
import { validateStandardProps, STANDARD_PROP_TYPES } from '../../../tokens';
import './Badge.css';

/**
 * Componente Badge siguiendo el sistema de diseño
 * Átomo para mostrar etiquetas, estados, contadores y categorías
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string|React.ReactNode} [props.children] - Contenido del badge (texto o elementos)
 * @param {string} [props.text] - Texto del badge (alternativa a children)
 * @param {'primary'|'secondary'|'success'|'warning'|'danger'|'neutral'} [props.variant='primary'] - Variante visual (6 variantes estándar)
 * @param {'xs'|'sm'|'md'|'lg'|'xl'} [props.size='md'] - Tamaño del badge
 * @param {'soft'|'solid'|'outline'|'dot'} [props.appearance='solid'] - Estilo visual
 * @param {'sm'|'md'|'lg'|'xl'|'full'} [props.rounded='full'] - Radio de bordes
 * @param {string} [props.className=''] - Clases CSS adicionales
 * @param {function} [props.onClick] - Función a ejecutar al hacer clic (hace el badge clickeable)
 * @param {function} [props.onRemove] - Función para remover el badge (muestra X)
 * @param {string|React.ReactNode} [props.leftIcon] - Icono izquierdo (string: nombre del icono del sistema de diseño | node: componente custom)
 * @param {string|React.ReactNode} [props.rightIcon] - Icono derecho (string: nombre del icono | node: componente custom)
 * @param {string|React.ReactNode} [props.icon] - Icono legacy (string: nombre del icono | node: componente custom)
 * @param {'left'|'right'} [props.iconPosition='left'] - Posición del icono legacy
 * @param {boolean} [props.pulse=false] - Animación de pulso (útil para notificaciones)
 * @param {boolean} [props.loading=false] - Estado de carga con spinner
 * @param {boolean} [props.disabled=false] - Estado deshabilitado
 * @param {boolean} [props.uppercase=false] - Texto en mayúsculas
 * @param {number} [props.maxCount=99] - Número máximo antes de mostrar "+"
 * @param {string} [props.ariaLabel] - Label para accesibilidad
 * @param {string} [props.title] - Tooltip text
 */
const Badge = (props) => {
  // ✅ VALIDAR PROPS ESTÁNDAR - Muestra deprecation warnings automáticamente
  const validatedProps = validateStandardProps(props, 'Badge');
  
  const {
    children,
    text,
    variant = 'primary',
    size = 'md', 
    rounded = 'full',
    disabled = false,
    loading = false,
    className = '',
    leftIcon,
    rightIcon,
    // Props específicas de Badge
    appearance = 'solid',
    onClick,
    onRemove,
    pulse = false,
    uppercase = false,
    maxCount = 99,
    ariaLabel,
    title,
    // Props legacy (para backward compatibility temporal)
    icon,
    iconPosition = 'left',
    ...domProps
  } = validatedProps;

  // ❌ DEPRECATION WARNINGS para props legacy
  if (icon || iconPosition !== 'left') {
    console.warn(
      `Badge: Las props "icon" e "iconPosition" están deprecadas y serán eliminadas en la próxima versión mayor.
      En su lugar usar:
      - Para iconos izquierda: leftIcon="${icon || 'nombre-icono'}"
      - Para iconos derecha: rightIcon="${icon || 'nombre-icono'}"
      
      Ejemplo de migración:
      ❌ <Badge icon="star" iconPosition="left" />
      ✅ <Badge leftIcon="star" />
      
      ❌ <Badge icon="check" iconPosition="right" />  
      ✅ <Badge rightIcon="check" />`
    );
  }

  // ⚠️ DEPRECATED VARIANTS WARNING
  if (props.variant === 'info' || props.variant === 'neutral') {
    console.warn(
      `Badge: Las variantes "info" y "neutral" están deprecadas.
      Migración sugerida:
      - variant="info" → variant="primary" o variant="neutral"
      - variant="neutral" → variant="neutral" (mantenida temporalmente)
      
      Variantes estándar disponibles: primary, secondary, success, warning, danger, neutral`
    );
  }
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

  // Función para renderizar iconos usando el sistema centralizado
  const renderIcon = createStandardIconRenderer('badge', size);

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
      {...domProps}
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
  // ✅ PROPS ESTÁNDAR DEL SISTEMA
  ...STANDARD_PROP_TYPES,
  
  // ✅ PROPS ESPECÍFICAS DE BADGE  
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  text: PropTypes.string,
  appearance: PropTypes.oneOf(['soft', 'solid', 'outline', 'dot']),
  onClick: PropTypes.func,
  onRemove: PropTypes.func,
  pulse: PropTypes.bool,
  uppercase: PropTypes.bool,
  maxCount: PropTypes.number,
  ariaLabel: PropTypes.string,
  title: PropTypes.string,
  
  // ❌ PROPS LEGACY (temporales para backward compatibility)
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  iconPosition: PropTypes.oneOf(['left', 'right'])
};

export { Badge };