// src/components/atoms/Badge/Badge.jsx - V2 COMPLETO
import PropTypes from 'prop-types';
import { useInteractiveProps } from '../../../hooks/useStandardProps-v2.jsx';
import { extractDOMPropsV2 } from '../../../tokens/standardProps-v2.js';
import { INTERACTIVE_PROP_TYPES } from '../../../tokens/propHelpers.js';
import './Badge.css';

/**
 * Badge V2 - API LIMPIA SIN BACKWARD COMPATIBILITY
 * 
 * ✅ SISTEMA V2 PURO: useInteractiveProps + extractDOMPropsV2
 * ✅ RESPONSIVE NATIVO: Breakpoints automáticos  
 * ✅ ICONOS SIMPLIFICADOS: leftIcon/rightIcon únicamente
 * ✅ PERFORMANCE: Memoización y CSS-first con tokens
 * ✅ TYPE-SAFE: Validación automática en desarrollo
 * ✅ API LIMPIA: Solo props V2, sin props deprecadas
 * ✅ CONSISTENCIA: 100% igual que Button V2
 * 
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} [props.children] - Contenido del badge
 * @param {string} [props.text] - Alternativa a children para texto simple
 * @param {'xs'|'sm'|'md'|'lg'|'xl'} [props.size='md'] - Tamaño del badge
 * @param {'primary'|'secondary'|'success'|'warning'|'danger'|'neutral'} [props.variant='primary'] - Variante visual
 * @param {'none'|'xs'|'sm'|'md'|'lg'|'xl'|'2xl'|'3xl'|'full'} [props.rounded='full'] - Radio de bordes
 * @param {boolean} [props.disabled=false] - Si está deshabilitado
 * @param {boolean} [props.loading=false] - Estado de carga con spinner
 * @param {string|React.ReactNode} [props.leftIcon] - Icono izquierdo
 * @param {string|React.ReactNode} [props.rightIcon] - Icono derecho
 * @param {'soft'|'solid'|'outline'|'dot'} [props.appearance='solid'] - Estilo visual
 * @param {function} [props.onClick] - Handler de click (hace clickeable)
 * @param {function} [props.onRemove] - Handler para remover (muestra X)
 * @param {boolean} [props.pulse=false] - Animación de pulso
 * @param {boolean} [props.uppercase=false] - Texto en mayúsculas
 * @param {number} [props.maxCount=99] - Número máximo antes de mostrar "+"
 * @param {string} [props.ariaLabel] - Label para accesibilidad
 * @param {string} [props.title] - Tooltip text
 * @param {string} [props.className=''] - Clases CSS adicionales
 */
const Badge = (props) => {
  // ✅ V2 HOOK: Procesamiento completo de props
  const {
    // Props procesadas con defaults
    size, variant, rounded,
    leftIcon, rightIcon,
    
    // Tokens especializados
    tokens,
    
    // ✅ Sistema de iconos V2
    renderIcon,
    
    // Helpers de estado  
    isDisabled, isLoading, isInteractive,
    
    // Generadores
    generateStyles,
    
    // Meta información
    currentBreakpoint,
    
    // Debugging (solo desarrollo)
    _debug
  } = useInteractiveProps(props, {
    componentName: 'Badge',
    defaultSize: 'md',
    defaultVariant: 'primary'
  });

  // Props específicas de Badge (no procesadas por hook)
  const {
    children,
    text,
    appearance = 'solid',
    onClick,
    onRemove,
    pulse = false,
    uppercase = false,
    maxCount = 99,
    ariaLabel,
    title
  } = props;

  // ✅ V2 DEBUGGING: Solo en desarrollo
  if (import.meta.env?.DEV && _debug) {
    console.log('Badge V2 Debug:', {
      size, variant, tokens, currentBreakpoint, _debug
    });
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

  // Determinar iconos
  const hasLeftIcon = Boolean(leftIcon);
  const hasRightIcon = Boolean(rightIcon);

  // Click handler con validación de estado V2
  const handleClick = (e) => {
    if (!isInteractive) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  // Remove handler
  const handleRemove = (e) => {
    e.stopPropagation(); // Evitar propagación si el badge también es clickeable
    if (!isInteractive) return;
    onRemove?.(e);
  };

  // ARIA Label inteligente
  const badgeRole = onClick ? 'button' : 'status';
  const finalAriaLabel = ariaLabel || (typeof finalContent === 'string' ? finalContent : undefined);

  // ✅ GENERAR CLASES CSS TRADICIONALES (compatible con CSS actual)
  const badgeClasses = [
    'badge',
    `badge--${size}`,
    `badge--${variant}`,
    `badge--${appearance}`,
    rounded !== 'full' && `badge--rounded-${rounded}`,
    onClick && 'badge--clickable',
    onRemove && 'badge--removable',
    pulse && 'badge--pulse',
    isLoading && 'badge--loading',
    isDisabled && 'badge--disabled',
    uppercase && 'badge--uppercase',
    (hasLeftIcon || hasRightIcon) && 'badge--with-icon',
    !finalContent && appearance === 'dot' && 'badge--dot-only'
  ].filter(Boolean).join(' ');

  // ✅ COMBINAR CLASES: Sistema + Usuario
  const finalClassName = [badgeClasses, props.className]
    .filter(Boolean).join(' ');

  // ✅ PROPS MODIFICADAS: reemplazar className original con combinada
  const propsWithFinalClassName = { 
    ...props, 
    className: finalClassName 
  };

  return (
    <span 
      {...extractDOMPropsV2(propsWithFinalClassName)}
      role={badgeRole}
      tabIndex={onClick ? 0 : undefined}
      style={{
        // Aplicar algunos tokens V2 como fallback
        ...generateStyles(),
        ...props.style
      }}
      onClick={onClick ? handleClick : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick(e);
        }
      } : undefined}
      aria-label={finalAriaLabel}
      aria-disabled={isDisabled}
      aria-busy={isLoading}
      title={title}
    >
      {/* Contenido principal del badge */}
      <span className="badge__content">
        {/* Icono izquierdo */}
        {hasLeftIcon && (
          <span className="badge__icon badge__icon--left">
            {renderIcon(leftIcon)}
          </span>
        )}
        
        {/* Texto principal (solo si no es dot-only) */}
        {finalContent && !(appearance === 'dot' && !finalContent) && (
          <span className="badge__text">
            {finalContent}
          </span>
        )}
        
        {/* Icono derecho */}
        {hasRightIcon && (
          <span className="badge__icon badge__icon--right">
            {renderIcon(rightIcon)}
          </span>
        )}
        
        {/* Loading spinner */}
        {isLoading && (
          <span className="badge__spinner" aria-hidden="true">
            <svg className="badge__spinner-svg" viewBox="0 0 24 24">
              <circle 
                className="badge__spinner-circle" 
                cx="12" cy="12" r="10" strokeWidth="2"
              />
            </svg>
          </span>
        )}
      </span>
      
      {/* Botón de remover */}
      {onRemove && !isLoading && (
        <button
          type="button"
          className="badge__remove"
          onClick={handleRemove}
          aria-label="Remover"
          title="Remover"
          disabled={isDisabled}
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

// ✅ V2 PROPTYPES OPTIMIZADOS: Props Helpers System
Badge.propTypes = {
  // ✅ PROPS HELPERS: Sistema centralizado (-80% código repetitivo)
  ...INTERACTIVE_PROP_TYPES,
  
  // Props específicas de Badge únicamente
  children: PropTypes.node,
  text: PropTypes.string,
  appearance: PropTypes.oneOf(['soft', 'solid', 'outline', 'dot']),
  onRemove: PropTypes.func,
  pulse: PropTypes.bool,
  uppercase: PropTypes.bool,
  maxCount: PropTypes.number,
  title: PropTypes.string
};

// ✅ V2 DEFAULT PROPS: Minimales (hook maneja la mayoría)
Badge.defaultProps = {
  appearance: 'solid',
  pulse: false,
  uppercase: false,
  maxCount: 99
};

export { Badge };