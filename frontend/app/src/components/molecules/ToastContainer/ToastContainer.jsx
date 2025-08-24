// molecules/ToastContainer/ToastContainer.jsx
import PropTypes from 'prop-types';
import { Toast } from '../../atoms/Toast/Toast';
import { useInteractiveProps } from '../../../hooks/useStandardProps-v2.jsx';
import { INTERACTIVE_PROP_TYPES, extractDOMPropsV2 } from '../../../tokens/standardProps-v2.js';
import './ToastContainer.css';

/**
 * ToastContainer - Contenedor para gestionar múltiples toasts
 * 
 * ✅ **MIGRADO AL SISTEMA ESTÁNDAR**
 * 
 * Características:
 * - ✅ Hook useStandardProps() integrado
 * - ✅ Props estándar (size, variant, rounded, loading, disabled)
 * - ✅ Sistema de posicionamiento con tokens automáticos
 * - ✅ Integración Toast migrado del sistema estándar
 * - ✅ Gestión automática de stacking y límites
 * - ✅ Estados loading/disabled con overlays visuales
 * - ✅ Backward compatibility con deprecation warnings
 * - ✅ Accesibilidad completa ARIA + animaciones adaptativas
 * 
 * **Props específicas del componente:**
 * @param {Array} [toasts=[]] - Array de toasts a mostrar
 * @param {string} [position='top-right'] - Posición en pantalla
 * @param {number} [maxToasts=5] - Máximo número de toasts visibles
 * @param {function} [onRemoveToast] - Callback para remover toast
 * @param {string} [spacing='md'] - Espaciado entre toasts (reemplaza gap legacy)
 * 
 * **Props estándar del sistema:**
 * @param {'xs'|'sm'|'md'|'lg'|'xl'} [size='md'] - Tamaño estándar aplicado a toasts
 * @param {'primary'|'secondary'|'success'|'warning'|'danger'|'neutral'} [variant='neutral'] - Variante por defecto
 * @param {'sm'|'md'|'lg'|'xl'|'full'} [rounded='md'] - Radio de bordes estándar
 * @param {boolean} [disabled=false] - Deshabilita interacciones
 * @param {boolean} [loading=false] - Estado de carga
 * @param {string} [className=''] - Clases CSS adicionales
 * @param {string} [testId] - ID para testing
 * @param {string} [ariaLabel] - Label para accesibilidad
 */
function ToastContainer({
  // Props específicas del componente
  toasts = [],
  position = 'top-right', // 'top-right', 'top-left', 'bottom-right', 'bottom-left'
  maxToasts = 5,
  onRemoveToast = null,
  spacing = 'md', // Reemplaza gap legacy
  
  // Backward compatibility - mapeo automático
  gap: legacyGap,
  
  ...restProps
}) {
  
  // Backward compatibility: mapear props legacy
  const propsWithCompatibility = { ...restProps };
  
  // ✅ V2: Mapear gap legacy a spacing estándar con warning solo en desarrollo
  if (legacyGap && import.meta.env?.DEV) {
    console.warn('⚠️ ToastContainer: prop "gap" está deprecada. Usa "spacing" en su lugar.');
  }
  if (legacyGap) {
    propsWithCompatibility.spacing = legacyGap;
  } else if (spacing) {
    propsWithCompatibility.spacing = spacing;
  }
  
  // ✅ V2: Hook del sistema de diseño
  const {
    // Props procesadas con defaults
    size, variant, rounded, disabled, loading,
    className, ariaLabel, testId,
    
    // Tokens especializados
    tokens,
    
    // Generadores V2
    generateStyles,
    generateClassName,
    
    // Helpers de estado
    isDisabled, isLoading,
    
    // Contexto de iconos
    renderIcon,
    
    // Resto de props estándar
    ...standardProps
  } = useInteractiveProps(propsWithCompatibility, {
    componentName: 'ToastContainer',
    defaultSize: 'md',
    defaultVariant: 'neutral'
  });
  
  // Usar spacing del sistema o fallback
  const finalSpacing = propsWithCompatibility.spacing || spacing;
  
  // Limitar número de toasts
  const visibleToasts = toasts.slice(0, maxToasts);
  
  // ✅ V2: Calcular offset usando sistema de tokens
  const getToastOffset = (index) => {
    // Usar tokens del hook V2
    const spacingValue = tokens.spacing || tokens.space?.md || 'var(--space-md)';
    const heightValue = tokens.height || tokens.size?.height || 'var(--component-height-md)';
    
    // Calcular offset usando CSS calc y variables
    return `calc(${index} * (${heightValue} + ${spacingValue}))`;
  };
  
  // Manejar cierre de toast
  const handleRemoveToast = (toastId) => {
    if (onRemoveToast) {
      onRemoveToast(toastId);
    }
  };
  
  // ✅ V2: Generar clases CSS con sistema estándar
  const baseClassName = generateClassName('toast-container');
  
  const toastContainerClasses = [
    baseClassName,
    `toast-container--position-${position}`,
    `toast-container--spacing-${finalSpacing}`,
    isDisabled && 'toast-container--disabled',
    isLoading && 'toast-container--loading',
    className
  ].filter(Boolean).join(' ');
  
  // ✅ V2: Props seguros para DOM
  const propsForDOM = { 
    ...standardProps,
    className: toastContainerClasses,
    disabled: isDisabled,
    ariaLabel,
    testId
  };

  const domProps = extractDOMPropsV2(propsForDOM);
  
  // ✅ V2: Estilos específicos del ToastContainer
  const specificStyles = {
    // Posicionamiento específico del ToastContainer
    position: 'fixed',
    pointerEvents: 'none',
    zIndex: 'var(--z-toast-container)', 
    
    // Posición según prop position
    ...(position === 'top-right' && {
      top: 'var(--space-lg)',
      right: 'var(--space-lg)'
    }),
    ...(position === 'top-left' && {
      top: 'var(--space-lg)',
      left: 'var(--space-lg)'
    }),
    ...(position === 'bottom-right' && {
      bottom: 'var(--space-lg)',
      right: 'var(--space-lg)'
    }),
    ...(position === 'bottom-left' && {
      bottom: 'var(--space-lg)',
      left: 'var(--space-lg)'
    })
  };
  
  // No renderizar si no hay toasts
  if (visibleToasts.length === 0) {
    return null;
  }
  
  return (
    <div 
      className={toastContainerClasses}
      style={generateStyles(specificStyles)}
      role="region"
      aria-label={ariaLabel || "Notificaciones"}
      aria-live="polite"
      aria-atomic="false"
      {...domProps}
    >
      {/* ✅ V2: Overlay de loading usando isLoading del hook */}
      {isLoading && (
        <div className="toast-container__loading-overlay">
          {renderIcon('loading', 'md', 'neutral', {
            className: 'toast-container__loading-icon',
            'aria-label': 'Cargando notificaciones...'
          })}
        </div>
      )}
      
      {/* ✅ V2: Overlay de disabled usando isDisabled del hook */}
      {isDisabled && (
        <div 
          className="toast-container__disabled-overlay" 
          aria-hidden="true"
          style={{
            ...generateStyles({
              position: 'absolute',
              inset: 0,
              backgroundColor: 'var(--overlay-disabled)',
              pointerEvents: 'none'
            })
          }}
        />
      )}
      {visibleToasts.map((toast, index) => {
        // Calcular posición del toast
        const offset = getToastOffset(index);
        const isBottom = position.includes('bottom');
        const offsetProperty = isBottom ? 'bottom' : 'top';
        
        // Mapear type legacy a variant estándar si es necesario
        let toastVariant = toast.variant || toast.type;
        if (toast.type && !toast.variant) {
          // Backward compatibility: type → variant
          const typeToVariantMap = {
            'info': 'primary',
            'error': 'danger'
          };
          toastVariant = typeToVariantMap[toast.type] || toast.type;
        }
        
        return (
          <div
            key={toast.id}
            className="toast-container__item"
            style={{
              [offsetProperty]: offset,
              zIndex: `calc(var(--z-toast) - ${index})` // ✅ V2: Z-index del sistema
            }}
          >
            <Toast
              // Props estándar heredadas del contenedor
              size={toast.size || size}
              variant={toastVariant || variant}
              rounded={toast.rounded || rounded}
              disabled={disabled || toast.disabled}
              loading={toast.loading}
              
              // Props específicas del toast
              isOpen={toast.isOpen}
              title={toast.title}
              message={toast.message}
              position={position}
              autoClose={toast.autoClose}
              autoCloseDelay={toast.autoCloseDelay}
              action={toast.action}
              showCloseButton={toast.showCloseButton}
              onClose={() => handleRemoveToast(toast.id)}
              onAutoClose={toast.onAutoClose}
              
              // Backward compatibility para type
              type={toast.type} // Toast migrado maneja esta conversión internamente
            />
          </div>
        );
      })}
    </div>
  );
}

ToastContainer.propTypes = {
  /** Array de toasts a mostrar */
  toasts: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    isOpen: PropTypes.bool,
    title: PropTypes.string,
    message: PropTypes.string,
    autoClose: PropTypes.bool,
    autoCloseDelay: PropTypes.number,
    action: PropTypes.shape({
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired
    }),
    showCloseButton: PropTypes.bool,
    onAutoClose: PropTypes.func,
    
    // Props del sistema estándar específicas por toast
    size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
    variant: PropTypes.oneOf(['primary', 'secondary', 'success', 'warning', 'danger', 'neutral']),
    rounded: PropTypes.oneOf(['sm', 'md', 'lg', 'xl', 'full']),
    disabled: PropTypes.bool,
    loading: PropTypes.bool,
    
    // Backward compatibility
    type: PropTypes.oneOf(['success', 'error', 'warning', 'info'])
  })),
  
  /** Posición en pantalla */
  position: PropTypes.oneOf(['top-right', 'top-left', 'bottom-right', 'bottom-left']),
  
  /** Máximo número de toasts visibles */
  maxToasts: PropTypes.number,
  
  /** Espaciado entre toasts (sistema estándar) */
  spacing: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  
  /** Callback para remover toast */
  onRemoveToast: PropTypes.func,
  
  /** Props legacy con backward compatibility */
  gap: PropTypes.oneOf(['sm', 'md', 'lg']), // @deprecated
  
  // ✅ Props estándar del sistema V2
  ...INTERACTIVE_PROP_TYPES
};

export { ToastContainer };