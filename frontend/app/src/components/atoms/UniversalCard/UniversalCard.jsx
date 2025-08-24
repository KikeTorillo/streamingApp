// components/atoms/UniversalCard/UniversalCard.jsx
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { 
  UNIVERSAL_CARD_TOKENS,
  generateUniversalCardCSS,
  isValidUniversalSize,
  isValidUniversalVariant,
  isValidUniversalAspectRatio
} from '../../../tokens/cardTokens-universal';
import './UniversalCard.css';

/**
 * UniversalCard - Componente de Card 100% Reutilizable
 * 
 * ✅ UNIVERSAL: Sin acoplamiento a ningún dominio específico
 * ✅ FLEXIBLE: Cualquier contenido, cualquier aspecto
 * ✅ ACCESSIBLE: WCAG AA compliance automático
 * ✅ PERFORMANT: CSS optimizado con tokens
 * 
 * 🎯 Casos de uso UNIVERSALES:
 * - E-commerce: productos, categorías
 * - Blog: artículos, autores  
 * - Streaming: películas, series (con domainAdapter)
 * - Dashboard: métricas, widgets
 * - Portfolio: proyectos, trabajos
 * - Social: posts, usuarios
 */
function UniversalCard({
  // ===== CONTENIDO UNIVERSAL =====
  children,
  
  // ===== CONFIGURACIÓN VISUAL =====
  size = 'md',
  variant = 'elevated', 
  aspectRatio = null,        // Opcional, permite altura dinámica
  
  // ===== INTERACTIVIDAD =====
  clickable = false,
  disabled = false,
  loading = false,
  
  // ===== HANDLERS =====
  onClick,
  onHover,
  onFocus,
  onBlur,
  
  // ===== ACCESIBILIDAD =====
  role,
  tabIndex,
  ariaLabel,
  ariaDescribedBy,
  
  // ===== PERSONALIZACIÓN =====
  className = '',
  style = {},
  testId,
  
  // ===== DOM PROPS =====
  ...restProps
}) {
  
  // ===== VALIDACIONES DE DESARROLLO =====
  if (import.meta.env?.DEV) {
    if (!isValidUniversalSize(size)) {
      console.warn(
        `⚠️ UniversalCard: size "${size}" no es válido. ` +
        `Usar: ${Object.keys(UNIVERSAL_CARD_TOKENS.sizes).join(', ')}`
      );
    }
    
    if (!isValidUniversalVariant(variant)) {
      console.warn(
        `⚠️ UniversalCard: variant "${variant}" no es válido. ` +
        `Usar: ${Object.keys(UNIVERSAL_CARD_TOKENS.variants).join(', ')}`
      );
    }
    
    if (aspectRatio && !isValidUniversalAspectRatio(aspectRatio)) {
      console.warn(
        `⚠️ UniversalCard: aspectRatio "${aspectRatio}" no es válido. ` +
        `Usar: ${Object.keys(UNIVERSAL_CARD_TOKENS.aspectRatios).join(', ')}`
      );
    }
  }
  
  // ===== TOKENS Y ESTILOS =====
  const cardTokens = useMemo(() => 
    UNIVERSAL_CARD_TOKENS.sizes[size] || UNIVERSAL_CARD_TOKENS.sizes.md,
    [size]
  );
  
  const cssProperties = useMemo(() => 
    generateUniversalCardCSS(size, variant, aspectRatio),
    [size, variant, aspectRatio]
  );
  
  const cardStyles = useMemo(() => ({
    ...cssProperties,
    ...style
  }), [cssProperties, style]);
  
  // ===== CLASSES =====
  const cardClasses = useMemo(() => {
    const classes = [
      'universal-card',
      `universal-card--size-${size}`,
      `universal-card--variant-${variant}`,
      {
        'universal-card--clickable': clickable || onClick,
        'universal-card--disabled': disabled,
        'universal-card--loading': loading,
        'universal-card--aspect-ratio': !!aspectRatio
      }
    ];
    
    if (aspectRatio) {
      classes.push(`universal-card--aspect-${aspectRatio}`);
    }
    
    return classes.filter(Boolean).join(' ');
  }, [size, variant, aspectRatio, clickable, onClick, disabled, loading]);
  
  const finalClasses = [cardClasses, className].filter(Boolean).join(' ');
  
  // ===== INTERACTIVIDAD =====
  const isInteractive = clickable || onClick;
  const effectiveRole = role || (isInteractive ? 'button' : undefined);
  const effectiveTabIndex = tabIndex !== undefined ? tabIndex : (isInteractive ? 0 : undefined);
  
  // ===== HANDLERS =====
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
    onFocus?.(event);
  };
  
  const handleBlur = (event) => {
    onBlur?.(event);
  };
  
  // ===== DOM PROPS LIMPIAS =====
  const domProps = {
    ...restProps,
    className: finalClasses,
    style: cardStyles,
    onClick: isInteractive ? handleClick : undefined,
    onKeyDown: isInteractive ? handleKeyDown : undefined,
    onMouseEnter: handleMouseEnter,
    onFocus: handleFocus,
    onBlur: handleBlur,
    role: effectiveRole,
    tabIndex: effectiveTabIndex,
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedBy,
    'aria-disabled': disabled,
    'aria-busy': loading,
    'data-testid': testId
  };
  
  // ===== RENDER =====
  return (
    <div {...domProps}>
      {loading && (
        <div className="universal-card__loading-overlay" aria-hidden="true">
          <div className="universal-card__loading-shimmer" />
        </div>
      )}
      <div className="universal-card__content">
        {children}
      </div>
    </div>
  );
}

// ===== PROPTYPES =====
UniversalCard.propTypes = {
  // Contenido
  children: PropTypes.node,
  
  // Configuración visual
  size: PropTypes.oneOf(Object.keys(UNIVERSAL_CARD_TOKENS.sizes)),
  variant: PropTypes.oneOf(Object.keys(UNIVERSAL_CARD_TOKENS.variants)),
  aspectRatio: PropTypes.oneOf(Object.keys(UNIVERSAL_CARD_TOKENS.aspectRatios)),
  
  // Interactividad
  clickable: PropTypes.bool,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  
  // Handlers
  onClick: PropTypes.func,
  onHover: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  
  // Accesibilidad
  role: PropTypes.string,
  tabIndex: PropTypes.number,
  ariaLabel: PropTypes.string,
  ariaDescribedBy: PropTypes.string,
  
  // Personalización
  className: PropTypes.string,
  style: PropTypes.object,
  testId: PropTypes.string
};

// ===== SUB-COMPONENTES UNIVERSALES =====
export const UniversalCardHeader = ({ children, className = '', ...props }) => (
  <div className={`universal-card__header ${className}`} {...props}>
    {children}
  </div>
);

export const UniversalCardBody = ({ children, className = '', ...props }) => (
  <div className={`universal-card__body ${className}`} {...props}>
    {children}
  </div>
);

export const UniversalCardFooter = ({ children, className = '', ...props }) => (
  <div className={`universal-card__footer ${className}`} {...props}>
    {children}
  </div>
);

export const UniversalCardMedia = ({ 
  src, 
  alt, 
  aspectRatio, 
  objectFit = 'cover',
  className = '', 
  ...props 
}) => (
  <div className={`universal-card__media ${className}`} {...props}>
    <img 
      src={src}
      alt={alt}
      style={{
        width: '100%',
        height: '100%',
        objectFit,
        aspectRatio: aspectRatio ? UNIVERSAL_CARD_TOKENS.aspectRatios[aspectRatio] : undefined
      }}
    />
  </div>
);

export const UniversalCardTitle = ({ children, as: Component = 'h3', className = '', ...props }) => (
  <Component className={`universal-card__title ${className}`} {...props}>
    {children}
  </Component>
);

export const UniversalCardDescription = ({ children, className = '', ...props }) => (
  <p className={`universal-card__description ${className}`} {...props}>
    {children}
  </p>
);

// PropTypes para sub-componentes
[UniversalCardHeader, UniversalCardBody, UniversalCardFooter, UniversalCardTitle, UniversalCardDescription].forEach(component => {
  component.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
  };
});

UniversalCardMedia.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  aspectRatio: PropTypes.oneOf(Object.keys(UNIVERSAL_CARD_TOKENS.aspectRatios)),
  objectFit: PropTypes.oneOf(['cover', 'contain', 'fill', 'none', 'scale-down']),
  className: PropTypes.string
};

UniversalCardTitle.propTypes = {
  children: PropTypes.node,
  as: PropTypes.oneOfType([PropTypes.string, PropTypes.elementType]),
  className: PropTypes.string
};

export { UniversalCard };
export default UniversalCard;
