// src/components/atoms/Avatar/Avatar.jsx
import PropTypes from 'prop-types';
import { useAvatarProps } from '../../../hooks/useStandardProps.jsx';
import { STANDARD_PROP_TYPES } from '../../../tokens/standardProps.js';
import { createIconRenderer, COMPONENT_SIZE_MAPS } from '../../../utils/iconHelpers.js';
import './Avatar.css';

/**
 * Avatar - ÁTOMO MIGRADO AL SISTEMA DE DISEÑO ESTÁNDAR
 * 
 * ✅ SISTEMA ESTÁNDAR: Hook useAvatarProps() integrado
 * ✅ PROPS ESTÁNDAR: size, variant, rounded, loading, disabled
 * ✅ SISTEMA DE ICONOS: renderIcon integrado con fallbackIcon
 * ✅ BACKWARD COMPATIBILITY: variant mapping 'default'→'neutral'
 * ✅ DESIGN TOKENS: Tamaños y colores automáticos
 * ✅ ACCESIBILIDAD: ARIA completo, focus management
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} [props.src] - URL de la imagen del avatar
 * @param {string} [props.name] - Nombre del usuario (para generar iniciales)
 * @param {'xs'|'sm'|'md'|'lg'|'xl'} [props.size='md'] - Tamaño estándar del sistema
 * @param {'primary'|'secondary'|'success'|'warning'|'danger'|'neutral'} [props.variant='neutral'] - Variante semántica estándar
 * @param {'sm'|'md'|'lg'|'xl'|'full'} [props.rounded='full'] - Radio de bordes estándar
 * @param {'online'|'offline'|'away'|'busy'} [props.status] - Estado de actividad
 * @param {string|number} [props.badge] - Insignia/contador a mostrar
 * @param {string} [props.className=''] - Clases CSS adicionales
 * @param {function} [props.onClick] - Función a ejecutar al hacer clic
 * @param {boolean} [props.loading=false] - Estado de carga estándar
 * @param {boolean} [props.disabled=false] - Estado deshabilitado estándar
 * @param {string} [props.alt] - Texto alternativo personalizado
 * @param {string|React.ReactNode} [props.fallbackIcon] - Icono del sistema o emoji cuando no hay imagen
 * @param {string} [props.ariaLabel] - Label para accesibilidad
 * 
 * @deprecated props.shape - Usar rounded en su lugar
 * @deprecated props.variant='default' - Usar 'neutral'
 */
function Avatar(props) {
  // Backward compatibility: mapear props legacy
  const {
    variant: legacyVariant,
    shape,
    ...restPropsForHook
  } = props;
  
  // Mapear props legacy para backward compatibility
  const mappedProps = {
    ...restPropsForHook,
    // Mapear variant legacy 'default' -> 'neutral'
    variant: legacyVariant === 'default' ? 'neutral' : legacyVariant,
    // Mapear shape a rounded si se proporciona
    rounded: props.rounded || (shape === 'circle' ? 'full' : shape === 'rounded' ? 'lg' : shape === 'square' ? 'md' : undefined)
  };
  
  // Hook del sistema estándar
  const avatarProps = useAvatarProps(mappedProps);
  const {
    size,
    variant,
    rounded,
    disabled,
    loading,
    className,
    renderIcon,
    tokens,
    ...restProps
  } = avatarProps;
  
  // Props específicas del Avatar
  const {
    src,
    name,
    status,
    badge,
    alt,
    fallbackIcon = 'user', // Por defecto usar icono del sistema
    onClick,
    ariaLabel
  } = restProps;
  
  // Crear renderer de iconos para Avatar
  const iconRenderer = createIconRenderer('sm', COMPONENT_SIZE_MAPS.avatar || {
    xs: 'xs',
    sm: 'xs', 
    md: 'sm',
    lg: 'md',
    xl: 'lg'
  });
  // Generar iniciales del nombre
  const getInitials = (fullName) => {
    if (!fullName) return '';
    
    const names = fullName.trim().split(' ');
    if (names.length === 1) {
      return names[0].substring(0, 2).toUpperCase();
    }
    
    return names
      .slice(0, 2) // Solo primeros dos nombres
      .map(name => name[0])
      .join('')
      .toUpperCase();
  };

  // Deprecation warnings en desarrollo
  if (process.env.NODE_ENV === 'development') {
    if (legacyVariant === 'default') {
      console.warn('Avatar: variant="default" is deprecated. Use variant="neutral" instead.');
    }
    if (shape) {
      console.warn('Avatar: prop "shape" is deprecated. Use "rounded" prop instead (circle=\'full\', rounded=\'lg\', square=\'md\')');
    }
  }
  
  // Construir clases CSS dinámicamente
  const avatarClasses = [
    'avatar',
    `avatar--${size}`,
    `avatar--${variant}`,
    `avatar--${rounded}`, // Usar rounded en lugar de shape
    onClick && 'avatar--clickable',
    loading && 'avatar--loading',
    disabled && 'avatar--disabled',
    status && 'avatar--has-status',
    badge && 'avatar--has-badge',
    className
  ].filter(Boolean).join(' ');

  // Determinar qué mostrar
  const initials = getInitials(name);
  const finalAlt = alt || name || 'Avatar';
  const finalAriaLabel = ariaLabel || (name ? `Avatar de ${name}` : 'Avatar');

  // Manejar click
  const handleClick = (e) => {
    if (loading || disabled) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  // Manejar teclado para accesibilidad
  const handleKeyDown = (e) => {
    if (!onClick || loading || disabled) return;
    
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(e);
    }
  };

  // Manejar error de imagen
  const handleImageError = (e) => {
    e.target.style.display = 'none';
    const fallback = e.target.nextSibling;
    if (fallback) {
      fallback.style.display = 'flex';
    }
  };

  const isInteractive = Boolean(onClick && !disabled && !loading);

  return (
    <div 
      className={avatarClasses}
      onClick={isInteractive ? handleClick : undefined}
      onKeyDown={isInteractive ? handleKeyDown : undefined}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      aria-label={finalAriaLabel}
      aria-disabled={disabled || loading}
      aria-busy={loading}
      {...restProps}
    >
      {/* Contenedor principal */}
      <div className="avatar__container">
        {/* Imagen del avatar */}
        {src && (
          <img
            className="avatar__image"
            src={src}
            alt={finalAlt}
            onError={handleImageError}
          />
        )}
        
        {/* Fallback con iniciales o icono del sistema */}
        <div 
          className="avatar__fallback"
          style={{ display: src ? 'none' : 'flex' }}
        >
          {initials || iconRenderer(fallbackIcon, size, variant)}
        </div>
        
        {/* Spinner de loading */}
        {loading && (
          <div className="avatar__loading-spinner">
            <svg className="avatar__spinner-svg" viewBox="0 0 24 24">
              <circle 
                className="avatar__spinner-circle" 
                cx="12" 
                cy="12" 
                r="10" 
                strokeWidth="2"
              />
            </svg>
          </div>
        )}
      </div>
      
      {/* Indicador de estado */}
      {status && (
        <div className={`avatar__status avatar__status--${status}`} />
      )}
      
      {/* Badge */}
      {badge && (
        <div className="avatar__badge">
          {badge}
        </div>
      )}
    </div>
  );
}

Avatar.propTypes = {
  // Props estándar del sistema (heredadas de STANDARD_PROP_TYPES)
  ...STANDARD_PROP_TYPES,
  
  // Props específicas del Avatar
  src: PropTypes.string,
  name: PropTypes.string,
  status: PropTypes.oneOf(['online', 'offline', 'away', 'busy']),
  badge: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onClick: PropTypes.func,
  alt: PropTypes.string,
  fallbackIcon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  
  // Props legacy (deprecated)
  shape: PropTypes.oneOf(['circle', 'rounded', 'square']) // @deprecated usar rounded
};

export { Avatar };