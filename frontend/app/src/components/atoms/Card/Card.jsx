// atoms/Card.jsx
import PropTypes from 'prop-types';
import { useCardProps } from '../../../hooks/useStandardProps.jsx';
import { STANDARD_PROP_TYPES } from '../../../tokens/standardProps.js';
import './Card.css';

/**
 * Componente Card - Átomo base para contenedores
 * 🎯 MIGRADO AL SISTEMA DE DISEÑO ESTÁNDAR
 * 
 * ✅ NUEVAS CARACTERÍSTICAS:
 * - Hook useCardProps() integrado para consistencia
 * - Props estándar (size, variant, rounded) con tokens automáticos
 * - Backward compatibility con padding (DEPRECADO)
 * - STANDARD_PROP_TYPES para validación consistente
 * 
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Contenido de la card
 * @param {'xs'|'sm'|'md'|'lg'|'xl'} [props.size='md'] - Tamaño estándar (reemplaza padding)
 * @param {'primary'|'secondary'|'success'|'warning'|'danger'|'neutral'} [props.variant='neutral'] - Variante semántica estándar
 * @param {'sm'|'md'|'lg'|'xl'|'full'} [props.rounded='lg'] - Radio de bordes estándar
 * @param {boolean} [props.disabled=false] - Estado deshabilitado (bloquea interacción)
 * @param {boolean} [props.loading=false] - Estado de carga con shimmer effect
 * @param {string} [props.className=''] - Clases CSS adicionales
 * @param {string} [props.ariaLabel] - Label para accesibilidad
 * 
 * @param {boolean} [props.hoverable=false] - Si tiene efecto hover
 * @param {boolean} [props.clickable=false] - Si es clickeable (alternativa a onClick)
 * @param {function} [props.onClick] - Función a ejecutar al hacer clic
 * @param {string} [props.maxWidth] - Ancho máximo de la card
 * @param {boolean} [props.fullWidth=false] - Si ocupa todo el ancho disponible
 * @param {'sm'|'md'|'lg'|'xl'|'none'} [props.shadow='md'] - Sombra de la card
 * @param {string} [props.role] - Rol ARIA (se define automáticamente si es clickeable)
 * @param {number} [props.tabIndex] - Tab index (se define automáticamente si es clickeable)
 * 
 * 🗂️ PROPS DEPRECADAS (con backward compatibility):
 * @param {'xs'|'sm'|'md'|'lg'|'xl'|'2xl'} [props.padding] - DEPRECADO: Usar size en su lugar
 * @param {'default'|'elevated'|'outlined'} [props.variant] - DEPRECADO: default → neutral
 */
const Card = (props) => {
  // MIGRACIÓN: Destructuring temporal para backward compatibility
  const {
    children,
    // Props específicas de Card (no estándar)
    hoverable = false,
    clickable = false,
    onClick,
    maxWidth,
    fullWidth = false,
    shadow = 'md',
    role,
    tabIndex,
    padding,
    variant: originalVariant,
    ...rawProps
  } = props;

  // MIGRACIÓN: Backward compatibility para props deprecadas
  let processedProps = { ...rawProps };
  
  // 1. PADDING → SIZE mapping con deprecation warning
  if (padding && !rawProps.size) {
    const paddingToSizeMap = {
      'xs': 'xs',    // padding xs → size xs
      'sm': 'sm',    // padding sm → size sm  
      'md': 'md',    // padding md → size md
      'lg': 'lg',    // padding lg → size lg
      'xl': 'xl',    // padding xl → size xl
    };
    
    processedProps.size = paddingToSizeMap[padding] || 'md';
    
    if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
      console.warn(`Card: prop "padding" está deprecada. Usar size="${processedProps.size}" en su lugar.`);
    }
  }
  
  // 2. VARIANT mapping con backward compatibility  
  if (originalVariant === 'default') {
    processedProps.variant = 'neutral';
    
    if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
      console.warn(`Card: variant="default" está deprecado. Usar variant="neutral" en su lugar.`);
    }
  } else if (originalVariant === 'elevated' || originalVariant === 'outlined') {
    // Estas variantes se manejan como appearance, no variant semántica
    processedProps.variant = 'neutral'; 
    processedProps.appearance = originalVariant; // Mantener para lógica CSS
  } else if (originalVariant) {
    processedProps.variant = originalVariant;
  }
  
  // ✅ MIGRACIÓN: Usar hook estándar del sistema
  const standardProps = useCardProps(processedProps);
  const { 
    size, variant, rounded, disabled, loading, className, tokens 
  } = standardProps;

  // Determinar si la card es interactiva
  const isInteractive = !!(onClick || clickable);
  
  // ✅ NUEVO: Construir clases CSS con sistema adaptativo como Modal
  const cardClasses = [
    'card',
    // Tamaño del sistema: define max-width y padding automáticamente
    `card--size-${size}`,
    // Variante semántica estándar o appearance legacy
    processedProps.appearance ? `card--${processedProps.appearance}` : `card--variant-${variant}`,
    // Border radius del sistema
    `card--rounded-${rounded}`,
    // Shadow
    shadow !== 'none' && `card--shadow-${shadow}`,
    // Estados interactivos
    (hoverable || isInteractive) && 'card--hoverable',
    isInteractive && 'card--clickable',
    // Estados del sistema
    disabled && 'card--disabled',
    loading && 'card--loading',
    // Clases personalizadas
    className
  ].filter(Boolean).join(' ');

  // Estilos inline solo cuando sea necesario
  const cardStyles = {
    // Solo override si se especifica manualmente
    maxWidth: maxWidth || undefined,
    width: fullWidth ? '100%' : undefined
  };

  // ✅ MIGRACIÓN: Props de accesibilidad con sistema estándar
  const accessibilityProps = {
    role: role || (isInteractive ? 'button' : undefined),
    tabIndex: tabIndex !== undefined ? tabIndex : (isInteractive ? 0 : undefined),
    'aria-label': standardProps.ariaLabel,
    'aria-disabled': (disabled || loading) ? 'true' : undefined
  };

  // ✅ MIGRACIÓN: Handler de click con estado disabled
  const handleClick = (e) => {
    if (disabled || loading) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  // ✅ MIGRACIÓN: Handler de teclado con estado disabled
  const handleKeyDown = (e) => {
    if (!isInteractive || disabled || loading) return;
    
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.(e);
    }
  };

  return (
    <div 
      className={cardClasses}
      style={cardStyles}
      onClick={isInteractive ? handleClick : undefined}
      onKeyDown={isInteractive ? handleKeyDown : undefined}
      {...accessibilityProps}
      // ✅ MIGRACIÓN: Pasar props que no fueron procesados por el hook
      {...Object.fromEntries(
        Object.entries(props).filter(([key]) => 
          !['size', 'variant', 'rounded', 'disabled', 'loading', 'className', 'ariaLabel',
            'children', 'hoverable', 'clickable', 'onClick', 'maxWidth', 'fullWidth', 
            'shadow', 'role', 'tabIndex', 'padding', 'leftIcon', 'rightIcon', 'iconOnly',
            'tokens', 'renderIcon', 'hasLeftIcon', 'hasRightIcon', 'hasAnyIcon',
            'isDisabled', 'isLoading', 'isEmpty'].includes(key)
        )
      )}
    >
      {children}
    </div>
  );
};

// Componentes auxiliares para estructura de la card
const CardHeader = ({ children, className = '', ...props }) => (
  <div {...props} className={`card__header ${className}`}>
    {children}
  </div>
);

const CardBody = ({ children, className = '', ...props }) => (
  <div {...props} className={`card__body ${className}`}>
    {children}
  </div>
);

const CardFooter = ({ children, className = '', ...props }) => (
  <div {...props} className={`card__footer ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ children, className = '', as: Component = 'h3', ...props }) => (
  <Component {...props} className={`card__title ${className}`}>
    {children}
  </Component>
);

const CardSubtitle = ({ children, className = '', as: Component = 'p', ...props }) => (
  <Component {...props} className={`card__subtitle ${className}`}>
    {children}
  </Component>
);

const CardDescription = ({ children, className = '', as: Component = 'p', ...props }) => (
  <Component {...props} className={`card__description ${className}`}>
    {children}
  </Component>
);

// ===== VALIDACIÓN DE PROPTYPES =====

// ✅ MIGRACIÓN: PropTypes con sistema estándar + Card específicos
Card.propTypes = {
  children: PropTypes.node,
  
  // ✅ Props estándar del sistema de diseño
  ...STANDARD_PROP_TYPES,
  
  // ✅ Props específicas de Card
  hoverable: PropTypes.bool,
  clickable: PropTypes.bool,
  onClick: PropTypes.func,
  maxWidth: PropTypes.string,
  fullWidth: PropTypes.bool,
  shadow: PropTypes.oneOf(['sm', 'md', 'lg', 'xl', 'none']),
  role: PropTypes.string,
  tabIndex: PropTypes.number,
  
  // 🗂️ Props deprecadas (mantener para backward compatibility)
  padding: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', '2xl']),
  variant: PropTypes.oneOf([
    // Nuevas variantes estándar
    'primary', 'secondary', 'success', 'warning', 'danger', 'neutral',
    // Legacy variants (deprecadas)
    'default', 'elevated', 'outlined'
  ])
};

// PropTypes para componentes auxiliares
CardHeader.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

CardBody.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

CardFooter.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

CardTitle.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  as: PropTypes.elementType
};

CardSubtitle.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  as: PropTypes.elementType
};

CardDescription.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  as: PropTypes.elementType
};

// Exportar componente principal y auxiliares
export { 
  Card, 
  CardHeader, 
  CardBody, 
  CardFooter, 
  CardTitle, 
  CardSubtitle, 
  CardDescription 
};