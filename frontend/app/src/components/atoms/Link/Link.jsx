import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import { Icon } from '../Icon/Icon';
import './Link.css';

/**
 * Link - Átomo de enlace unificado con React Router
 * 
 * Características:
 * - ✅ Integración con React Router (navegación interna)
 * - ✅ Enlaces externos con target="_blank" y rel="noopener"
 * - ✅ Variantes semánticas (primary, secondary, danger, muted)
 * - ✅ Tamaños estándar (xs, sm, md, lg, xl)
 * - ✅ Iconos izquierdo/derecho opcionales
 * - ✅ Estados hover/focus/active
 * - ✅ Accesibilidad completa
 * - ✅ Detección automática de URLs externas
 * 
 * @param {string} [to] - Ruta interna (React Router)
 * @param {string} [href] - URL externa o absoluta
 * @param {React.ReactNode} children - Contenido del enlace
 * @param {string} [text] - Alternativa a children para texto simple
 * @param {'xs'|'sm'|'md'|'lg'|'xl'} [size='md'] - Tamaño del enlace
 * @param {'primary'|'secondary'|'danger'|'muted'|'inherit'} [variant='primary'] - Variante visual
 * @param {string} [leftIcon] - Icono izquierdo (nombre de Feather Icon)
 * @param {string} [rightIcon] - Icono derecho (nombre de Feather Icon)
 * @param {boolean} [external=false] - Forzar comportamiento de enlace externo
 * @param {boolean} [underline=true] - Mostrar subrayado
 * @param {boolean} [disabled=false] - Estado deshabilitado
 * @param {string} [target] - Target del enlace (si no se proporciona, se auto-detecta)
 * @param {string} [rel] - Rel del enlace (si no se proporciona, se auto-detecta)
 * @param {string} [ariaLabel] - Label para accesibilidad
 * @param {string} [className=''] - Clases CSS adicionales
 */
function Link({
  to,
  href,
  children,
  text,
  size = 'md',
  variant = 'primary',
  leftIcon,
  rightIcon,
  external = false,
  underline = true,
  disabled = false,
  target,
  rel,
  ariaLabel,
  className = '',
  ...restProps
}) {
  // Determinar contenido del enlace
  const linkContent = children || text;

  // Auto-detectar si es enlace externo
  const isExternal = external || 
    (href && (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:') || href.startsWith('tel:'))) ||
    (to && (to.startsWith('http://') || to.startsWith('https://')));

  // Determinar URL final
  const finalUrl = href || to;

  // Auto-configurar target y rel para enlaces externos
  const finalTarget = target || (isExternal ? '_blank' : undefined);
  const finalRel = rel || (isExternal && finalTarget === '_blank' ? 'noopener noreferrer' : undefined);

  // Generar clases CSS
  const linkClasses = [
    'link',
    `link--size-${size}`,
    `link--variant-${variant}`,
    underline && 'link--underline',
    disabled && 'link--disabled',
    (leftIcon || rightIcon) && 'link--with-icon',
    className
  ].filter(Boolean).join(' ');

  // Props de accesibilidad
  const accessibilityProps = {
    'aria-label': ariaLabel,
    'aria-disabled': disabled ? 'true' : undefined,
    'tabIndex': disabled ? -1 : undefined
  };

  // Props comunes para ambos tipos de enlace
  const commonProps = {
    className: linkClasses,
    target: finalTarget,
    rel: finalRel,
    ...accessibilityProps,
    ...restProps
  };

  // Función para renderizar el contenido con iconos
  const renderContent = () => (
    <>
      {leftIcon && (
        <Icon 
          name={leftIcon} 
          size={size === 'xs' ? 'xs' : size === 'sm' ? 'xs' : 'sm'} 
          className="link__icon link__icon--left" 
        />
      )}
      <span className="link__text">{linkContent}</span>
      {rightIcon && (
        <Icon 
          name={rightIcon} 
          size={size === 'xs' ? 'xs' : size === 'sm' ? 'xs' : 'sm'} 
          className="link__icon link__icon--right" 
        />
      )}
    </>
  );

  // Si está deshabilitado, renderizar como span
  if (disabled) {
    return (
      <span {...commonProps}>
        {renderContent()}
      </span>
    );
  }

  // Si es enlace externo o href absoluto, usar anchor tag
  if (isExternal || href) {
    return (
      <a href={finalUrl} {...commonProps}>
        {renderContent()}
      </a>
    );
  }

  // Si es enlace interno, usar React Router Link
  if (to) {
    return (
      <RouterLink to={to} {...commonProps}>
        {renderContent()}
      </RouterLink>
    );
  }

  // Fallback: renderizar como span si no hay URL
  console.warn('Link component: No "to" or "href" prop provided');
  return (
    <span {...commonProps}>
      {renderContent()}
    </span>
  );
}

Link.propTypes = {
  /** Ruta interna para React Router */
  to: PropTypes.string,
  
  /** URL externa o absoluta */
  href: PropTypes.string,
  
  /** Contenido del enlace */
  children: PropTypes.node,
  
  /** Alternativa a children para texto simple */
  text: PropTypes.string,
  
  /** Tamaño del enlace */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  
  /** Variante visual del enlace */
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger', 'muted', 'inherit']),
  
  /** Icono izquierdo (nombre de Feather Icon) */
  leftIcon: PropTypes.string,
  
  /** Icono derecho (nombre de Feather Icon) */
  rightIcon: PropTypes.string,
  
  /** Forzar comportamiento de enlace externo */
  external: PropTypes.bool,
  
  /** Mostrar subrayado */
  underline: PropTypes.bool,
  
  /** Estado deshabilitado */
  disabled: PropTypes.bool,
  
  /** Target del enlace */
  target: PropTypes.string,
  
  /** Rel del enlace */
  rel: PropTypes.string,
  
  /** Label para accesibilidad */
  ariaLabel: PropTypes.string,
  
  /** Clases CSS adicionales */
  className: PropTypes.string
};

export { Link };