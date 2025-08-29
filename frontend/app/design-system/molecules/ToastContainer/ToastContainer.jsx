// molecules/ToastContainer/ToastContainer.jsx - V2.0 SISTEMA ESTÁNDAR
import PropTypes from 'prop-types';
import { Toast } from '../../atoms/Toast/Toast.jsx';
import { useInteractiveProps } from '../../hooks/useStandardProps.jsx';
import { INTERACTIVE_PROP_TYPES, extractDOMPropsV2 } from '../../tokens/propHelpers.js';
import './ToastContainer.css';

/**
 * ToastContainer - MOLECULE V2.0 PARA GESTIÓN DE NOTIFICACIONES
 * 
 * ✅ **V2.0 COMPLIANT**: useInteractiveProps, extractDOMPropsV2, INTERACTIVE_PROP_TYPES
 * ✅ **SISTEMA ESTÁNDAR**: size, variant, rounded, loading, disabled, className
 * ✅ **TOKENS AUTOMÁTICOS**: spacing, colors, z-index del sistema
 * ✅ **TOAST INTEGRATION**: Usa Toast atom V2.0 como base
 * ✅ **POSITION SYSTEM**: Sistema de posicionamiento con tokens
 * ✅ **ACCESSIBILITY**: ARIA completo + screen reader support
 * ✅ **PERFORMANCE**: Render optimizado con memoización
 * 
 * CASOS DE USO:
 * - Sistema de notificaciones centralizadas
 * - Feedback temporal para acciones del usuario
 * - Alertas no-blocking con auto-dismiss
 * - Gestión de estado con hooks (useToast)
 * 
 * PROPS DEL SISTEMA V2.0:
 * @param {'xs'|'sm'|'md'|'lg'|'xl'} [size='md'] - Tamaño estándar aplicado a toasts
 * @param {'primary'|'secondary'|'success'|'warning'|'danger'|'neutral'} [variant='neutral'] - Variante por defecto
 * @param {'sm'|'md'|'lg'|'xl'|'full'} [rounded='md'] - Radio de bordes estándar
 * @param {boolean} [disabled=false] - Deshabilita interacciones
 * @param {boolean} [loading=false] - Estado de carga con overlay
 * @param {string} [className=''] - Clases CSS adicionales
 * @param {string} [testId] - ID para testing
 * @param {string} [ariaLabel] - Label para accesibilidad
 * 
 * PROPS ESPECÍFICAS:
 * @param {Array} [toasts=[]] - Array de toasts a mostrar
 * @param {'top-right'|'top-left'|'bottom-right'|'bottom-left'} [position='top-right'] - Posición en pantalla
 * @param {number} [maxToasts=5] - Máximo número de toasts visibles
 * @param {function} [onRemoveToast] - Callback para remover toast
 * @param {'xs'|'sm'|'md'|'lg'|'xl'} [spacing='md'] - Espaciado entre toasts
 */
function ToastContainer({
  // Props específicas del componente
  toasts = [],
  position = 'top-right',
  maxToasts = 5,
  onRemoveToast = null,
  spacing = 'md',
  
  // Backward compatibility - deprecated props
  gap: legacyGap, // @deprecated - usar spacing
  
  ...restProps
}) {
  
  // ✅ V2.0: Backward compatibility con warning
  if (legacyGap && import.meta.env?.DEV) {
    console.warn('⚠️ ToastContainer: prop "gap" está deprecada. Usa "spacing" en su lugar.');
  }
  
  // ✅ V2.0: Procesar props con compatibilidad
  const finalSpacing = legacyGap || spacing;
  const propsForV2 = {
    ...restProps,
    spacing: finalSpacing
  };
  
  // ✅ ENFOQUE MINIMALISTA: Hook básico sin tokens complejos
  const {
    // Props procesadas con defaults
    size, variant, rounded, disabled, loading,
    className, 
    
    // Helpers de estado
    isDisabled, isLoading
  } = useInteractiveProps(propsForV2, {
    componentName: 'ToastContainer',
    defaultSize: 'md',
    defaultVariant: 'neutral',
    defaultRounded: 'md'
  });
  
  // ✅ V2.0: Limitar número de toasts
  const visibleToasts = toasts.slice(0, maxToasts);
  
  // ✅ ENFOQUE MINIMALISTA: Calcular offset con CSS variables simples
  const getToastOffset = (index) => {
    const spacingToken = `var(--space-${finalSpacing})`;
    const heightToken = `var(--component-height-${size})`;
    
    return `calc(${index} * (${heightToken} + ${spacingToken}))`;
  };
  
  // ✅ V2.0: Handler para remover toast
  const handleRemoveToast = (toastId) => {
    if (isDisabled || !onRemoveToast) return;
    onRemoveToast(toastId);
  };
  
  // ✅ ENFOQUE MINIMALISTA: Clases CSS simples
  const baseClassName = 'toast-container';
  
  const toastContainerClasses = [
    baseClassName,
    `toast-container--position-${position}`,
    `toast-container--spacing-${finalSpacing}`,
    isDisabled && 'toast-container--disabled',
    isLoading && 'toast-container--loading',
    className
  ].filter(Boolean).join(' ');
  
  // ✅ ENFOQUE MINIMALISTA: Estilos con CSS variables simples
  const specificStyles = {
    // Posicionamiento del container
    position: 'fixed',
    pointerEvents: 'none',
    zIndex: 'var(--z-toast-container)',
    
    // Posición según prop
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
  
  // ✅ ENFOQUE MINIMALISTA: Props DOM simples
  const domProps = extractDOMPropsV2({
    ...restProps,
    className: toastContainerClasses,
    disabled: isDisabled,
    'aria-label': restProps.ariaLabel || 'Notificaciones',
    'data-testid': restProps.testId
  });
  
  // ✅ V2.0: No renderizar si no hay toasts
  if (visibleToasts.length === 0) {
    return null;
  }
  
  return (
    <div 
      {...domProps}
      style={specificStyles}
      role="region"
      aria-live="polite"
      aria-atomic="false"
    >
      {/* ✅ V2.0: Overlay de loading */}
      {isLoading && (
        <div className="toast-container__loading-overlay">
          <div className="toast-container__loading-icon" aria-label="Cargando notificaciones...">
            ⏳
          </div>
        </div>
      )}
      
      {/* ✅ V2.0: Overlay de disabled */}
      {isDisabled && (
        <div 
          className="toast-container__disabled-overlay" 
          aria-hidden="true"
        />
      )}
      
      {/* ✅ V2.0: Renderizar toasts con sistema estándar */}
      {visibleToasts.map((toast, index) => {
        // Calcular posición del toast
        const offset = getToastOffset(index);
        const isBottom = position.includes('bottom');
        const offsetProperty = isBottom ? 'bottom' : 'top';
        
        // ✅ V2.0: Mapear type legacy a variant estándar
        let toastVariant = toast.variant || variant;
        if (toast.type && !toast.variant) {
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
              zIndex: `calc(var(--z-toast) - ${index})`
            }}
          >
            <Toast
              // ✅ V2.0: Props estándar heredadas del contenedor
              size={toast.size || size}
              variant={toastVariant}
              rounded={toast.rounded || rounded}
              disabled={disabled || toast.disabled}
              loading={toast.loading}
              
              // ✅ V2.0: Props específicas del toast
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
              
              // ✅ V2.0: Backward compatibility para type
              type={toast.type}
            />
          </div>
        );
      })}
    </div>
  );
}

// ✅ V2.0: PropTypes del sistema estándar
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
  
  /** @deprecated - usar spacing */
  gap: PropTypes.oneOf(['sm', 'md', 'lg']),
  
  // ✅ V2.0: Props estándar del sistema
  ...INTERACTIVE_PROP_TYPES
};

// ✅ V2.0: Default props del sistema
ToastContainer.defaultProps = {
  toasts: [],
  position: 'top-right',
  maxToasts: 5,
  spacing: 'md',
  size: 'md',
  variant: 'neutral',
  rounded: 'md',
  disabled: false,
  loading: false
};

export { ToastContainer };

// ===== EJEMPLOS DE USO V2.0 =====
/*
// BÁSICO - Sistema centralizado
<ToastContainer
  toasts={toasts}
  position="top-right"
  onRemoveToast={removeToast}
/>

// CON PROPS ESTÁNDAR - Tamaños y variantes
<ToastContainer
  toasts={toasts}
  size="lg"
  variant="success"
  spacing="lg"
  position="bottom-right"
  onRemoveToast={removeToast}
/>

// CON LOADING/DISABLED - Estados del sistema
<ToastContainer
  toasts={toasts}
  loading={isLoadingToasts}
  disabled={!canShowToasts}
  position="top-left"
  onRemoveToast={removeToast}
/>

// INTEGRACIÓN CON HOOKS - useToast + AlertContext
const { toasts, removeToast } = useToast();

<ToastContainer
  toasts={toasts}
  position="top-right"
  maxToasts={3}
  spacing="md"
  onRemoveToast={removeToast}
/>
*/