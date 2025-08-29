// atoms/Card/Card.jsx
import { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useInteractiveProps } from '../../hooks/useStandardProps.jsx';
import { INTERACTIVE_PROP_TYPES, extractDOMPropsV2 } from '../../tokens/propHelpers.js';
import './Card.css';

/**
 * Card - ÁTOMO DEL SISTEMA DE DISEÑO ESTÁNDAR
 * 
 * ✅ SISTEMA ESTÁNDAR: Props estándar (size, variant, rounded, loading, disabled)
 * ✅ HOOK ESTÁNDAR: useInteractiveProps para consistencia total
 * ✅ UNIVERSAL: Sin acoplamiento a ningún dominio específico
 * ✅ FLEXIBLE: Cualquier contenido, cualquier layout
 * ✅ ACCESSIBLE: WCAG AA compliance automático
 * ✅ PERFORMANT: CSS optimizado con sistema de diseño
 * 
 * 🎯 Casos de uso universales:
 * - E-commerce: Tarjetas de producto con imagen y descripción
 * - Blog/CMS: Artículos con preview y metadata
 * - Dashboard: Widgets con datos y métricas
 * - Portfolio: Proyectos con imagen y descripción
 * - Social: Posts con contenido multimedia
 * - Admin: Elementos de configuración
 * 
 * @param {'xs'|'sm'|'md'|'lg'|'xl'} [size='md'] - Tamaño estándar del sistema
 * @param {'primary'|'secondary'|'success'|'warning'|'danger'|'neutral'} [variant='neutral'] - Variante semántica estándar
 * @param {'sm'|'md'|'lg'|'xl'|'full'} [rounded='md'] - Radio de bordes estándar
 * @param {boolean} [loading=false] - Estado de carga estándar
 * @param {boolean} [disabled=false] - Estado deshabilitado estándar
 * @param {boolean} [clickable=false] - Hacer la card clickeable
 * @param {function} [onClick] - Handler para clicks (hace la card clickeable automáticamente)
 * @param {string} [aspectRatio] - Aspect ratio (square, portrait, landscape, wide, etc.)
 * @param {React.ReactNode} children - Contenido de la card
 * @param {string} [className=''] - Clases CSS adicionales
 */
function Card({
  // Contenido
  children,
  
  // Props específicas de UniversalCard
  aspectRatio,
  clickable = false,
  onHover,
  testId,
  ariaLabel,
  style = {},
  
  ...restProps
}) {
  // Hook estándar V2
  const {
    size,
    variant,
    rounded,
    disabled,
    loading,
    className,
    onClick,
    renderIcon,
    tokens,
    ...standardProps
  } = useInteractiveProps(restProps, {
    componentName: 'Card',
    defaultSize: 'md',
    defaultVariant: 'neutral',
    defaultRounded: 'md'
  });

  // Aspect ratios universales predefinidos
  const aspectRatios = {
    square: '1/1',           // Perfiles, avatars, iconos
    portrait: '2/3',         // Posters, carátulas, libros
    landscape: '3/2',        // Fotos, paisajes
    wide: '16/9',           // Videos, banners, hero images
    ultrawide: '21/9',      // Banners promocionales, headers
    golden: '1.618/1',      // Proporción áurea
    card: '5/7',           // Tarjetas tradicionales
    mobile: '9/16'         // Móvil vertical
  };

  // Construir clases CSS manualmente
  const cardClasses = [
    'card',
    `card--${size}`,
    `card--${variant}`,
    `card--rounded-${rounded}`,
    clickable || onClick ? 'card--clickable' : null,
    disabled ? 'card--disabled' : null,
    loading ? 'card--system-loading' : null,
    aspectRatio ? 'card--aspect-ratio' : null,
    aspectRatio ? `card--aspect-${aspectRatio}` : null,
    className
  ].filter(Boolean).join(' ');

  // Estilos dinámicos
  const cardStyles = {
    ...style,
    ...(aspectRatio && { aspectRatio: aspectRatios[aspectRatio] || aspectRatio })
  };

  // Interactividad
  const isInteractive = clickable || onClick;
  const effectiveRole = isInteractive ? 'button' : undefined;
  const effectiveTabIndex = isInteractive ? 0 : undefined;

  // Handlers
  const handleClick = (event) => {
    if (disabled || loading) return;
    onClick?.(event);
  };

  const handleKeyDown = (event) => {
    if (disabled || loading) return;
    if (isInteractive && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      onClick?.(event);
    }
  };

  const handleMouseEnter = (event) => {
    if (disabled || loading) return;
    onHover?.(event);
  };

  const handleFocus = (event) => {
    if (disabled || loading) return;
    // Focus handling automático
  };

  const handleBlur = (event) => {
    // Blur handling automático
  };

  // Props de accesibilidad mejoradas
  const accessibilityProps = {
    'aria-label': ariaLabel,
    'aria-disabled': disabled || loading ? 'true' : undefined,
    'aria-busy': loading ? 'true' : undefined,
    'role': effectiveRole,
    'tabIndex': effectiveTabIndex,
    'data-testid': testId
  };

  return (
    <div
      {...extractDOMPropsV2(standardProps)}
      className={cardClasses}
      style={cardStyles}
      onClick={isInteractive ? handleClick : undefined}
      onKeyDown={isInteractive ? handleKeyDown : undefined}
      onMouseEnter={handleMouseEnter}
      onFocus={handleFocus}
      onBlur={handleBlur}
      {...accessibilityProps}
    >
            {/* Loading overlay del sistema estándar */}
      {loading && (
        <div className="card__system-loading-overlay" aria-hidden="true">
          <div className="card__system-loading-spinner">
            {renderIcon('loading')}
          </div>
        </div>
      )}
      
      {/* Contenido principal */}
      <div className="card__content">
        {children}
      </div>
    </div>
  );
}

// PropTypes usando el sistema estándar
Card.propTypes = {
  // Props estándar del sistema V2 (heredadas de INTERACTIVE_PROP_TYPES)
  ...INTERACTIVE_PROP_TYPES,
  
  // Props específicas de Card
  clickable: PropTypes.bool,
  onClick: PropTypes.func,
  aspectRatio: PropTypes.oneOfType([
    PropTypes.oneOf(['square', 'portrait', 'landscape', 'wide', 'ultrawide', 'golden', 'card', 'mobile']),
    PropTypes.string // Para aspect ratios personalizados como "4/3"
  ]),
  children: PropTypes.node
};

export { Card };

// ===== SUB-COMPONENTES =====
export const CardHeader = ({ children, className = '', ...props }) => (
  <div className={`card__header ${className}`} {...props}>
    {children}
  </div>
);

export const CardBody = ({ children, className = '', ...props }) => (
  <div className={`card__body ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '', ...props }) => (
  <div className={`card__footer ${className}`} {...props}>
    {children}
  </div>
);

export const CardMedia = ({ 
  src, 
  alt, 
  aspectRatio, 
  objectFit = 'cover',
  className = '', 
  ...props 
}) => {
  const aspectRatios = {
    square: '1/1',
    portrait: '2/3',
    landscape: '3/2',
    wide: '16/9',
    ultrawide: '21/9',
    golden: '1.618/1',
    card: '5/7',
    mobile: '9/16'
  };

  return (
    <div className={`card__media ${className}`} {...props}>
      <img 
        src={src}
        alt={alt}
        style={{
          width: '100%',
          height: '100%',
          objectFit,
          aspectRatio: aspectRatio ? (aspectRatios[aspectRatio] || aspectRatio) : undefined
        }}
      />
    </div>
  );
};

export const CardTitle = ({ children, as: Component = 'h3', className = '', ...props }) => (
  <Component className={`card__title ${className}`} {...props}>
    {children}
  </Component>
);

export const CardSubtitle = ({ children, className = '', ...props }) => (
  <p className={`card__subtitle ${className}`} {...props}>
    {children}
  </p>
);

export const CardDescription = ({ children, className = '', ...props }) => (
  <p className={`card__description ${className}`} {...props}>
    {children}
  </p>
);

// PropTypes para sub-componentes
[CardHeader, CardBody, CardFooter, CardTitle, CardSubtitle, CardDescription].forEach(component => {
  component.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
  };
});

CardMedia.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  aspectRatio: PropTypes.oneOfType([
    PropTypes.oneOf(['square', 'portrait', 'landscape', 'wide', 'ultrawide', 'golden', 'card', 'mobile']),
    PropTypes.string
  ]),
  objectFit: PropTypes.oneOf(['cover', 'contain', 'fill', 'none', 'scale-down']),
  className: PropTypes.string
};

CardTitle.propTypes = {
  children: PropTypes.node,
  as: PropTypes.oneOfType([PropTypes.string, PropTypes.elementType]),
  className: PropTypes.string
};

export default Card;
